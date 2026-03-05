import styled from 'styled-components';

import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';

export const Section = styled.section`
  ${pageContainer}
  display: grid;
  gap: 18px;
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

export const InfoGrid = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 8px 12px;
  margin-top: 18px;
`;

export const Label = styled.dt`
  font-weight: 700;
  color: ${colors.brandBrown};
`;

export const Value = styled.dd`
  margin: 0;
  color: ${colors.vintageBrown};
`;

export const BlockTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 14px;
`;

export const FieldLabel = styled.label`
  display: grid;
  gap: 6px;
  font-weight: 600;
`;

export const Input = styled.input`
  border-radius: 12px;
  border: 1px solid ${colors.inputBorder};
  padding: 12px 13px;
  font-size: 0.98rem;
`;

export const SubmitButton = styled.button`
  margin-top: 8px;
  border-radius: 12px;
  border: none;
  background: ${colors.accentGreen};
  color: ${colors.white};
  font-weight: 700;
  padding: 12px 14px;
  cursor: pointer;
`;

export const Status = styled.p<{ $isError: boolean }>`
  margin-bottom: 0;
  margin-top: 14px;
  color: ${(props) => (props.$isError ? colors.errorRed : colors.textMuted)};
`;

export const TempPassword = styled.code`
  margin-top: 10px;
  display: inline-block;
  border-radius: 10px;
  background: #f5ece5;
  border: 1px solid ${colors.softBorder};
  color: ${colors.brandBrown};
  padding: 9px 12px;
  font-weight: 700;
`;
