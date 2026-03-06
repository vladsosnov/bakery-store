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
  padding: 24px;
`;

export const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: ${colors.romanCoffee};
`;

export const OrderList = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
`;

export const OrderItem = styled.li`
  border: 1px solid ${colors.softBorder};
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 8px;
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
  border: 1px solid ${colors.inputBorder};
  background: #e7f4ed;
  color: ${colors.accentGreen};
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: lowercase;
`;

export const Total = styled.span`
  font-weight: 700;
  color: ${colors.brandBrown};
`;

export const ItemList = styled.ul`
  margin: 0;
  padding-left: 18px;
  color: ${colors.vintageBrown};
`;

export const Item = styled.li`
  margin-top: 4px;
`;
