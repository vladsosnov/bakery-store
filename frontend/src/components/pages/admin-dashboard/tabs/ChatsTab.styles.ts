import styled from 'styled-components';

import { colors } from '@src/styles/colors';

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(220px, 290px) 1fr;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ThreadList = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  overflow: hidden;
`;

export const ThreadItem = styled.button<{ $active: boolean }>`
  width: 100%;
  text-align: left;
  border: none;
  border-bottom: 1px solid ${colors.border};
  background: ${(props) => (props.$active ? colors.surface : colors.white)};
  padding: 10px;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

export const ThreadName = styled.strong`
  display: block;
  color: ${colors.brown};
`;

export const ThreadHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const UnreadDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: ${colors.errorRed};
  flex-shrink: 0;
`;

export const ThreadMeta = styled.p`
  margin: 3px 0 0;
  color: ${colors.brownLight};
  font-size: 0.82rem;
`;

export const Conversation = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 600px;
  overflow: hidden;
`;

export const ConversationHeader = styled.header`
  padding: 10px;
  border-bottom: 1px solid ${colors.border};
`;

export const Messages = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  background: linear-gradient(180deg, ${colors.white} 0%, ${colors.surface} 100%);
`;

export const MessageBubble = styled.div<{ $fromCustomer: boolean }>`
  max-width: 80%;
  padding: 8px 10px;
  border-radius: 12px;
  align-self: ${(props) => (props.$fromCustomer ? 'flex-start' : 'flex-end')};
  background: ${(props) => (props.$fromCustomer ? colors.white : colors.accentGreen)};
  color: ${(props) => (props.$fromCustomer ? colors.brown : colors.white)};
  border: ${(props) => (props.$fromCustomer ? `1px solid ${colors.border}` : 'none')};
`;

export const Composer = styled.form`
  border-top: 1px solid ${colors.border};
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
`;

export const Input = styled.input`
  border-radius: 10px;
  border: 1px solid ${colors.border};
  padding: 9px 10px;
`;

export const SendButton = styled.button`
  border-radius: 10px;
  border: none;
  padding: 0 12px;
  font-weight: 700;
  background: ${colors.accentGreen};
  color: ${colors.white};
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
