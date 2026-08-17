import { menuItems } from '../../navigation/menuItems.js'
import { SidebarContainer, Brand, CloseButton, Nav, StyledNavLink } from './styles.js'

/**
 * Menú lateral de navegación.
 *
 * @param {object} props - Propiedades de la barra lateral.
 * @param {boolean} props.open - Indica si el menú está abierto.
 * @param {Function} props.onClose - Callback al cerrar el menú.
 * @returns {JSX.Element} Barra lateral con enlaces de navegación.
 */
function Sidebar({ open, onClose }) {
  return (
    <SidebarContainer $open={open}>
      <Brand>
        <span>Encantos</span>
        <CloseButton type="button" onClick={onClose} aria-label="Cerrar menú">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </CloseButton>
      </Brand>
      <Nav>
        {menuItems.map((item) => (
          <StyledNavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={onClose}
          >
            {item.label}
          </StyledNavLink>
        ))}
      </Nav>
    </SidebarContainer>
  )
}

export default Sidebar
