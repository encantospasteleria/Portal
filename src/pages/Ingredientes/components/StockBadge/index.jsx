import { getStockStatus, STOCK_STATUS_LABELS } from '../../../../utils/stock.js'
import { Badge, Dot } from './styles.js'

/**
 * Insignia que indica el estado del stock de un ingrediente.
 *
 * @param {object} props - Propiedades de la insignia.
 * @param {number|string} props.stock - Cantidad disponible.
 * @param {number|string} props.minStock - Stock mínimo requerido.
 * @param {boolean} [props.showLabel=true] - Muestra la etiqueta de estado.
 * @returns {JSX.Element} Insignia de estado.
 */
function StockBadge({ stock, minStock, showLabel = true }) {
  const { status } = getStockStatus(stock, minStock)

  return (
    <Badge $status={status}>
      <Dot aria-hidden="true" />
      {showLabel && STOCK_STATUS_LABELS[status]}
    </Badge>
  )
}

export default StockBadge
