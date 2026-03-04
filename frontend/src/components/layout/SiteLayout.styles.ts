import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { fadeInLift } from '@src/styles/animations';

type AuthVariant = 'ghost' | 'solid';

export const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #fff7f0 0%, #fff 40%, #fff7f0 100%);
  color: #2d1d1d;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  position: sticky;
  top: 0;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 247, 240, 0.85);
  border-bottom: 1px solid #f1ddd0;
  z-index: 20;
`;

export const Brand = styled.strong`
  font-size: 1rem;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 20px;
  font-weight: 600;
`;

export const NavItem = styled(NavLink)`
  text-decoration: none;

  &.active {
    text-decoration: underline;
  }
`;

export const Auth = styled.div`
  display: flex;
  gap: 10px;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const CartButton = styled.button<{ $open: boolean }>`
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$open ? '#2f6f51' : '#d7b9a6')};
  background: ${(props) => (props.$open ? '#2f6f51' : '#fff7f0')};
  color: ${(props) => (props.$open ? '#fff' : '#513333')};
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 170ms ease, box-shadow 170ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 14px rgba(81, 51, 51, 0.14);
  }
`;

const authLinkVariants = {
  ghost: css`
    border: 1px solid #d7b9a6;
    background: #fff7f0;
    color: #513333;

    &.active {
      background: #f3e4d9;
    }
  `,
  solid: css`
    border: 1px solid #513333;
    background: #513333;
    color: #fff;

    &.active {
      background: #3e2424;
      border-color: #3e2424;
    }
  `
} as const;

export const AuthLink = styled(NavLink)<{ $variant: AuthVariant }>`
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  text-decoration: none;
  ${(props) => authLinkVariants[props.$variant]}
`;

export const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ContentInner = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

export const RouteTransition = styled.div`
  flex: 1;
  animation: ${fadeInLift} 260ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Footer = styled.footer`
  margin-top: 20px;
  padding: 24px 28px;
  border-top: 1px solid #f1ddd0;
  color: #76554a;
`;

export const ChatButton = styled.button<{ $open: boolean }>`
  position: fixed;
  right: 18px;
  bottom: 18px;
  border: none;
  border-radius: 999px;
  background: ${(props) => (props.$open ? '#513333' : '#2f6f51')};
  color: #fff;
  padding: 14px 18px;
  font-weight: 700;
  box-shadow: 0 10px 24px rgba(31, 90, 64, 0.35);
  cursor: pointer;
  z-index: 30;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 26px rgba(31, 90, 64, 0.42);
  }
`;
