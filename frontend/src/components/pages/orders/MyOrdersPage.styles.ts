import styled from 'styled-components';

import { CardSurface } from '@src/components/common/CardSurface';
import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';

export const Section = styled.section`
  ${pageContainer}
`;

export const Card = styled(CardSurface)``;

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${colors.brownLight};
`;

export const HeaderRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: end;
`;

export const HeaderText = styled.div`
  display: grid;
  gap: 8px;
`;

export const FilterRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const FilterLabel = styled.label`
  display: grid;
  gap: 6px;
  font-weight: 600;
  color: ${colors.brown};
`;

export const StatusSelect = styled.select`
  min-width: 180px;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 10px 12px;
  font-size: 0.95rem;
`;

export const OrderList = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

export const OrderItem = styled.li`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 12px;
`;

export const OrderHeader = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

export const Status = styled.span`
  border-radius: 999px;
  padding: 4px 9px;
  border: 1px solid ${colors.border};
  background: ${colors.bgStatusSuccess};
  color: ${colors.accentGreen};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: lowercase;
`;

export const Total = styled.span`
  font-weight: 700;
  color: ${colors.brown};
`;

export const ItemList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
`;

export const Item = styled.li`
  margin: 0;
`;

export const ItemCard = styled.div`
  border-radius: 12px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  padding: 12px;
  display: grid;
  gap: 10px;
`;

export const ItemRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
`;

export const ItemSummary = styled.span`
  color: ${colors.brownLight};
`;

export const SecondaryButton = styled.button`
  border-radius: 10px;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.brown};
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const HelperText = styled.span`
  color: ${colors.brownLight};
  font-size: 0.88rem;
`;

export const ReviewCard = styled.div`
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  padding: 10px;
  display: grid;
  gap: 4px;
`;

export const ReviewText = styled.p`
  margin: 0;
  color: ${colors.brownLight};
`;

export const ReviewForm = styled.form`
  display: grid;
  gap: 10px;
`;

export const FieldGroup = styled.div`
  display: grid;
  gap: 6px;
`;

export const Select = styled.select`
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 12px 13px;
  font-size: 0.98rem;
`;

export const Textarea = styled.textarea`
  min-height: 110px;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 12px 13px;
  font-size: 0.98rem;
  font-family: inherit;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(27, 18, 10, 0.55);
  display: grid;
  place-items: center;
  padding: 20px;
  z-index: 50;
`;

export const ModalCard = styled.div`
  width: min(680px, 100%);
  max-height: min(80vh, 720px);
  overflow: auto;
  border-radius: 18px;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  padding: 18px;
  display: grid;
  gap: 14px;
`;

export const ModalHeader = styled.div`
  display: flex;
  gap: 12px;
  justify-content: space-between;
  align-items: center;
`;

export const ModalList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

export const ModalListItem = styled.li`
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 12px;
  display: grid;
  gap: 6px;
`;

export const ModalEmpty = styled.p`
  margin: 0;
  color: ${colors.brownLight};
`;
