import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fadeInLift } from '@src/styles/animations';
import { colors } from '@src/styles/colors';

export const Panel = styled.section`
  position: fixed;
  right: 18px;
  top: 78px;
  width: min(360px, calc(100vw - 24px));
  background: ${colors.white};
  border: 1px solid #ead4c6;
  border-radius: 16px;
  box-shadow: 0 20px 42px rgba(69, 44, 34, 0.24);
  z-index: 42;
  animation: ${fadeInLift} 220ms ease;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 14px 10px;
  border-bottom: 1px solid #f2e2d8;
`;

export const Title = styled.h3`
  margin: 0;
`;

export const CloseButton = styled.button`
  border: none;
  background: #f7ece4;
  color: #5c4035;
  border-radius: 10px;
  padding: 6px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const Body = styled.div`
  padding: 14px;
`;

export const Message = styled.p`
  color: ${colors.textMuted};
`;

export const SecondaryMessage = styled.p`
  margin-top: 8px;
  color: ${colors.vintageBrown};
`;

export const Actions = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 8px;
`;

export const GhostLink = styled(Link)`
  border-radius: 999px;
  border: 1px solid ${colors.cinnamonTea};
  background: ${colors.provincialPink};
  color: ${colors.brandBrown};
  padding: 9px 13px;
  font-weight: 600;
  text-decoration: none;
`;

export const SolidLink = styled(Link)`
  border-radius: 999px;
  border: 1px solid ${colors.brandBrown};
  background: ${colors.brandBrown};
  color: ${colors.white};
  padding: 9px 13px;
  font-weight: 600;
  text-decoration: none;
`;
