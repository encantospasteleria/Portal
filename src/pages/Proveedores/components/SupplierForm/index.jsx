import { useState } from 'react'
import Button from '../../../../components/Button/index.jsx'
import {
  Form,
  Fields,
  Row,
  Field,
  Label,
  Input,
  Textarea,
  ErrorText,
  Actions,
  CheckboxList,
  CheckboxItem,
  Checkbox,
  EmptyText,
} from './styles.js'

/**
 * Valida todos los campos del formulario.
 *
 * @param {object} values - Valores del formulario.
 * @returns {object} Errores por campo (vacío si es válido).
 */
function validate(values) {
  const errors = {}

  if (!values.name.trim()) errors.name = 'El nombre es obligatorio.'
  if (values.email.trim() && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Ingresa un correo válido.'
  }

  return errors
}

/**
 * Formulario para crear o editar un proveedor.
 *
 * @param {object} props - Propiedades del formulario.
 * @param {object|null} [props.initialValues] - Valores iniciales (edición).
 * @param {Array} [props.ingredients=[]] - Ingredientes disponibles para seleccionar.
 * @param {boolean} [props.submitting=false] - Indica si hay un envío en curso.
 * @param {string} [props.submitLabel='Guardar proveedor'] - Texto del botón de envío.
 * @param {Function} props.onSubmit - Callback al enviar el formulario.
 * @param {Function} props.onCancel - Callback al cancelar.
 * @returns {JSX.Element} Formulario del proveedor.
 */
function SupplierForm({
  initialValues,
  ingredients = [],
  submitting = false,
  submitLabel = 'Guardar proveedor',
  onSubmit,
  onCancel,
}) {
  const [values, setValues] = useState(() => ({
    name: initialValues?.name ?? '',
    contactName: initialValues?.contactName ?? '',
    phone: initialValues?.phone ?? '',
    email: initialValues?.email ?? '',
    address: initialValues?.address ?? '',
    notes: initialValues?.notes ?? '',
    ingredients: initialValues?.ingredients ?? [],
  }))
  const [errors, setErrors] = useState({})

  /**
   * Actualiza un campo del formulario y limpia su error.
   *
   * @param {string} field - Nombre del campo.
   * @param {string} value - Nuevo valor.
   */
  const setValue = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  /**
   * Alterna la selección de un ingrediente en el proveedor.
   *
   * @param {string|number} id - Identificador del ingrediente.
   */
  const toggleIngredient = (id) => {
    setValues((prev) => ({
      ...prev,
      ingredients: prev.ingredients.includes(id)
        ? prev.ingredients.filter((ingredientId) => ingredientId !== id)
        : [...prev.ingredients, id],
    }))
  }

  /**
   * Valida y envía el formulario.
   *
   * @param {React.FormEvent} event - Evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    onSubmit({
      name: values.name.trim(),
      contactName: values.contactName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim(),
      notes: values.notes.trim(),
      ingredients: values.ingredients,
    })
  }

  return (
    <Form onSubmit={handleSubmit} noValidate autoComplete="off">
      <Fields>
        <Field>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            type="text"
            autoComplete="off"
            placeholder="Ej. Distribuidora La Plaza"
            value={values.name}
            onChange={(event) => setValue('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </Field>

        <Row>
          <Field>
            <Label htmlFor="contactName">Contacto</Label>
            <Input
              id="contactName"
              type="text"
              autoComplete="off"
              placeholder="Ej. María Pérez"
              value={values.contactName}
              onChange={(event) => setValue('contactName', event.target.value)}
              aria-invalid={Boolean(errors.contactName)}
            />
            {errors.contactName && <ErrorText>{errors.contactName}</ErrorText>}
          </Field>

          <Field>
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="off"
              placeholder="Ej. 300 123 4567"
              value={values.phone}
              onChange={(event) => setValue('phone', event.target.value)}
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </Field>
        </Row>

        <Field>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="Ej. ventas@proveedor.com"
            value={values.email}
            onChange={(event) => setValue('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            type="text"
            autoComplete="off"
            placeholder="Ej. Cra 10 # 20-30"
            value={values.address}
            onChange={(event) => setValue('address', event.target.value)}
            aria-invalid={Boolean(errors.address)}
          />
          {errors.address && <ErrorText>{errors.address}</ErrorText>}
        </Field>

        <Field>
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            autoComplete="off"
            placeholder="Observaciones del proveedor"
            value={values.notes}
            onChange={(event) => setValue('notes', event.target.value)}
            aria-invalid={Boolean(errors.notes)}
          />
          {errors.notes && <ErrorText>{errors.notes}</ErrorText>}
        </Field>

        <Field>
          <Label as="span">Ingredientes</Label>
          {ingredients.length === 0 ? (
            <EmptyText>No hay ingredientes registrados.</EmptyText>
          ) : (
            <CheckboxList>
              {ingredients.map((ingredient) => (
                <CheckboxItem key={ingredient.id}>
                  <Checkbox
                    type="checkbox"
                    checked={values.ingredients.includes(ingredient.id)}
                    onChange={() => toggleIngredient(ingredient.id)}
                  />
                  {ingredient.name}
                </CheckboxItem>
              ))}
            </CheckboxList>
          )}
        </Field>
      </Fields>

      <Actions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando…' : submitLabel}
        </Button>
      </Actions>
    </Form>
  )
}

export default SupplierForm
