// firebase.js
// Cliente CRUD para Cloud Firestore (Google Apps Script).
//
// Autenticación: cuenta de servicio. Se firma un JWT con la clave privada
// (RS256) y se intercambia por un access_token en oauth2.googleapis.com.
// Las credenciales se leen de Script Properties; NUNCA se escriben aquí.
//
// Variables requeridas (Project Settings > Script properties):
//   FIREBASE_PROJECT_ID     -> ID del proyecto (p. ej. "mi-proyecto-123")
//   FIREBASE_CLIENT_EMAIL   -> email de la service account
//   FIREBASE_PRIVATE_KEY    -> clave privada ("-----BEGIN PRIVATE KEY----- ...")

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FIRESTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const FIRESTORE_BASE = "https://firestore.googleapis.com/v1";

class Firestore {
  constructor() {
    const props = PropertiesService.getScriptProperties();
    this.projectId = props.getProperty("FIREBASE_PROJECT_ID");
    this.clientEmail = props.getProperty("FIREBASE_CLIENT_EMAIL");
    this.privateKey = props.getProperty("FIREBASE_PRIVATE_KEY");

    if (!this.projectId || !this.clientEmail || !this.privateKey) {
      throw new Error(
        "Firestore: faltan credenciales. Configura FIREBASE_PROJECT_ID, " +
          "FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY en Script Properties."
      );
    }

    this._token = null;
    this._tokenExpiresAt = 0;
    this._keyBytes = null;
  }

  // Devuelve la lista de documentos de una colección.
  // Ej.: db.getCollection("users")
  getCollection(collection) {
    const data = this._request("get", this._collectionUrl(collection));
    return (data.documents || []).map((doc) => this._toJsDoc(doc));
  }

  // Devuelve un documento por su ID, o null si no existe.
  // Ej.: db.getDocument("users", "abc123")
  getDocument(collection, documentId) {
    try {
      return this._toJsDoc(this._request("get", this._documentUrl(collection, documentId)));
    } catch (error) {
      if (error.status === 404) return null;
      throw error;
    }
  }

  // Crea un documento. Sin documentId Firestore genera un id automático.
  // Devuelve { id } del documento creado.
  // Ej.: db.createDocument("users", { name: "Ana" })
  createDocument(collection, data, documentId) {
    const url =
      this._collectionUrl(collection) +
      (documentId ? "?documentId=" + encodeURIComponent(documentId) : "");
    const created = this._request("post", url, { fields: this._encodeFields(data) });
    return { id: this._extractId(created.name) };
  }

  // Actualiza parcialmente un documento: solo cambia los campos indicados,
  // el resto se conserva. Nota: si el documento no existe, Firestore lo crea.
  // Devuelve el documento actualizado.
  // Ej.: db.updateDocument("users", "abc123", { name: "Ana María" })
  updateDocument(collection, documentId, data) {
    const fields = this._encodeFields(data);
    const updated = this._request("patch", this._documentUrl(collection, documentId), {
      fields: fields,
      // updateMask limita el cambio a los campos enviados.
      updateMask: { fieldPaths: Object.keys(fields) },
    });
    return this._toJsDoc(updated);
  }

  // Elimina un documento. No devuelve nada.
  // Ej.: db.deleteDocument("users", "abc123")
  deleteDocument(collection, documentId) {
    this._request("delete", this._documentUrl(collection, documentId));
  }

  // ---------------------------------------------------------------------------
  // Interno: token de acceso, peticiones HTTP y conversión de datos.
  // ---------------------------------------------------------------------------

  // Obtiene (y cachea) un access_token de la service account.
  _getAccessToken() {
    const now = Date.now();
    if (this._token && now < this._tokenExpiresAt) {
      return this._token;
    }

    const iat = Math.floor(now / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const claims = {
      iss: this.clientEmail,
      scope: FIRESTORE_SCOPE,
      aud: TOKEN_URL,
      iat: iat,
      exp: iat + 3600,
    };

    const signingInput =
      this._base64Url(JSON.stringify(header)) + "." + this._base64Url(JSON.stringify(claims));
    const signature = Utilities.computeRsaSha256Signature(this._getKeyBytes(), signingInput);
    const jwt = signingInput + "." + this._base64Url(signature);

    const response = UrlFetchApp.fetch(TOKEN_URL, {
      method: "post",
      contentType: "application/x-www-form-urlencoded",
      payload:
        "grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=" +
        encodeURIComponent(jwt),
      muteHttpExceptions: true,
    });

    const body = JSON.parse(response.getContentText());
    if (body.error !== undefined) {
      throw new Error("Firestore: no se pudo obtener el token OAuth2 -> " + response.getContentText());
    }

    // Se renueva 60s antes de expirar para evitar rechazos por el límite.
    this._token = body.access_token;
    this._tokenExpiresAt = now + (body.expires_in - 60) * 1000;
    return this._token;
  }

  // Extrae los bytes DER de la clave privada (soporta el formato PEM y el "\n"
  // escapado que se obtiene al pegar el JSON de la service account).
  _getKeyBytes() {
    if (!this._keyBytes) {
      const pem = String(this.privateKey)
        .trim()
        .replace(/\\n/g, "\n")
        .replace(/-----BEGIN [A-Z ]+-----/g, "")
        .replace(/-----END [A-Z ]+-----/g, "")
        .replace(/\s+/g, "");
      this._keyBytes = Utilities.base64Decode(pem);
    }
    return this._keyBytes;
  }

  _collectionUrl(collection) {
    return (
      FIRESTORE_BASE +
      "/projects/" +
      this.projectId +
      "/databases/(default)/documents/" +
      encodeURIComponent(collection)
    );
  }

  _documentUrl(collection, documentId) {
    return this._collectionUrl(collection) + "/" + encodeURIComponent(documentId);
  }

  _request(method, url, body) {
    const options = {
      method: method,
      muteHttpExceptions: true,
      headers: { Authorization: "Bearer " + this._getAccessToken() },
    };
    if (body !== undefined) {
      options.contentType = "application/json";
      options.payload = JSON.stringify(body);
    }

    let response;
    try {
      response = UrlFetchApp.fetch(url, options);
    } catch (error) {
      throw new Error("Firestore: fallo de red en " + method + " " + url + " -> " + error);
    }

    const status = response.getResponseCode();
    const text = response.getContentText();
    if (status < 200 || status >= 300) {
      const error = new Error("Firestore " + method + " " + url + " -> HTTP " + status + ": " + text);
      error.status = status; // facilita distinguir 404 (documento no existente)
      throw error;
    }

    return text === "" ? null : JSON.parse(text);
  }

  // Documento Firestore -> objeto JS. Evita usar "id" como nombre de campo
  // propio, porque el id interno del documento tiene prioridad al sobreescribir.
  _toJsDoc(doc) {
    return { id: this._extractId(doc.name), ...this._decodeFields(doc.fields) };
  }

  _extractId(documentName) {
    const parts = documentName.split("/");
    return parts[parts.length - 1];
  }

  _base64Url(bytesOrString) {
    const encoded =
      typeof bytesOrString === "string"
        ? Utilities.base64EncodeWebSafe(bytesOrString, Utilities.Charset.UTF_8)
        : Utilities.base64EncodeWebSafe(bytesOrString);
    return encoded.replace(/=+$/, ""); // el JWT no admite el padding
  }

  // JS -> Firestore
  _encodeFields(data) {
    const fields = {};
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        fields[key] = this._encodeValue(data[key]);
      }
    });
    return fields;
  }

  _encodeValue(value) {
    if (value === null) return { nullValue: null };
    if (typeof value === "boolean") return { booleanValue: value };
    if (typeof value === "number") {
      // Los enteros viajan como string para no perder precisión ante campos grandes.
      return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    }
    if (typeof value === "string") return { stringValue: value };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (Array.isArray(value)) return { arrayValue: { values: value.map((v) => this._encodeValue(v)) } };
    if (typeof value === "object") return { mapValue: { fields: this._encodeFields(value) } };
    throw new Error("Firestore: tipo de dato no soportado -> " + typeof value);
  }

  // Firestore -> JS
  _decodeFields(fields) {
    const result = {};
    Object.keys(fields || {}).forEach((key) => {
      result[key] = this._decodeValue(fields[key]);
    });
    return result;
  }

  _decodeValue(value) {
    if (value.nullValue !== undefined) return null;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.timestampValue !== undefined) return new Date(value.timestampValue);
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.referenceValue !== undefined) return value.referenceValue;
    if (value.geoPointValue !== undefined) return value.geoPointValue;
    if (value.bytesValue !== undefined) return value.bytesValue;
    if (value.arrayValue !== undefined) return (value.arrayValue.values || []).map((v) => this._decodeValue(v));
    if (value.mapValue !== undefined) return this._decodeFields(value.mapValue.fields);
    return null;
  }
}

module.exports = { Firestore };