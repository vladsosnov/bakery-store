import styled from 'styled-components';
import { fadeInLift } from '@src/styles/animations';
import { colors } from '@src/styles/colors';
import { shadows } from '@src/styles/shadows';

export const Main = styled.main`
  width: min(1200px, 94vw);
  margin: 0 auto;
  padding: 30px 0 24px;
`;

export const Header = styled.header`
  margin-bottom: 18px;
`;

export const Title = styled.h1`
  margin: 0;
`;

export const Subtitle = styled.p`
  margin: 8px 0 0;
  color: ${colors.brownLight};
`;

export const Layout = styled.section`
  display: grid;
  gap: 18px;
  grid-template-columns: 280px 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled.aside`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  padding: 14px;
  box-shadow: ${shadows.surface};
  align-self: start;
  position: sticky;
  top: 84px;

  @media (max-width: 900px) {
    position: static;
  }

  transition: box-shadow 180ms ease, transform 180ms ease;
`;

export const SideTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
`;

export const SideGroup = styled.div`
  margin-top: 16px;
`;

export const GroupTitle = styled.p`
  margin: 0 0 8px;
  font-weight: 700;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  color: ${colors.brownLight};
  transition: color 160ms ease, transform 160ms ease;
  cursor: pointer;

  &:hover {
    color: ${colors.brown};
    transform: translateX(1px);
  }

  input {
    accent-color: ${colors.accentGreen};
    width: 16px;
    height: 16px;
  }
`;

export const ResetButton = styled.button`
  margin-top: 10px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  background: ${colors.surface};
  color: ${colors.brown};
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;

  &:hover {
    background: ${colors.surface};
    box-shadow: ${shadows.interactive};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(0.1);
  }
`;

export const Content = styled.div`
  min-width: 0;
`;

export const Toolbar = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  padding: 14px;
  box-shadow: ${shadows.surface};
  transition: box-shadow 200ms ease;
`;

export const SearchInput = styled.input`
  width: 100%;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  padding: 12px 13px;
  font-size: 0.98rem;
  transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;

  &:focus {
    outline: none;
    border-color: ${colors.accentGreen};
    box-shadow: ${shadows.focusRing};
    background: ${colors.white};
  }
`;

export const Categories = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$active ? colors.accentGreen : colors.border)};
  background: ${(props) => (props.$active ? colors.accentGreen : colors.surface)};
  color: ${(props) => (props.$active ? colors.white : colors.brownLight)};
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${(props) => (props.$active ? shadows.interactive : shadows.surface)};
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease,
    border-color 180ms ease, color 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) => (props.$active ? shadows.interactiveHover : shadows.surfaceRaised)};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Summary = styled.p<{ $error?: boolean }>`
  margin: 14px 0 0;
  color: ${(props) => (props.$error ? colors.errorRed : colors.brownLight)};
`;

export const ProductsGrid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  animation: ${fadeInLift} 260ms ease;
`;

export const ProductCard = styled.article`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: ${shadows.surface};
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.surfaceRaised};
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 148px;
  object-fit: cover;
`;

export const ProductImageFallback = styled.div`
  width: 100%;
  height: 148px;
  display: grid;
  place-items: center;
  background: ${colors.surface};
  color: ${colors.brownLight};
  font-size: 0.84rem;
  font-weight: 600;
  text-align: center;
  padding: 0 10px;
`;

export const ProductBody = styled.div`
  padding: 12px;
`;

export const ProductTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
`;

export const ProductMeta = styled.p`
  margin: 8px 0 0;
  color: ${colors.brownLight};
  font-size: 0.92rem;
`;

export const ProductRating = styled.p`
  margin: 8px 0 0;
  color: ${colors.brown};
  font-size: 0.9rem;
  font-weight: 600;
`;

export const ProductPrice = styled.p`
  margin: 10px 0 0;
  font-weight: 700;
`;

export const ProductTags = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const ProductActions = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: center;
`;

export const ItemCount = styled.span`
  border-radius: 999px;
  background: ${colors.surface};
  color: ${colors.brownLight};
  padding: 7px 10px;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
`;

export const AddToCartButton = styled.button`
  border-radius: 10px;
  border: 1px solid ${colors.accentGreen};
  background: ${colors.accentGreen};
  color: ${colors.white};
  padding: 9px 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 170ms ease, box-shadow 170ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${shadows.interactive};
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const ProductTag = styled.span`
  border-radius: 999px;
  background: ${colors.surface};
  color: ${colors.brownLight};
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const EmptyState = styled.div<{ $error?: boolean }>`
  margin-top: 16px;
  background: ${colors.white};
  border: 1px dashed ${colors.border};
  border-radius: 14px;
  padding: 18px;
  color: ${(props) => (props.$error ? colors.errorRed : colors.brownLight)};
  animation: ${fadeInLift} 220ms ease;
`;

export const ResultTransition = styled.div`
  @media (prefers-reduced-motion: reduce) {
    animation: none;

    * {
      animation: none !important;
      transition: none !important;
    }
  }
`;
