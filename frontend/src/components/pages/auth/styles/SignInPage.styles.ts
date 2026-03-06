import styled from 'styled-components';
import { CardSurface } from '@src/components/common/CardSurface';
import { FormLabel } from '@src/components/common/FormLabel';
import { colors } from '@src/styles/colors';
import { pageContainer } from '@src/styles/layout';
import { shadows } from '@src/styles/shadows';

export const Section = styled.section`
  ${pageContainer}
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`;

export const Panel = styled(CardSurface)``;

export const AccentPanel = styled.aside`
  border-radius: 20px;
  background: linear-gradient(145deg, ${colors.brown}, ${colors.brownLight});
  color: ${colors.white};
  padding: 24px;
  box-shadow: ${shadows.panelAccent};
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

export const FooterText = styled.p`
  margin-bottom: 0;
  margin-top: 14px;
  color: ${colors.brownLight};
`;

export const AccentTitle = styled.h2`
  margin-top: 0;
`;

export const AccentText = styled.p`
  opacity: 0.95;
`;

export const AccentList = styled.ul`
  margin-top: 14px;
  padding-left: 20px;
`;
