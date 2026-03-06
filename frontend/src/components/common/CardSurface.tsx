import styled from 'styled-components';

import { colors } from '@src/styles/colors';
import { shadows } from '@src/styles/shadows';

export const CardSurface = styled.article`
  border-radius: 20px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: ${shadows.surfaceRaised};
  padding: 24px;
`;
