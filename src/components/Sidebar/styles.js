import { NavLink } from 'react-router'
import styled, { css } from 'styled-components'
import { breakpoints } from '../../styles/breakpoints.js'

export const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: var(--z-sidebar);
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width-mobile);
  max-width: 85vw;
  background: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  transform: translateX(-100%);
  visibility: hidden;
  transition: transform 220ms ease, visibility 0s linear 220ms;

  ${({ $open }) =>
    $open &&
    css`
      transform: translateX(0);
      visibility: visible;
      transition: transform 220ms ease;
    `}

  @media (min-width: ${breakpoints.tabletMin}) {
    position: static;
    transform: none;
    visibility: visible;
    width: var(--sidebar-width-tablet);
    flex-shrink: 0;
  }

  @media (min-width: ${breakpoints.desktopMin}) {
    width: var(--sidebar-width);
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 12px 0 20px;
  height: var(--header-height);
  flex-shrink: 0;
  border-bottom: 1px solid var(--color-border);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
`

export const CloseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;

  &:hover {
    background: var(--color-accent-hover);
    color: var(--color-text);
  }

  @media (min-width: ${breakpoints.tabletMin}) {
    display: none;
  }
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 10px;
`

export const StyledNavLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
  transition: background-color 120ms ease, color 120ms ease;

  &:hover {
    background-color: var(--color-accent-hover);
    color: var(--color-text);
  }

  &.active {
    background-color: var(--color-accent-soft);
    color: var(--color-accent);
  }
`
