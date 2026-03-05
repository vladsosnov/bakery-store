import styled from 'styled-components';

import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';

export const Section = styled.section`
  ${pageContainer}
`;

export const Card = styled.article`
  border-radius: 20px;
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  box-shadow: 0 16px 34px rgba(118, 77, 48, 0.11);
  padding: 28px;
`;

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: ${colors.romanCoffee};
`;

export const ItemList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 8px;
`;

export const Item = styled.li`
  border: 1px solid ${colors.softBorder};
  border-radius: 12px;
  padding: 10px 12px;
  display: grid;
  grid-template-columns: minmax(140px, 1fr) auto auto auto;
  gap: 10px;
  align-items: center;
  color: ${colors.vintageBrown};

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
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  color: ${colors.brandBrown};
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
  color: ${colors.brandBrown};
`;

export const RemoveButton = styled.button`
  border-radius: 10px;
  border: 1px solid #e5beb8;
  background: #fff3f0;
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
  color: ${(props) => (props.$isError ? colors.errorRed : colors.romanCoffee)};
`;

export const Total = styled.p`
  margin-top: 14px;
  margin-bottom: 0;
  font-weight: 700;
  color: ${colors.brandBrown};
`;
