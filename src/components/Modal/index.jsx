import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Overlay, Panel, Header, Title, CloseButton, Body } from './styles.js'

/**
 * Modal accesible renderizado mediante un portal.
 *
 * @param {object} props - Propiedades del modal.
 * @param {boolean} props.open - Indica si el modal está visible.
 * @param {string} props.title - Título del modal.
 * @param {Function} props.onClose - Callback al cerrar el modal.
 * @param {React.ReactNode} props.children - Contenido del modal.
 * @returns {JSX.Element|null} Modal o null si está cerrado.
 */
function Modal({ open, title, onClose, children }) {
  useEffect(() => {
    if (!open) return undefined

    /**
     * Cierra el modal al pulsar la tecla Escape.
     *
     * @param {KeyboardEvent} event - Evento de teclado.
     */
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <Overlay onClick={onClose}>
      <Panel
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <Header>
          <Title>{title}</Title>
          <CloseButton type="button" onClick={onClose} aria-label="Cerrar">
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
        </Header>
        <Body>{children}</Body>
      </Panel>
    </Overlay>,
    document.body,
  )
}

export default Modal
