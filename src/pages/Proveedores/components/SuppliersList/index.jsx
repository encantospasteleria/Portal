import Button from '../../../../components/Button/index.jsx'
import Switch from '../../../../components/Switch/index.jsx'
import { List, Row, Main, Name, Meta, Info, InfoText, Actions } from './styles.js'

/**
 * Vista en lista de los proveedores.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Proveedores a mostrar.
 * @param {Map} props.ingredientNames - Mapa de id de ingrediente a nombre.
 * @param {Function} props.onEdit - Callback al editar un proveedor.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del proveedor en proceso de cambio.
 * @returns {JSX.Element} Lista de proveedores.
 */
function SuppliersList({ items, ingredientNames, onEdit, onToggleActive, togglingId }) {
  return (
    <List>
      {items.map((item) => (
        <Row key={item.id ?? item.name}>
          <Main>
            <Name>{item.name}</Name>
            {item.contactName && <Meta>{item.contactName}</Meta>}
            {item.ingredients?.length > 0 && (
              <Meta>
                Vende: {item.ingredients.map((id) => ingredientNames.get(id) ?? id).join(', ')}
              </Meta>
            )}
          </Main>
          <Info>
            {item.phone && <InfoText>{item.phone}</InfoText>}
            {item.email && <InfoText>{item.email}</InfoText>}
          </Info>
          <Actions>
            <Button variant="ghost" onClick={() => onEdit(item)}>
              Editar
            </Button>
            <Switch
              checked={item.active}
              disabled={togglingId === item.id}
              onChange={(active) => onToggleActive(item, active)}
            />
          </Actions>
        </Row>
      ))}
    </List>
  )
}

export default SuppliersList
