import styled from 'styled-components';
import { fadeInLift } from '@src/styles/animations';

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
  color: #76554a;
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
  background: #fff;
  border: 1px solid #f0d8c9;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
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
  color: #5d4137;
  transition: color 160ms ease, transform 160ms ease;
  cursor: pointer;

  &:hover {
    color: #452f28;
    transform: translateX(1px);
  }

  input {
    accent-color: #2f6f51;
    width: 16px;
    height: 16px;
  }
`;

export const ResetButton = styled.button`
  margin-top: 10px;
  width: 100%;
  border-radius: 12px;
  border: 1px solid #d8b8a5;
  background: #fff7f0;
  color: #513333;
  padding: 10px 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;

  &:hover {
    background: #f4e8de;
    box-shadow: 0 8px 16px rgba(83, 51, 51, 0.12);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Content = styled.div`
  min-width: 0;
`;

export const Toolbar = styled.div`
  background: #fff;
  border: 1px solid #f0d8c9;
  border-radius: 20px;
  padding: 14px;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
  transition: box-shadow 200ms ease;
`;

export const SearchInput = styled.input`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e3cbbb;
  padding: 12px 13px;
  font-size: 0.98rem;
  transition: border-color 180ms ease, box-shadow 180ms ease, background-color 180ms ease;

  &:focus {
    outline: none;
    border-color: #2f6f51;
    box-shadow: 0 0 0 4px rgba(47, 111, 81, 0.13);
    background: #fff;
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
  border: 1px solid ${(props) => (props.$active ? '#2f6f51' : '#d8b8a5')};
  background: ${(props) => (props.$active ? '#2f6f51' : '#fff7f0')};
  color: ${(props) => (props.$active ? '#fff' : '#5b3f36')};
  padding: 8px 12px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.$active ? '0 8px 16px rgba(47, 111, 81, 0.25)' : '0 2px 6px rgba(93, 65, 55, 0.08)'};
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease,
    border-color 180ms ease, color 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${(props) =>
    props.$active ? '0 10px 18px rgba(47, 111, 81, 0.32)' : '0 7px 14px rgba(93, 65, 55, 0.14)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Summary = styled.p`
  margin: 14px 0 0;
  color: #705247;
`;

export const ProductsGrid = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  animation: ${fadeInLift} 260ms ease;
`;

export const ProductCard = styled.article`
  background: #fff;
  border: 1px solid #f0d8c9;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 18px rgba(118, 77, 48, 0.08);
  transition: transform 200ms ease, box-shadow 200ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(118, 77, 48, 0.16);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 148px;
  object-fit: cover;
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
  color: #705247;
  font-size: 0.92rem;
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
`;

export const AddToCartButton = styled.button`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #2f6f51;
  background: #2f6f51;
  color: #fff;
  padding: 9px 12px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 170ms ease, box-shadow 170ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 9px 16px rgba(47, 111, 81, 0.25);
  }
`;

export const ProductTag = styled.span`
  border-radius: 999px;
  background: #f5ece5;
  color: #5e4339;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 700;
`;

export const EmptyState = styled.div`
  margin-top: 16px;
  background: #fff;
  border: 1px dashed #d8b8a5;
  border-radius: 14px;
  padding: 18px;
  color: #705247;
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
