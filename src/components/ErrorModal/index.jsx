import { useErrorModalStore } from '../../hooks/useErrorModal.js'
import Modal from '../Modal/index.jsx'
import { Message, Stack } from './styles.js'

/**
 * Modal global que muestra los errores de la aplicación.
 *
 * @returns {JSX.Element} Modal de error.
 */
function ErrorModal() {
  const open = useErrorModalStore((state) => state.open)
  const title = useErrorModalStore((state) => state.title)
  const message = useErrorModalStore((state) => state.message)
  const stack = useErrorModalStore((state) => state.stack)
  const close = useErrorModalStore((state) => state.close)

  return (
    <Modal open={open} title={title} onClose={close}>
      <Message>{message}</Message>
      {stack && <Stack>{stack}</Stack>}
    </Modal>
  )
}

export default ErrorModal
