import styled from 'styled-components';

import { CardSurface } from '@src/components/common/CardSurface';
import { Input } from '@src/components/common/Input';
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
  color: ${colors.brownLight};
`;

export const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 8px;
`;

export const Item = styled.li`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: minmax(140px, 1fr) auto auto auto;
  gap: 10px;
  align-items: center;
  color: ${colors.brownLight};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const ItemName = styled.span`
  font-weight: 600;
`;

export const QuantityControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

export const QuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.brown};
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const QuantityValue = styled.span`
  min-width: 54px;
`;

export const ItemPrice = styled.span`
  font-weight: 700;
  color: ${colors.brown};
`;

export const RemoveButton = styled.button`
  border-radius: 10px;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.errorMuted};
  padding: 8px 10px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const Status = styled.p<{ $isError?: boolean }>`
  margin: 10px 0 0;
  color: ${(props) => (props.$isError ? colors.errorRed : colors.brownLight)};
`;

export const Total = styled.p`
  margin-top: 14px;
  margin-bottom: 0;
  font-weight: 700;
  color: ${colors.brown};
`;

export const DeliveryCard = styled.div`
  margin-top: 14px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 12px;
`;

export const DeliveryTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
`;

export const AddressGrid = styled.div`
  margin-top: 10px;
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
`;

export const AddressInput = styled(Input)``;

export const CheckoutBar = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
`;

export const CheckoutButton = styled.button`
  border-radius: 12px;
  border: none;
  background: ${colors.accentGreen};
  color: ${colors.white};
  font-weight: 700;
  padding: 11px 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
