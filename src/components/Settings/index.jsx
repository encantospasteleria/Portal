import { useState } from 'react'
import { useSettingsStore } from '../../hooks/useSettings.js'
import Button from '../Button/index.jsx'
import Switch from '../Switch/index.jsx'
import Modal from '../Modal/index.jsx'
import {
  FloatingButton,
  Fields,
  Field,
  Label,
  Input,
  Hint,
  SwitchRow,
  SwitchLabel,
  Actions,
} from './styles.js'

/**
 * Botón flotante de configuración (id de API y visualización de errores).
 *
 * @returns {JSX.Element} Botón flotante con su modal de configuración.
 */
function Settings() {
  const scriptId = useSettingsStore((state) => state.scriptId)
  const showErrors = useSettingsStore((state) => state.showErrors)
  const saveSettings = useSettingsStore((state) => state.saveSettings)

  const [open, setOpen] = useState(false)
  const [draftScriptId, setDraftScriptId] = useState(scriptId)
  const [draftShowErrors, setDraftShowErrors] = useState(showErrors)

  /** Abre el modal y restaura los valores actuales. */
  const openModal = () => {
    setDraftScriptId(scriptId)
    setDraftShowErrors(showErrors)
    setOpen(true)
  }

  /** Guarda la configuración y cierra el modal. */
  const handleSave = () => {
    saveSettings({ scriptId: draftScriptId.trim(), showErrors: draftShowErrors })
    setOpen(false)
  }

  return (
    <>
      <FloatingButton type="button" onClick={openModal} aria-label="Configuración">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </FloatingButton>

      <Modal open={open} title="Configuración" onClose={() => setOpen(false)}>
        <Fields>
          <Field>
            <Label htmlFor="scriptId">ID de la API</Label>
            <Input
              id="scriptId"
              type="text"
              autoComplete="off"
              placeholder="ID del script de Google Apps"
              value={draftScriptId}
              onChange={(event) => setDraftScriptId(event.target.value)}
            />
            <Hint>Se usa para conectarse al backend de Google Apps Script.</Hint>
          </Field>

          <SwitchRow>
            <SwitchLabel>Mostrar errores</SwitchLabel>
            <Switch
              checked={draftShowErrors}
              onChange={setDraftShowErrors}
              label="Mostrar errores"
            />
          </SwitchRow>

          <Actions>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave}>
              Guardar
            </Button>
          </Actions>
        </Fields>
      </Modal>
    </>
  )
}

export default Settings
