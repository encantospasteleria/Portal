import Button from '../../../../components/Button/index.jsx'
import Switch from '../../../../components/Switch/index.jsx'
import {
  Grid,
  Card,
  CardTitle,
  CardName,
  CardMeta,
  Details,
  Detail,
  DetailLabel,
  DetailValue,
  IngredientsSection,
  Chips,
  Chip,
  CardFooter,
} from './styles.js'

/**
 * Vista en tarjetas de los proveedores.
 *
 * @param {object} props - Propiedades de la vista.
 * @param {Array} props.items - Proveedores a mostrar.
 * @param {Map} props.ingredientNames - Mapa de id de ingrediente a nombre.
 * @param {Function} props.onEdit - Callback al editar un proveedor.
 * @param {Function} props.onToggleActive - Callback al activar/desactivar.
 * @param {string|number|null} props.togglingId - Id del proveedor en proceso de cambio.
 * @returns {JSX.Element} Rejilla de tarjetas de proveedores.
 */
function SuppliersCards({ items, ingredientNames, onEdit, onToggleActive, togglingId }) {
  return (
    <Grid>
      {items.map((item) => (
        <Card key={item.id ?? item.name}>
          <CardTitle>
            <CardName>{item.name}</CardName>
            {item.contactName && <CardMeta>{item.contactName}</CardMeta>}
          </CardTitle>

          <Details>
            {item.phone && (
              <Detail>
                <DetailLabel>Teléfono</DetailLabel>
                <DetailValue>{item.phone}</DetailValue>
              </Detail>
            )}
            {item.email && (
              <Detail>
                <DetailLabel>Email</DetailLabel>
                <DetailValue>{item.email}</DetailValue>
              </Detail>
            )}
            {item.address && (
              <Detail>
                <DetailLabel>Dirección</DetailLabel>
                <DetailValue>{item.address}</DetailValue>
              </Detail>
            )}
            {item.notes && (
              <Detail>
                <DetailLabel>Notas</DetailLabel>
                <DetailValue>{item.notes}</DetailValue>
              </Detail>
            )}
          </Details>

          {item.ingredients?.length > 0 && (
            <IngredientsSection>
              <DetailLabel>Ingredientes</DetailLabel>
              <Chips>
                {item.ingredients.map((id) => (
                  <Chip key={id}>{ingredientNames.get(id) ?? id}</Chip>
                ))}
              </Chips>
            </IngredientsSection>
          )}

          <CardFooter>
            <Button variant="ghost" onClick={() => onEdit(item)}>
              Editar
            </Button>
            <Switch
              checked={item.active}
              disabled={togglingId === item.id}
              onChange={(active) => onToggleActive(item, active)}
            />
          </CardFooter>
        </Card>
      ))}
    </Grid>
  )
}

export default SuppliersCards
