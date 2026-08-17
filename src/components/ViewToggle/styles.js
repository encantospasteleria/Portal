import styled from 'styled-components'

export const Group = styled.div`
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--color-neutral-soft);
  border: 1px solid var(--color-border);
  border-radius: 10px;
`

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 7px;
  background: ${({ $active }) => ($active ? 'var(--color-surface)' : 'transparent')};
  color: ${({ $active }) => ($active ? 'var(--color-text)' : 'var(--color-text-muted)')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 3px rgba(0, 0, 0, 0.08)' : 'none')};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    color: var(--color-text);
  }
`
