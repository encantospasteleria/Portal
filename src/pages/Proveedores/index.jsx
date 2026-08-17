import { useEffect, useState, useMemo } from 'react'
import { useToggle } from '@uidotdev/usehooks'
import { useDebounce } from '@uidotdev/usehooks'
import { useSuppliersStore } from '../../hooks/useSuppliers.js'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { createSupplier, updateSupplier, updateSupplierActive } from '../../services/suppliers.js'
import SuppliersToolbar from './components/SuppliersToolbar/index.jsx'
import SuppliersCards from './components/SuppliersCards/index.jsx'
import SuppliersList from './components/SuppliersList/index.jsx'
import ViewToggle from '../../components/ViewToggle/index.jsx'
import SupplierForm from './components/SupplierForm/index.jsx'
import Modal from '../../components/Modal/index.jsx'
import Pagination from '../../components/Pagination/index.jsx'
import {
  Page,
  Title,
  Count,
  ContentHeader,
  StateWrap,
  Spinner,
  RetryButton,
  Toast,
} from './styles.js'

/**
 * Página de administración de proveedores.
 *
 * @returns {JSX.Element} Vista de la página de proveedores.
 */
function Proveedores() {
  const items = useSuppliersStore((state) => state.items)
  const status = useSuppliersStore((state) => state.status)
  const search = useSuppliersStore((state) => state.search)
  const page = useSuppliersStore((state) => state.page)
  const load = useSuppliersStore((state) => state.load)
  const setSearch = useSuppliersStore((state) => state.setSearch)
  const setPage = useSuppliersStore((state) => state.setPage)
  const removeItem = useSuppliersStore((state) => state.removeItem)
  const active = useSuppliersStore((state) => state.active)
  const setActive = useSuppliersStore((state) => state.setActive)
  const ingredientFilter = useSuppliersStore((state) => state.ingredientFilter)
  const setIngredientFilter = useSuppliersStore((state) => state.setIngredientFilter)
  const ingredients = useIngredientsStore((state) => state.items)
  const loadIngredients = useIngredientsStore((state) => state.load)
  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    load()
  }, [active, load])

  useEffect(() => {
    loadIngredients()
  }, [loadIngredients])

  /**
   * Mapa de id de ingrediente a su nombre para resolver referencias.
   *
   * @type {Map<string|number, string>}
   */
  const ingredientNames = useMemo(() => {
    const map = new Map()
    ingredients.forEach((ingredient) => map.set(ingredient.id, ingredient.name))
    return map
  }, [ingredients])

  /**
   * Normaliza un texto para búsquedas (minúsculas y sin tildes).
   *
   * @param {string} value - Texto a normalizar.
   * @returns {string} Texto normalizado.
   */
  const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const filtered = useMemo(() => {
    const query = normalize(debouncedSearch.trim())
    return items.filter((item) => {
      const matchesQuery = !query || normalize(item.name).includes(query)
      const matchesIngredients =
        ingredientFilter.length === 0 ||
        ingredientFilter.some((id) => item.ingredients?.includes(id))
      return matchesQuery && matchesIngredients
    })
  }, [items, debouncedSearch, ingredientFilter])
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / 10))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  const hasFilters = search.trim() !== '' || ingredientFilter.length > 0
  const reload = load

  const [modalOpen, setModalOpen] = useToggle(false)
  const [editing, setEditing] = useState(null)
  const [view, setView] = useState('cards')
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  useEffect(() => {
    if (!confirmation) return undefined

    const timer = setTimeout(() => setConfirmation(null), 3000)
    return () => clearTimeout(timer)
  }, [confirmation])

  /** Abre el modal para crear un nuevo proveedor. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar un proveedor existente.
   *
   * @param {object} supplier - Proveedor a editar.
   */
  const openEditModal = (supplier) => {
    setEditing(supplier)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar un proveedor.
   *
   * @param {object} payload - Datos del proveedor.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      if (editing) {
        await updateSupplier({ ...payload, id: editing.id })
        setConfirmation('Proveedor actualizado')
      } else {
        await createSupplier(payload)
        setConfirmation('Proveedor agregado')
      }

      setModalOpen(false)
      setEditing(null)
      reload()
    } catch {
      // El error ya se muestra en el modal global.
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * Activa o desactiva un proveedor y sincroniza con la API.
   *
   * @param {object} supplier - Proveedor a modificar.
   * @param {boolean} active - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (supplier, active) => {
    setTogglingId(supplier.id)

    try {
      await updateSupplierActive(supplier.id, active)
      removeItem(supplier.id)
    } catch {
      // El error ya se muestra en el modal global.
    } finally {
      setTogglingId(null)
    }
  }

  let content

  if (status === 'loading') {
    content = (
      <StateWrap>
        <Spinner role="status" aria-label="Cargando" />
        <span>Cargando proveedores…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar los proveedores.</span>
        <RetryButton type="button" onClick={reload}>
          Reintentar
        </RetryButton>
      </StateWrap>
    )
  } else if (totalItems === 0) {
    content = (
      <StateWrap>
        <span>
          {hasFilters
            ? 'No se encontraron proveedores con los criterios indicados.'
            : 'No hay proveedores registrados.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'proveedor' : 'proveedores'}
          </Count>
          <ViewToggle view={view} onChange={setView} />
        </ContentHeader>
        {view === 'cards' ? (
          <SuppliersCards
            items={pageItems}
            ingredientNames={ingredientNames}
            onEdit={openEditModal}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
          />
        ) : (
          <SuppliersList
            items={pageItems}
            ingredientNames={ingredientNames}
            onEdit={openEditModal}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
          />
        )}
        <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
      </>
    )
  }

  return (
    <>
      <Page>
        <Title>Proveedores</Title>
        {status === 'success' && (
          <SuppliersToolbar
            search={search}
            onSearchChange={setSearch}
            active={active}
            onActiveChange={setActive}
            ingredients={ingredients}
            ingredientFilter={ingredientFilter}
            onIngredientFilterChange={setIngredientFilter}
            onAdd={openCreateModal}
          />
        )}
        {content}
      </Page>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar proveedor' : 'Agregar proveedor'}
        onClose={closeModal}
      >
        <SupplierForm
          initialValues={editing}
          ingredients={ingredients}
          submitting={submitting}
          submitLabel={editing ? 'Guardar cambios' : 'Guardar proveedor'}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>

      {confirmation && (
        <Toast role="status">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {confirmation}
        </Toast>
      )}
    </>
  )
}

export default Proveedores
