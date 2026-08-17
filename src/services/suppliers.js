import apiRequest from './api.js'

/**
 * Obtiene la lista de proveedores.
 *
 * @param {boolean} active - Filtra por estado (true: activos, false: inactivos).
 * @returns {Promise<unknown>} Lista de proveedores.
 */
export function listSuppliers(active) {
  return apiRequest('supplier/list', 'GET', { active })
}

/**
 * Crea un nuevo proveedor.
 *
 * @param {object} data - Datos del proveedor a crear.
 * @returns {Promise<unknown>} Proveedor creado.
 */
export function createSupplier(data) {
  return apiRequest('supplier/create', 'POST', data)
}

/**
 * Actualiza un proveedor existente.
 *
 * @param {object} data - Datos del proveedor, incluido su id.
 * @returns {Promise<unknown>} Proveedor actualizado.
 */
export function updateSupplier(data) {
  return apiRequest('supplier/update', 'POST', data)
}

/**
 * Activa o desactiva un proveedor.
 *
 * @param {string|number} id - Identificador del proveedor.
 * @param {boolean} active - Estado activo deseado.
 * @returns {Promise<unknown>} Resultado de la operación.
 */
export function updateSupplierActive(id, active) {
  return apiRequest('supplier/updateActive', 'POST', { id, active })
}

/**
 * Elimina un proveedor.
 *
 * @param {string|number} id - Identificador del proveedor.
 * @returns {Promise<unknown>} Resultado de la operación.
 */
export function removeSupplier(id) {
  return apiRequest('supplier/delete', 'POST', { id })
}
