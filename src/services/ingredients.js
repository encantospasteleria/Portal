import apiRequest from './api.js'

/**
 * Obtiene la lista de ingredientes.
 *
 * @param {boolean} active - Filtra por estado (true: activos, false: inactivos).
 * @returns {Promise<unknown>} Lista de ingredientes.
 */
export function listIngredients(active) {
  return apiRequest('ingredient/list', 'GET', { active })
}

/**
 * Crea un nuevo ingrediente.
 *
 * @param {object} data - Datos del ingrediente a crear.
 * @returns {Promise<unknown>} Ingrediente creado.
 */
export function createIngredient(data) {
  return apiRequest('ingredient/create', 'POST', data)
}

/**
 * Actualiza un ingrediente existente.
 *
 * @param {object} data - Datos del ingrediente, incluido su id.
 * @returns {Promise<unknown>} Ingrediente actualizado.
 */
export function updateIngredient(data) {
  return apiRequest('ingredient/update', 'POST', data)
}

/**
 * Activa o desactiva un ingrediente.
 *
 * @param {string|number} id - Identificador del ingrediente.
 * @param {boolean} active - Estado activo deseado.
 * @returns {Promise<unknown>} Resultado de la operación.
 */
export function updateIngredientActive(id, active) {
  return apiRequest('ingredient/updateActive', 'POST', { id, active })
}

/**
 * Elimina un ingrediente.
 *
 * @param {string|number} id - Identificador del ingrediente.
 * @returns {Promise<unknown>} Resultado de la operación.
 */
export function removeIngredient(id) {
  return apiRequest('ingredient/delete', 'POST', { id })
}
