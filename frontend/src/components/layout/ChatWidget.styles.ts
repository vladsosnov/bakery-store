import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Panel = styled.section`
  position: fixed;
  right: 18px;
  bottom: 82px;
  width: min(360px, calc(100vw - 20px));
  height: min(520px, calc(100vh - 130px));
  display: grid;
  grid-template-rows: auto 1fr auto;
  background: #fff;
  border: 1px solid #e9d3c5;
  border-radius: 18px;
  box-shadow: 0 20px 48px rgba(65, 43, 33, 0.28);
  overflow: hidden;
  z-index: 45;
  animation: ${slideIn} 240ms ease;
`;

export const Header = styled.header`
  padding: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  border-bottom: 1px solid #f2dfd3;
  background: linear-gradient(135deg, #2f6f51, #22513c);
  color: #fff;
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
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 10px;
  padding: 7px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const Messages = styled.div`
  padding: 12px;
  overflow-y: auto;
  background: linear-gradient(180deg, #fff 0%, #fff8f2 100%);
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
  background: ${(props) => (props.$role === 'user' ? '#2f6f51' : '#fff')};
  color: ${(props) => (props.$role === 'user' ? '#fff' : '#3a2721')};
  border: ${(props) => (props.$role === 'user' ? 'none' : '1px solid #ead6c7')};
`;

export const Footer = styled.footer`
  border-top: 1px solid #f2dfd3;
  background: #fff;
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
  border: 1px solid #d9bca9;
  background: #fff7f0;
  color: #5c3f34;
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
  border: 1px solid #e3cbbb;
  padding: 10px 11px;
  font-size: 0.92rem;

  &:focus {
    outline: none;
    border-color: #2f6f51;
    box-shadow: 0 0 0 3px rgba(47, 111, 81, 0.14);
  }
`;

export const SendButton = styled.button`
  border: none;
  border-radius: 10px;
  background: #2f6f51;
  color: #fff;
  padding: 0 13px;
  font-weight: 700;
  cursor: pointer;
`;
