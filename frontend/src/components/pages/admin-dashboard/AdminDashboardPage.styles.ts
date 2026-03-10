import styled from 'styled-components';

import { CardSurface } from '@src/components/common/CardSurface';
import { FormLabel } from '@src/components/common/FormLabel';
import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';
import { shadows } from '@src/styles/shadows';

export const Section = styled.section`
  ${pageContainer}
  display: grid;
  gap: 18px;
`;

export const HeaderCard = styled(CardSurface)``;

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: ${colors.brownLight};
  margin-bottom: 8px;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  border-radius: 12px;
  border: 1px solid ${(props) => (props.$active ? colors.accentGreen : colors.border)};
  background: ${(props) => (props.$active ? colors.accentGreen : colors.white)};
  color: ${(props) => (props.$active ? colors.white : colors.brown)};
  padding: 9px 12px;
  font-weight: 700;
  cursor: pointer;
`;

export const Panel = styled(CardSurface)``;

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

export const FormRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

export const Label = styled(FormLabel)``;

export const TextArea = styled.textarea`
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.brown};
  padding: 10px 12px;
  resize: vertical;
  min-height: 88px;
`;

export const InlineCheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export const CreateButton = styled.button`
  border-radius: 12px;
  border: none;
  background: ${colors.brown};
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
  border: 1px solid ${colors.border};
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
  color: ${colors.brown};
`;

export const RolePill = styled.span<{ $role: 'customer' | 'moderator' | 'admin' }>`
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: lowercase;
  border: 1px solid ${colors.border};
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
  border: 1px solid ${(props) => (props.$danger ? colors.errorRed : colors.border)};
  background: ${colors.white};
  color: ${(props) => (props.$danger ? colors.errorRed : colors.brown)};
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
  background: ${(props) => (props.$active ? colors.bgStatusSuccess : '#faece8')};
  color: ${(props) => (props.$active ? colors.accentGreen : colors.errorMuted)};
`;

export const EmptyText = styled.p`
  color: ${colors.brownLight};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${colors.overlayModal};
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 40;
`;

export const ModalCard = styled.div`
  width: min(560px, 100%);
  border-radius: 20px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: ${shadows.overlayModal};
  padding: 24px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const CloseButton = styled.button`
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.brown};
  border-radius: 10px;
  padding: 8px 10px;
  font-weight: 700;
  cursor: pointer;
`;

export const ModalBodyText = styled.p`
  color: ${colors.brownLight};
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
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.brown};
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
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.brown};
  padding: 8px 10px;
`;

export const OrderDetails = styled.div`
  display: grid;
  gap: 6px;
  margin-top: 8px;
`;

export const MutedText = styled.p`
  color: ${colors.brownLight};
  margin: 0;
`;

export const OrderItemList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${colors.brownLight};
`;

export const OrderItem = styled.li`
  margin-top: 4px;
`;

export const SectionList = styled.div`
  display: grid;
  gap: 14px;
`;

export const Subsection = styled.section`
  border: 1px solid ${colors.border};
  border-radius: 14px;
  padding: 12px;
`;

export const ProductList = styled.div`
  display: grid;
  gap: 12px;
`;

export const ProductItem = styled.article`
  border: 1px solid ${colors.border};
  border-radius: 14px;
  padding: 12px;
`;

export const ProductItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

export const ProductTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 4px;
  color: ${colors.brown};
`;

export const ProductMeta = styled.p`
  margin: 0;
  color: ${colors.brownLight};
`;

export const ProductActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
