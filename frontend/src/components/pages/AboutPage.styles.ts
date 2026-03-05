import styled from 'styled-components';

export const Main = styled.main``;

export const Section = styled.section`
  width: min(1120px, 92vw);
  margin: 0 auto;
  padding: 30px 0 12px;
`;

export const Hero = styled.article`
  background: #fff;
  border: 1px solid #f0d8c9;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
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
  background: #fff;
  border: 1px solid #f0d8c9;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
`;

export const CardTitle = styled.h2`
  margin-top: 0;
`;

export const CardText = styled.p`
  margin-bottom: 0;
`;

export const ContactLine = styled.p`
`;

export const ContactLineLast = styled.p`
  margin-bottom: 0;
`;
