import styled from 'styled-components';

import { CardSurface } from '@src/components/common/CardSurface';
import { FormLabel } from '@src/components/common/FormLabel';
import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';

export const Section = styled.section`
  ${pageContainer}
  display: grid;
  gap: 18px;
`;

export const Panel = styled(CardSurface)`
  max-width: 560px;
`;

export const Eyebrow = styled.p`
  color: ${colors.brownLight};
  font-weight: 700;
`;

export const Title = styled.h1`
  margin-top: 8px;
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  margin-top: 0;
  color: ${colors.brownLight};
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 18px;
`;

export const Label = styled(FormLabel)``;

export const Status = styled.p<{ $isError: boolean }>`
  margin-bottom: 0;
  margin-top: 14px;
  color: ${(props) => (props.$isError ? colors.errorRed : colors.brownLight)};
`;

export const TempPassword = styled.code`
  margin-top: 12px;
  display: inline-block;
  border-radius: 10px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  color: ${colors.brown};
  padding: 9px 12px;
  font-weight: 700;
`;

export const FooterText = styled.p`
  margin-bottom: 0;
  margin-top: 14px;
  color: ${colors.brownLight};
`;
