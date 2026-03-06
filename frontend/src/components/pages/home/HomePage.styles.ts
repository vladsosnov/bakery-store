import styled, { keyframes } from 'styled-components';
import { colors } from '@src/styles/colors';

const slideEnter = keyframes`
  from {
    opacity: 0;
    transform: translateX(18px) scale(1.015);
  }

  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

export const Main = styled.main``;

export const Section = styled.section`
  width: min(1200px, 94vw);
  margin: 0 auto;
`;

export const Slider = styled.article`
  margin-top: 24px;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: flex-end;
  box-shadow: 0 16px 30px rgba(117, 79, 52, 0.18);
`;

export const SlideStage = styled.div`
  position: absolute;
  inset: 0;
  animation: ${slideEnter} 520ms ease;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const SlideImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(34, 19, 13, 0.78), rgba(34, 19, 13, 0.22));
`;

export const SlideContent = styled.div`
  position: relative;
  padding: 36px;
  color: ${colors.white};
  max-width: 540px;
  z-index: 2;
`;

export const Eyebrow = styled.p`
  opacity: 0.8;
`;

export const HeroTitle = styled.h1`
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: clamp(2rem, 6vw, 3rem);
`;

export const Subtitle = styled.p`
  margin-bottom: 8px;
`;

export const CTAButton = styled.button`
  border: 1px solid ${colors.brandBrown};
  background: ${colors.brandBrown};
  color: ${colors.white};
  border-radius: 999px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
`;

export const SliderDots = styled.div`
  position: absolute;
  right: 20px;
  bottom: 18px;
  display: flex;
  gap: 8px;
  z-index: 3;
`;

export const SliderDot = styled.button<{ $active: boolean }>`
  width: 10px;
  height: 11px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  background: ${(props) => (props.$active ? colors.white : 'rgba(255, 255, 255, 0.5)')};
`;

export const CardsSection = styled.section`
  width: min(1200px, 94vw);
  margin: 0 auto;
  padding: 50px 0 72px;
`;

export const CardsHeading = styled.h2`
  margin-top: 0;
`;

export const CardsText = styled.p`
  margin-bottom: 12px;
  max-width: 700px;
  color: ${colors.warmMuted};
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const Card = styled.article`
  background: ${colors.white};
  border-radius: 16px;
  border: 1px solid ${colors.softBorder};
  padding: 20px;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
`;

export const CardTitle = styled.h3`
  margin-top: 0;
`;

export const CardText = styled.p`
  margin-bottom: 0;
  color: ${colors.textMuted};
`;
