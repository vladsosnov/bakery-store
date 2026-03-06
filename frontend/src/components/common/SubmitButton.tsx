import styled from 'styled-components';

import { colors } from '@src/styles/colors';

export const SubmitButton = styled.button`
  border-radius: 12px;
  border: none;
  background: ${colors.accentGreen};
  color: ${colors.white};
  font-weight: 700;
  padding: 12px 14px;
  cursor: pointer;
  transition: opacity 0.2s ease, filter 0.2s ease;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: grayscale(0.1);
  }
`;
