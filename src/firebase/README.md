# Firestore

Clase sencilla de **Google Apps Script** para conectarse a Cloud Firestore (CRUD vía API REST) usando una cuenta de servicio.

## Configuración previa

Credenciales de la service account (proyecto GCP con Cloud Firestore habilitado, rol `roles/datastore.user`, clave JSON descargada) en **Script Properties** del proyecto:

- `FIREBASE_PROJECT_ID` — ID del proyecto (p. ej. `mi-proyecto-123`)
- `FIREBASE_CLIENT_EMAIL` — email de la service account
- `FIREBASE_PRIVATE_KEY` — clave privada (`-----BEGIN PRIVATE KEY----- ...`)

Las credenciales **nunca** van en el código; se leen con `PropertiesService`.

## Autenticación

Apps Script no usa el SDK oficial de Firebase. La clase:

1. Firma un **JWT** (RS256) con la clave privada usando `Utilities.computeRsaSha256Signature`.
2. Lo intercambia por un `access_token` en `https://oauth2.googleapis.com/token`.
3. Llama a Firestore con `Authorization: Bearer <token>`.

El token se cachea en memoria y se renueva antes de expirar. Autentica por **IAM** (service account), por lo que no depende de las Security Rules.

## Uso

```js
const db = new Firestore();

db.getCollection("users");                    // [{ id, ...campos }, ...]
db.getDocument("users", "abc123");            // { id, ...campos } | null si no existe
db.createDocument("users", { name: "Ana" });          // { id } (id auto-generado)
db.createDocument("users", { name: "Ana" }, "abc123"); // { id } (id explícito)
db.updateDocument("users", "abc123", { name: "Ana M." }); // merge parcial, devuelve el doc
db.deleteDocument("users", "abc123");
```

## Comportamientos

- `getDocument` devuelve `null` ante un 404 (documento inexistente).
- `updateDocument` actualiza solo los campos indicados (`updateMask`); el resto se conserva. Si el documento no existe, Firestore lo crea.
- Tipos de datos soportados: `null`, booleanos, números (enteros se envían como string para no perder precisión), strings, `Date`, arrays y objetos anidados.
- Evita usar `id` como nombre de campo propio: el `id` interno del documento tiene prioridad.
- Los errores se lanzan como `Error` con el código HTTP y el cuerpo de la respuesta (`error.status` permite distinguir 404).

## Prueba de conexión

Tras configurar las Script Properties y desplegar, agrega temporalmente en el editor de GAS:

```js
function probarFirestore() {
  const db = new Firestore();

  const nuevo = db.createDocument("users", { name: "Ana", edad: 30, activo: true });
  Logger.log("Creado: " + JSON.stringify(nuevo));

  const doc = db.getDocument("users", nuevo.id);
  Logger.log("Obtenido: " + JSON.stringify(doc));

  db.updateDocument("users", nuevo.id, { name: "Ana María" });
  Logger.log("Actualizado: " + JSON.stringify(db.getDocument("users", nuevo.id)));

  Logger.log("Colección: " + JSON.stringify(db.getCollection("users")));

  db.deleteDocument("users", nuevo.id);
  Logger.log("Eliminado; ahora devuelve: " + db.getDocument("users", nuevo.id));
}
```

Ejecuta `probarFirestore` y revisa las ejecuciones. Debe completar el ciclo CRUD sin errores; si algo falla, el mensaje de error indica HTTP status y detalle.