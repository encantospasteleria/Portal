import styled from 'styled-components'

export const Message = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-danger);
`

export const Stack = styled.pre`
  margin: 12px 0 0;
  padding: 12px;
  max-height: 240px;
  overflow: auto;
  background: var(--color-neutral-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-text-muted);
  white-space: pre-wrap;
  word-break: break-word;
`
