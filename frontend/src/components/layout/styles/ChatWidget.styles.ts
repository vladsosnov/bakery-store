import styled from 'styled-components';
import { fadeInLift } from '@src/styles/animations';
import { colors } from '@src/styles/colors';
import { shadows } from '@src/styles/shadows';

export const Panel = styled.section`
  position: fixed;
  right: 18px;
  bottom: 82px;
  width: min(360px, calc(100vw - 20px));
  height: min(520px, calc(100vh - 130px));
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 18px;
  box-shadow: ${shadows.overlayStrong};
  overflow: hidden;
  z-index: 45;
  animation: ${fadeInLift} 240ms ease;
`;

export const Header = styled.header`
  padding: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  border-bottom: 1px solid ${colors.border};
  background: linear-gradient(135deg, ${colors.accentGreen}, ${colors.brownLight});
  color: ${colors.white};
`;

export const HeaderText = styled.div``;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

export const HeaderMeta = styled.p`
  margin: 4px 0 0;
  opacity: 0.92;
  font-size: 0.86rem;
`;

export const CloseButton = styled.button`
  border: none;
  background: ${colors.overlayWhite20};
  color: ${colors.white};
  border-radius: 10px;
  padding: 7px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const Messages = styled.div`
  padding: 12px;
  overflow-y: auto;
  background: linear-gradient(180deg, ${colors.white} 0%, ${colors.surface} 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Bubble = styled.div<{ $role: 'user' | 'assistant' }>`
  max-width: 85%;
  border-radius: 14px;
  padding: 9px 11px;
  line-height: 1.35;
  font-size: 0.92rem;
  align-self: ${(props) => (props.$role === 'user' ? 'flex-end' : 'flex-start')};
  background: ${(props) => (props.$role === 'user' ? colors.accentGreen : colors.white)};
  color: ${(props) => (props.$role === 'user' ? colors.white : '#3a2721')};
  border: ${(props) => (props.$role === 'user' ? 'none' : '1px solid #ead6c7')};
`;

export const Footer = styled.footer`
  border-top: 1px solid ${colors.border};
  background: ${colors.white};
  padding: 10px;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: 9px;
`;

export const QuickButton = styled.button`
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.brownLight};
  padding: 6px 10px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
`;

export const Composer = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

export const Input = styled.input`
  border-radius: 10px;
  border: 1px solid ${colors.border};
  padding: 10px 11px;
  font-size: 0.92rem;

  &:focus {
    outline: none;
    border-color: ${colors.accentGreen};
    box-shadow: ${shadows.focusRing};
  }
`;

export const SendButton = styled.button`
  border: none;
  border-radius: 10px;
  background: ${colors.accentGreen};
  color: ${colors.white};
  padding: 0 13px;
  font-weight: 700;
  cursor: pointer;
`;
