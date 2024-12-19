import { TVertragsPhase } from '../../helper/api_data_types';

export const sortedPhasen: TVertragsPhase[] = [
  {
    id: 1,
    von: '2020-02-03',
    bis: '2023-03-30',
    vertrag_id: 1,
    vertragsstufe_id: 3
  },
  {
    id: 2,
    von: '2020-02-03',
    bis: '2023-03-31',
    vertrag_id: 1,
    vertragsstufe_id: 2
  },
  {
    id: 3,
    von: '2021-01-01',
    bis: '2021-01-31',
    vertrag_id: 1,
    vertragsstufe_id: 1
  },
  {
    id: 4,
    von: '2022-12-05',
    bis: '2022-11-27',
    vertrag_id: 1,
    vertragsstufe_id: 4
  },
  {
    id: 5,
    von: '2022-12-05',
    bis: null,
    vertrag_id: 1,
    vertragsstufe_id: 1
  },
  {
    id: 6,
    von: null,
    bis: '2022-11-30',
    vertrag_id: 1,
    vertragsstufe_id: 4
  },
  {
    id: 7,
    von: null,
    bis: null,
    vertrag_id: 1,
    vertragsstufe_id: 5
  },
  {
    id: 8,
    von: null,
    bis: null,
    vertrag_id: 1,
    vertragsstufe_id: 3
  }
];

export const editPhasen = [
  {
    id: 1,
    von: '2020-02-03',
    bis: '2021-01-31',
    vertrag_id: 1,
    vertragsstufe_id: 3
  },
  {
    id: 2,
    von: '2021-02-01',
    bis: '2022-12-31',
    vertrag_id: 1,
    vertragsstufe_id: 2
  },
  {
    id: 3,
    von: '2023-01-01',
    bis: '2025-01-31',
    vertrag_id: 1,
    vertragsstufe_id: 1
  }
];
