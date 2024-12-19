import React, { ReactElement, useEffect, useState } from 'react';
import { getNestedAttr, numericLocaleCompare } from '../../../helper/util';
import { isFunction } from '../../../helper/types';
import {
  TableData,
  Sort,
  BodyOptions,
  Column,
  HeadRow,
  ColumnsLeftPositions,
  SetFixCell
} from './types/table';
import BodyCell from './bodyCell';

/**
 * Sortierfunktion für die Zeilen des Tabellen-Körpers.
 * @param {ReactElement} a
 * @param {ReactElement} b
 * @param {Sort} sort
 * @returns {number} - Das Ergebnis des Vergleichs
 */
export const sortBodyRows = (
  a: TableData,
  b: TableData,
  sort: Sort,
  columns: Column[]
): number => {
  let result = 0;
  for (const key in sort) {
    const sortState = sort[key];
    const keyNr = parseInt(key, 10);
    const column = columns[keyNr];
    if (column?.sortFkt) {
      return column.sortFkt(a, b) * (sortState === 'asc' ? 1 : -1);
    }
    const aContent =
      getNestedAttr(
        a,
        column?.sortKey || column?.dataKey || ''
      )?.toString?.() || '';
    const bContent =
      getNestedAttr(
        b,
        column?.sortKey || column?.dataKey || ''
      )?.toString?.() || '';
    result =
      numericLocaleCompare(aContent, bContent) * (sortState === 'asc' ? 1 : -1);
    if (result !== 0) {
      return result;
    }
  }
  return result;
};

const defaultOptions: BodyOptions = {
  sort: sortBodyRows,
  paging: 0
};

function Body({
  data,
  headRows,
  sort,
  options = defaultOptions,
  setFixCell,
  columnsLeftPositions,
  maxPage,
  page,
  paging
}: {
  data: TableData[];
  headRows: HeadRow[];
  sort: Sort;
  setFixCell: SetFixCell;
  columnsLeftPositions: ColumnsLeftPositions;
  options?: BodyOptions;
  maxPage: number;
  page: number;
  paging: number;
}) {
  const [body, setBody] = useState<ReactElement[]>([]);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const createBody = () => {
    const result: ReactElement[] = [];
    const l = (headRows?.length || 1) - 1;
    const headColumns = headRows?.[l]?.columns;
    const sortL = Object.keys(sort).length;
    if (options?.fontSize) setStyle(() => ({ fontSize: options.fontSize }));
    else setStyle(() => ({}));

    const sortedData = sortL
      ? data.sort(
          isFunction(options?.sort)
            ? (a, b) => options?.sort?.(a, b, sort, headColumns) || 0
            : (a, b) => sortBodyRows(a, b, sort, headColumns)
        )
      : data;

    const slicedData =
      paging && maxPage > 1
        ? sortedData.slice((page - 1) * paging, page * paging)
        : sortedData;

    const dataL = (slicedData?.length || 1) - 1;

    slicedData?.forEach?.((row: TableData, index: number) => {
      let onClick: React.MouseEventHandler<HTMLTableRowElement> | undefined;
      if (options?.onRowClick) {
        onClick = (evt) => {
          evt.stopPropagation();
          options?.onRowClick?.(evt, row, index);
        };
      }
      const checkFixCell = index === dataL;
      result.push(
        <tr key={`row-${index}`} onClick={onClick} className={row?.className}>
          {headColumns?.map?.((column: Column, indexC: number) => (
            <BodyCell
              key={`cell-${indexC}`}
              column={column}
              row={row}
              index={indexC}
              checkFixCell={checkFixCell}
              setFixCell={setFixCell}
              columnsLeftPositions={columnsLeftPositions}
            />
          ))}
        </tr>
      );
      if (!row?.addCustomRow) return;
      const indexRow = -1 - index;
      result.push(
        <tr
          key={`row-${indexRow}-add`}
          className={row?.customRowClassName}
          onClick={onClick}
        >
          {headColumns?.map?.((column: Column, indexC: number) => {
            const indexColumn = -1 - indexC;
            const newColumn =
              row?.addCustomRow?.(row, column, indexRow, indexColumn) || column;
            return (
              <BodyCell
                key={`cell-${indexColumn}-add`}
                column={newColumn}
                row={row}
                index={indexColumn}
                checkFixCell={checkFixCell}
                setFixCell={setFixCell}
                columnsLeftPositions={columnsLeftPositions}
              />
            );
          })}
        </tr>
      );
    });
    return result;
  };

  useEffect(() => {
    setBody(() => createBody());
  }, [data, headRows, sort, options, columnsLeftPositions, page, paging]);

  return <tbody style={style}>{body}</tbody>;
}

export default Body;
