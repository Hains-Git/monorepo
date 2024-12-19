import { CellHookData, UserOptions } from "jspdf-autotable"

export type AutoTableColumnProps = {
  height: number,
  width: number
}

export type AutoTable = {
  columns: Array<AutoTableColumnProps>,
  head: Array<AutoTableColumnProps>,
  body: Array<AutoTableColumnProps>,
  foot: Array<AutoTableColumnProps>,
  settings: {
    margin: {
      left: number,
      right: number,
      top: number,
      bottom: number
    }
  }
}

export type AutoTableData = {
  table: UserOptions,
  weekends: Array<number>,
  holidays: Array<number>,
  bereichColors: object,
  subBereichColors: object,
  bold: object,
  bereichRows: Array<number>
}

export type AutoTableOptions = {
  didParseCell: (cellData: CellHookData, data?: any) => void | boolean,
  didDrawCell: (cellData: CellHookData, data?: any) => void | boolean,
  kommentar: string,
  addDate: boolean
}

type ReasonError = {
  logout: boolean,
  code: string
}

export type Reason = {
  error: ReasonError
}

export type CSS_Style = {
  [key: string]: string
}

export type User = any;