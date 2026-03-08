import styled from 'styled-components';

import { colors } from '@src/styles/colors';

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
  margin-top: 10px;
`;

export const MetricCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 10px 12px;
  background: ${colors.white};
`;

export const MetricLabel = styled.p`
  color: ${colors.brownLight};
  font-size: 0.84rem;
  margin: 0 0 4px;
`;

export const MetricValue = styled.strong`
  font-size: 1.18rem;
  color: ${colors.brown};
`;

export const SectionTitle = styled.h3`
  margin: 0 0 8px;
`;

export const Section = styled.section`
  margin-top: 14px;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 12px;
`;

export const ChartBox = styled.div`
  min-height: 230px;
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 8px;
`;

export const StatusCard = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 10px;
  padding: 8px 10px;
`;

export const StatusName = styled.p`
  margin: 0 0 4px;
  color: ${colors.brownLight};
  text-transform: capitalize;
  font-size: 0.85rem;
`;

export const StatusCount = styled.strong`
  color: ${colors.brown};
`;

export const PlaceholderText = styled.p`
  color: ${colors.brownLight};
  margin: 0;
`;
