/**
 * Formatea un número como moneda en pesos colombianos.
 *
 * @param {number|string} value - Valor a formatear.
 * @returns {string} Valor formateado con prefijo $.
 */
export function formatCurrency(value) {
  return `$${Number(value).toLocaleString('es-CO')}`
}
