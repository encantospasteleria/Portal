import { create } from 'zustand'
import { listIngredients } from '../services/ingredients.js'

export const useIngredientsStore = create((set, get) => ({
  items: [],
  status: 'loading',
  search: '',
  active: true,
  page: 1,

  /**
   * Carga los ingredientes desde la API y actualiza el estado de la solicitud.
   *
   * @returns {Promise<void>}
   */
  load: async () => {
    set({ status: 'loading' })
    try {
      const items = await listIngredients(get().active)
      set({ items, status: 'success' })
    } catch {
      set({ status: 'error' })
    }
  },

  /**
   * Actualiza el texto de búsqueda y vuelve a la primera página.
   *
   * @param {string} search - Texto de búsqueda.
   */
  setSearch: (search) => set({ search, page: 1 }),

  /**
   * Actualiza el filtro por estado y vuelve a la primera página.
   *
   * @param {boolean} active - true para activos, false para inactivos.
   */
  setActive: (active) => set({ active, page: 1 }),

  /**
   * Cambia la página actual de la lista.
   *
   * @param {number} page - Número de página.
   */
  setPage: (page) => set({ page }),

  /**
   * Elimina localmente un ingrediente de la lista (al cambiar su estado activo).
   *
   * @param {string|number} id - Identificador del ingrediente.
   */
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
}))
