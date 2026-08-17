import { useToggle } from '@uidotdev/usehooks'
import { Outlet } from 'react-router'
import Sidebar from '../Sidebar/index.jsx'
import { Layout, Column, Header, MenuButton, HeaderBrand, Overlay, Main } from './styles.js'

/**
 * Estructura general de la aplicación (barra lateral, cabecera y contenido).
 *
 * @returns {JSX.Element} Diseño con menú lateral y área de contenido.
 */
function AppLayout() {
  const [menuOpen, setMenuOpen] = useToggle(false)

  /** Cierra el menú lateral. */
  const closeMenu = () => setMenuOpen(false)

  /** Abre el menú lateral. */
  const openMenu = () => setMenuOpen(true)

  return (
    <Layout>
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <Column>
        <Header>
          <MenuButton type="button" onClick={openMenu} aria-label="Abrir menú">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </MenuButton>
          <HeaderBrand>Encantos</HeaderBrand>
        </Header>
        <Main>
          <Outlet />
        </Main>
      </Column>
      {menuOpen && <Overlay onClick={closeMenu} />}
    </Layout>
  )
}

export default AppLayout
