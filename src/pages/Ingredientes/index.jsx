import { useEffect, useState } from 'react'
import { useToggle } from '@uidotdev/usehooks'
import { useDebounce } from '@uidotdev/usehooks'
import { useIngredientsStore } from '../../hooks/useIngredients.js'
import { useMemo } from 'react'
import { getStockStatus } from '../../utils/stock.js'
import { createIngredient, updateIngredient, updateIngredientActive } from '../../services/ingredients.js'
import IngredientsToolbar from './components/IngredientsToolbar/index.jsx'
import IngredientsCards from './components/IngredientsCards/index.jsx'
import IngredientsList from './components/IngredientsList/index.jsx'
import InventorySummary from './components/InventorySummary/index.jsx'
import ViewToggle from '../../components/ViewToggle/index.jsx'
import IngredientForm from './components/IngredientForm/index.jsx'
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
 * Página de administración de ingredientes.
 *
 * @returns {JSX.Element} Vista de la página de ingredientes.
 */
function Ingredientes() {
  const items = useIngredientsStore((state) => state.items)
  const status = useIngredientsStore((state) => state.status)
  const search = useIngredientsStore((state) => state.search)
  const page = useIngredientsStore((state) => state.page)
  const load = useIngredientsStore((state) => state.load)
  const setSearch = useIngredientsStore((state) => state.setSearch)
  const setPage = useIngredientsStore((state) => state.setPage)
  const active = useIngredientsStore((state) => state.active)
  const setActive = useIngredientsStore((state) => state.setActive)
  const removeItem = useIngredientsStore((state) => state.removeItem)
  const debouncedSearch = useDebounce(search, 250)

  useEffect(() => {
    load()
  }, [active, load])

  /**
   * Normaliza un texto para búsquedas (minúsculas y sin tildes).
   *
   * @param {string} value - Texto a normalizar.
   * @returns {string} Texto normalizado.
   */
  const normalize = (value) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const filtered = useMemo(() => {
    const query = normalize(debouncedSearch.trim())
    return items.filter((item) =>
      !query || normalize(item.name).includes(query),
    )
  }, [items, debouncedSearch])
  const totalItems = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalItems / 10))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * 10, currentPage * 10)
  const summary = useMemo(() => items.reduce((result, item) => {
    const { status: stockStatus } = getStockStatus(item.stock, item.minStock)
    if (stockStatus === 'low') result.lowStock += 1
    if (stockStatus === 'out') result.outOfStock += 1
    return result
  }, { total: items.length, lowStock: 0, outOfStock: 0 }), [items])
  const hasFilters = search.trim() !== ''
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

  /** Abre el modal para crear un nuevo ingrediente. */
  const openCreateModal = () => {
    setEditing(null)
    setModalOpen(true)
  }

  /**
   * Abre el modal para editar un ingrediente existente.
   *
   * @param {object} ingredient - Ingrediente a editar.
   */
  const openEditModal = (ingredient) => {
    setEditing(ingredient)
    setModalOpen(true)
  }

  /** Cierra el modal de creación/edición si no hay un envío en curso. */
  const closeModal = () => {
    if (submitting) return
    setModalOpen(false)
    setEditing(null)
  }

  /**
   * Envía el formulario para crear o actualizar un ingrediente.
   *
   * @param {object} payload - Datos del ingrediente.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (payload) => {
    setSubmitting(true)

    try {
      if (editing) {
        await updateIngredient({ ...payload, id: editing.id })
        setConfirmation('Ingrediente actualizado')
      } else {
        await createIngredient(payload)
        setConfirmation('Ingrediente agregado')
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
   * Activa o desactiva un ingrediente y sincroniza con la API.
   *
   * @param {object} ingredient - Ingrediente a modificar.
   * @param {boolean} active - Nuevo estado activo.
   * @returns {Promise<void>}
   */
  const handleToggleActive = async (ingredient, active) => {
    setTogglingId(ingredient.id)

    try {
      await updateIngredientActive(ingredient.id, active)
      removeItem(ingredient.id)
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
        <span>Cargando ingredientes…</span>
      </StateWrap>
    )
  } else if (status === 'error') {
    content = (
      <StateWrap>
        <span>No se pudieron cargar los ingredientes.</span>
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
            ? 'No se encontraron ingredientes con los criterios indicados.'
            : 'No hay ingredientes registrados.'}
        </span>
      </StateWrap>
    )
  } else {
    content = (
      <>
        <ContentHeader>
          <Count>
            {totalItems} {totalItems === 1 ? 'ingrediente' : 'ingredientes'}
          </Count>
          <ViewToggle view={view} onChange={setView} />
        </ContentHeader>
        {view === 'cards' ? (
          <IngredientsCards
            items={pageItems}
            onEdit={openEditModal}
            onToggleActive={handleToggleActive}
            togglingId={togglingId}
          />
        ) : (
          <IngredientsList
            items={pageItems}
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
        <Title>Ingredientes</Title>
        {status === 'success' && (
          <>
            <IngredientsToolbar
              search={search}
              onSearchChange={setSearch}
              active={active}
              onActiveChange={setActive}
              onAdd={openCreateModal}
            />
            <InventorySummary
              total={summary.total}
              lowStock={summary.lowStock}
              outOfStock={summary.outOfStock}
            />
          </>
        )}
        {content}
      </Page>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar ingrediente' : 'Agregar ingrediente'}
        onClose={closeModal}
      >
        <IngredientForm
          initialValues={editing}
          submitting={submitting}
          submitLabel={editing ? 'Guardar cambios' : 'Guardar ingrediente'}
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

export default Ingredientes
