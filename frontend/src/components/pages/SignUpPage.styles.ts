import styled from 'styled-components';
import { colors } from '@src/styles/colors';

export const Section = styled.section`
  width: min(1120px, 92vw);
  margin: 0 auto;
  padding: 34px 0 14px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`;

export const Panel = styled.article`
  border-radius: 20px;
  border: 1px solid ${colors.softBorder};
  background: ${colors.white};
  box-shadow: 0 16px 34px rgba(118, 77, 48, 0.11);
  padding: 28px;
`;

export const AccentPanel = styled.article`
  border-radius: 20px;
  background: linear-gradient(145deg, #205245, ${colors.accentGreen});
  color: ${colors.white};
  padding: 28px;
  box-shadow: 0 18px 36px rgba(47, 111, 81, 0.3);
`;

export const AccentTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 8px;
`;

export const AccentText = styled.p`
  opacity: 0.95;
`;

export const AccentList = styled.ul`
  margin-top: 14px;
  padding-left: 20px;
`;

export const Eyebrow = styled.p`
  color: #856459;
  font-weight: 700;
`;

export const Title = styled.h2`
  margin-top: 8px;
  margin-bottom: 6px;
`;

export const Subtitle = styled.p`
  margin-top: 0;
  color: #7a5a4f;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 18px;
`;

export const Label = styled.label`
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
  background: ${colors.brandBrown};
  color: ${colors.white};
  font-weight: 700;
  padding: 12px 14px;
  cursor: pointer;
`;

export const FooterText = styled.p`
  margin-bottom: 0;
  margin-top: 14px;
  color: ${colors.textMuted};
`;
