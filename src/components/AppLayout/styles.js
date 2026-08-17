import styled from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const Layout = styled.div`
  display: flex;
  min-height: 100%;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 100vh;
`

export const Header = styled.header`
  display: none;

  @media (max-width: ${breakpoints.mobileMax}) {
    display: flex;
    align-items: center;
    gap: 10px;
    height: var(--header-height);
    flex-shrink: 0;
    padding: 0 16px;
    background: var(--color-sidebar);
    border-bottom: 1px solid var(--color-border);
  }
`

export const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;

  &:hover {
    background: var(--color-accent-hover);
  }
`

export const HeaderBrand = styled.span`
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
`

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: var(--z-overlay);
  background: rgba(0, 0, 0, 0.32);

  @media (min-width: ${breakpoints.tabletMin}) {
    display: none;
  }
`

export const Main = styled.main`
  flex: 1;
  min-width: 0;
  min-height: 0;
  padding: 40px 48px;
  overflow-y: auto;

  @media (max-width: ${breakpoints.mobileMax}) {
    padding: 24px 20px;
  }

  @media (min-width: ${breakpoints.tabletMin}) and (max-width: ${breakpoints.tabletMax}) {
    padding: 32px 32px;
  }
`
