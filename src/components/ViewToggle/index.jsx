import { Group, Button } from './styles.js'

const iconProps = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
}

/**
 * Selector para alternar entre la vista de tarjetas y la de lista.
 *
 * @param {object} props - Propiedades del selector.
 * @param {'cards'|'list'} props.view - Vista activa.
 * @param {Function} props.onChange - Callback al cambiar la vista.
 * @returns {JSX.Element} Selector de vista.
 */
function ViewToggle({ view, onChange }) {
  return (
    <Group role="group" aria-label="Cambiar vista">
      <Button
        type="button"
        $active={view === 'cards'}
        aria-pressed={view === 'cards'}
        onClick={() => onChange('cards')}
      >
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
        Tarjetas
      </Button>
      <Button
        type="button"
        $active={view === 'list'}
        aria-pressed={view === 'list'}
        onClick={() => onChange('list')}
      >
        <svg {...iconProps}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Lista
      </Button>
    </Group>
  )
}

export default ViewToggle
