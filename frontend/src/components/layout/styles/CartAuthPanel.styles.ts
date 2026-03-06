import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fadeInLift } from '@src/styles/animations';
import { colors } from '@src/styles/colors';
import { shadows } from '@src/styles/shadows';

export const Panel = styled.section`
  position: fixed;
  right: 18px;
  top: 78px;
  width: min(360px, calc(100vw - 24px));
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  box-shadow: ${shadows.overlay};
  z-index: 42;
  animation: ${fadeInLift} 220ms ease;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 10px;
  border-bottom: 1px solid ${colors.border};
`;

export const Title = styled.h3`
  margin: 0;
`;

export const CloseButton = styled.button`
  border: none;
  background: ${colors.surface};
  color: ${colors.brownLight};
  border-radius: 10px;
  padding: 6px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const Body = styled.div`
  padding: 14px;
`;

export const Message = styled.p`
  color: ${colors.brownLight};
`;

export const SecondaryMessage = styled.p`
  margin-top: 8px;
  color: ${colors.brownLight};
`;

export const Actions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

export const GhostLink = styled(Link)`
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.brown};
  padding: 9px 13px;
  font-weight: 600;
  text-decoration: none;
`;

export const SolidLink = styled(Link)`
  border-radius: 999px;
  border: 1px solid ${colors.brown};
  background: ${colors.brown};
  color: ${colors.white};
  padding: 9px 13px;
  font-weight: 600;
  text-decoration: none;
`;
