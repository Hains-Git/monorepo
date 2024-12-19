import { Dispatch, MouseEvent, ReactElement, SetStateAction } from 'react';
import { TableEinteilung } from './konflikteliste';
import { TableMitarbeiter } from './freigaben';
import { BedarfPreviewData } from './datenbank';
import { AccountInfo } from './accountinfo';

export type TableData = (
  | TableEinteilung
  | TableMitarbeiter
  | BedarfPreviewData
  | AccountInfo
  | {
      [key: string | number]: any;
    }
) & {
  addCustomRow?: (
    row: TableData,
    column: Column,
    indexRow: number,
    indexColumn: number
  ) => Column;
  className?: string;
  customRowClassName?: string;
};

export type Sort = {
  [key: number]: 'asc' | 'desc';
};

export type SetSortFunction = Dispatch<SetStateAction<Sort>>;

export type Column = {
  title: string;
  dataKey?: keyof TableData | string;
  id?: string;
  className?: string;
  style?: object;
  hoverTitle?: string;
  type?: 'td' | 'th';
  defaultValue?: string | number;
  sortable?: boolean;
  sortKey?: string;
  bodyColspan?: number;
  sortFkt?: (a: TableData, b: TableData) => number;
  getColumnClass?: (
    row: HeadRow | TableData,
    column: Column,
    index: number
  ) => string;
  getColumnStyle?: (
    row: HeadRow | TableData,
    column: Column,
    index: number
  ) => object;
  bodyRender?: (
    row: TableData,
    column: Column,
    index: number
  ) => ReactElement[] | ReactElement | string;
  headRender?: (
    row: HeadRow,
    column: Column,
    index: number
  ) => ReactElement[] | ReactElement | string;
  bodyOnClick?: (
    evt: MouseEvent,
    row: TableData,
    column: Column,
    index: number
  ) => void;
};

export type HeadRow = {
  id?: string;
  className?: string;
  style?: object;
  columns: Column[];
};

export type Paging = 0 | 10 | 20 | 50 | 75 | 100;

export type BodyOptions = {
  sort?: (a: TableData, b: TableData, sort: Sort, columns: Column[]) => number;
  paging?: Paging;
  onRowClick?: (evt: MouseEvent, row: TableData, index: number) => void;
  fontSize?: string;
};

export const pagingOptions: Paging[] = [0, 10, 20, 50, 75, 100];

export type HeadOptions = {
  multiSort?: boolean;
  fontSize?: string;
};

export type ColumnsLeftPositions = {
  [key: number]: number;
};

export type SetFixCell = (index: number) => ((el: any) => void) | undefined;
