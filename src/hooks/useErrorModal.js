import { create } from 'zustand'

export const useErrorModalStore = create((set) => ({
  open: false,
  title: 'Error',
  message: '',
  stack: '',

  /**
   * Muestra el modal de error con los detalles recibidos.
   *
   * @param {object} error - Detalles del error.
   * @param {string} [error.title='Error'] - Título del modal.
   * @param {string} error.message - Mensaje del error.
   * @param {string} [error.stack] - Traza del error.
   */
  show: ({ title = 'Error', message, stack = '' }) =>
    set({ open: true, title, message, stack }),

  /** Cierra el modal de error. */
  close: () => set({ open: false, title: 'Error', message: '', stack: '' }),
}))
