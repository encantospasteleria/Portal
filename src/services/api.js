import { useSettingsStore } from '../hooks/useSettings.js'
import { useErrorModalStore } from '../hooks/useErrorModal.js'

/**
 * Muestra un error técnico (si está habilitado) y devuelve la excepción.
 *
 * @param {string} message - Mensaje del error.
 * @param {string} [stack] - Traza del error.
 * @returns {Error} Error listo para lanzar.
 */
function fail(message, stack = '') {
  if (useSettingsStore.getState().showErrors) {
    useErrorModalStore.getState().show({ title: 'Error', message, stack })
  }
  return new Error(message)
}

/**
 * Realiza una petición a la API de Google Apps Script.
 *
 * @param {string} route - Ruta del endpoint que se va a invocar.
 * @param {string} [method='GET'] - Método HTTP de la petición.
 * @param {unknown} [data] - Cuerpo de la petición (se serializa a JSON).
 * @returns {Promise<unknown>} Los datos devueltos por la API.
 * @throws {Error} Si la API no está configurada, falla la red, la respuesta no es JSON o la API reporta un error.
 */
async function apiRequest(route, method = 'GET', data) {
  const { scriptId } = useSettingsStore.getState()

  if (!scriptId) {
    throw fail('API no configurada: ingresa el ID en Configuración')
  }

  const url = new URL(`https://script.google.com/macros/s/${scriptId}/exec`)
  url.searchParams.set('route', route)

  const options = { method, redirect: 'follow' }

  if (data !== undefined) {
    if (method === 'GET') {
      url.searchParams.set('data', JSON.stringify(data))
    } else {
      options.headers = { 'Content-Type': 'text/plain;charset=utf-8' }
      options.body = JSON.stringify(data)
    }
  }

  let response
  try {
    response = await fetch(url.toString(), options)
  } catch (error) {
    throw fail(`Error de red (${route}): ${error.message}`)
  }

  let payload
  try {
    payload = await response.json()
  } catch (error) {
    throw fail(`Respuesta no-JSON (${route}): ${error.message}`)
  }

  if (payload.ok === false) {
    if (payload.denied) {
      // Negación de regla de negocio: siempre se muestra.
      const message = payload.message || 'Operación no permitida'
      useErrorModalStore.getState().show({ title: 'No permitido', message, stack: '' })
      throw new Error(message)
    }

    throw fail(payload.error || `Error en ${route}`, payload.stack || '')
  }

  return payload.data
}

export default apiRequest
