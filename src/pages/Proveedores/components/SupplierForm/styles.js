import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
`

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 76px;
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font: inherit;
  font-size: 14px;
  color: var(--color-text);
  outline: none;

  &::placeholder {
    color: var(--color-text-muted);
  }

  &:focus {
    border-color: var(--color-accent);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger);
  }
`

export const ErrorText = styled.span`
  font-size: 12px;
  color: var(--color-danger);
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`

export const CheckboxList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
  max-height: 180px;
  overflow-y: auto;
  padding: 2px;
`

export const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    border-color: var(--color-accent);
  }
`

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--color-accent);
  cursor: pointer;
  flex-shrink: 0;
`

export const EmptyText = styled.span`
  font-size: 13px;
  color: var(--color-text-muted);
`

