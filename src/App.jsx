import { Routes, Route } from 'react-router'
import AppLayout from './components/AppLayout/index.jsx'
import ErrorModal from './components/ErrorModal/index.jsx'
import Settings from './components/Settings/index.jsx'
import Inicio from './pages/Inicio/index.jsx'
import Ingredientes from './pages/Ingredientes/index.jsx'
import Proveedores from './pages/Proveedores/index.jsx'

/**
 * Componente raíz de la aplicación.
 *
 * @returns {JSX.Element} Las rutas principales del portal.
 */
function App() {
  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Inicio />} />
          <Route path="ingredientes" element={<Ingredientes />} />
          <Route path="proveedores" element={<Proveedores />} />
        </Route>
      </Routes>
      <ErrorModal />
      <Settings />
    </>
  )
}

export default App
