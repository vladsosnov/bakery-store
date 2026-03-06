import styled from 'styled-components';
import { colors } from '@src/styles/colors';
import { shadows } from '@src/styles/shadows';

export const Main = styled.main``;

export const Section = styled.section`
  width: min(1200px, 94vw);
  margin: 0 auto;
  padding: 30px 0 12px;
`;

export const Hero = styled.article`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  padding: 24px;
  box-shadow: ${shadows.surface};
`;

export const HeroTitle = styled.h1`
  margin-top: 0;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 18px;
`;

export const Card = styled.article`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  padding: 18px;
  box-shadow: ${shadows.surface};
`;

export const CardTitle = styled.h2`
  margin-top: 0;
`;

export const CardText = styled.p`
  margin-bottom: 0;
`;

export const ContactLine = styled.p``;

export const ContactLineLast = styled.p`
  margin-bottom: 0;
`;
