import styled from 'styled-components';

import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';

export const Section = styled.section`
  ${pageContainer}
  display: grid;
  gap: 18px;
`;

export const HeaderCard = styled.article`
  border-radius: 20px;
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  box-shadow: 0 16px 34px rgba(118, 77, 48, 0.11);
  padding: 24px;
`;

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: ${colors.romanCoffee};
  margin-bottom: 8px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$active ? colors.accentGreen : colors.inputBorder)};
  background: ${(props) => (props.$active ? colors.accentGreen : colors.white)};
  color: ${(props) => (props.$active ? colors.white : colors.brandBrown)};
  padding: 9px 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const Panel = styled.article`
  border-radius: 20px;
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  box-shadow: 0 16px 34px rgba(118, 77, 48, 0.11);
  padding: 24px;
`;

export const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const BlockTitle = styled.h2<{ $isTitleWithActions?: boolean }>`
  margin-top: 0;
  margin-bottom: ${(props) => (props.$isTitleWithActions ? '0' : '8px')};
`;

export const Form = styled.form`
  display: grid;
  gap: 10px;
  margin-top: 12px;
  margin-bottom: 18px;
`;

export const Label = styled.label`
  display: grid;
  gap: 6px;
  font-weight: 600;
`;

export const InlineCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export const Input = styled.input`
  border-radius: 12px;
  border: 1px solid ${colors.inputBorder};
  padding: 11px 12px;
  font-size: 0.97rem;
`;

export const SubmitButton = styled.button`
  border-radius: 12px;
  border: none;
  background: ${colors.accentGreen};
  color: ${colors.white};
  font-weight: 700;
  padding: 11px 12px;
  cursor: pointer;
`;

export const CreateButton = styled.button`
  border-radius: 12px;
  border: none;
  background: ${colors.brandBrown};
  color: ${colors.white};
  font-weight: 700;
  padding: 11px 14px;
  cursor: pointer;
`;

export const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
`;

export const UserItem = styled.li`
  border: 1px solid ${colors.softBorder};
  border-radius: 12px;
  padding: 12px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

export const UserRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
  align-items: center;
`;

export const UserName = styled.strong`
  color: ${colors.brandBrown};
`;

export const RolePill = styled.span<{ $role: 'customer' | 'moderator' | 'admin' }>`
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: lowercase;
  border: 1px solid ${colors.inputBorder};
  background: ${(props) => {
    if (props.$role === 'admin') {
      return '#f7e1d5';
    }

    if (props.$role === 'moderator') {
      return '#e7f4ed';
    }

    return '#f8efea';
  }};
`;

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  border-radius: 10px;
  border: 1px solid ${(props) => (props.$danger ? colors.errorRed : colors.inputBorder)};
  background: ${colors.white};
  color: ${(props) => (props.$danger ? colors.errorRed : colors.brandBrown)};
  padding: 7px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const EditGrid = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
`;

export const StatusBadge = styled.span<{ $active: boolean }>`
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 9px;
  background: ${(props) => (props.$active ? '#e7f4ed' : '#faece8')};
  color: ${(props) => (props.$active ? colors.accentGreen : colors.errorMuted)};
`;

export const EmptyText = styled.p`
  color: ${colors.romanCoffee};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(18, 10, 7, 0.45);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 40;
`;

export const ModalCard = styled.div`
  width: min(560px, 100%);
  border-radius: 20px;
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  box-shadow: 0 24px 50px rgba(48, 21, 13, 0.26);
  padding: 24px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const CloseButton = styled.button`
  border: 1px solid ${colors.inputBorder};
  background: ${colors.white};
  color: ${colors.brandBrown};
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const ModalBodyText = styled.p`
  color: ${colors.romanCoffee};
  margin-top: 8px;
  margin-bottom: 0;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

export const StatusSelect = styled.select`
  border-radius: 10px;
  border: 1px solid ${colors.inputBorder};
  background: ${colors.white};
  color: ${colors.brandBrown};
  font-weight: 600;
  padding: 7px 10px;
`;

export const OrdersFilterRow = styled.div`
  margin-top: 10px;
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SearchInput = styled.input`
  min-width: 260px;
  border-radius: 10px;
  border: 1px solid ${colors.inputBorder};
  background: ${colors.white};
  color: ${colors.brandBrown};
  padding: 8px 10px;
`;

export const OrderDetails = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 8px;
`;

export const MutedText = styled.p`
  color: ${colors.romanCoffee};
  margin: 0;
`;

export const OrderItemList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${colors.vintageBrown};
`;

export const OrderItem = styled.li`
  margin-top: 4px;
`;
