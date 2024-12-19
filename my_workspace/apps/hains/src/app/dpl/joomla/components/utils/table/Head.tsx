import React, { ReactElement, useEffect, useState } from 'react';
import {
  Sort,
  Column,
  HeadRow,
  SetSortFunction,
  HeadOptions,
  ColumnsLeftPositions,
  SetFixCell
} from './types/table';
import HeadCell from './HeadCell';

type HeadProps = {
  headRows: HeadRow[];
  setSort: SetSortFunction;
  sort: Sort;
  setFixCell: SetFixCell;
  columnsLeftPositions: ColumnsLeftPositions;
  options?: HeadOptions;
};

const defaultOptions = {};
/**
 * Letzte Zeile der Columns wird mit Sort-Buttons versehen und enthält die DataKeys für den Body.
 * @param {HeadProps} {columns, setSort, sort}
 * @returns {ReactElement}
 * @example
 * HeadProps = {
 * Columns: Array von HeadRow
 * setSort: SetSortFunction
 * sort: Sort
 * }
 */
function Head({
  headRows,
  setSort,
  sort,
  options = defaultOptions,
  setFixCell,
  columnsLeftPositions
}: HeadProps): ReactElement {
  const [head, setHead] = useState<ReactElement[]>([]);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const createColumns = (row: HeadRow, addSort: boolean) => {
    return (
      row.columns?.map?.((column: Column, index: number) => (
        <HeadCell
          key={`column-${index}`}
          column={column}
          options={options}
          sort={sort}
          setSort={setSort}
          index={index}
          addSort={addSort}
          row={row}
          setFixCell={setFixCell}
          columnsLeftPositions={columnsLeftPositions}
        />
      )) || null
    );
  };

  const createHeader = () => {
    const l = (headRows?.length || 1) - 1;
    if (options?.fontSize) setStyle(() => ({ fontSize: options.fontSize }));
    else setStyle(() => ({}));
    return (
      headRows?.map?.((row: HeadRow, index1: number) => {
        const rowOptions = {
          id: index1.toString(),
          className: '',
          style: {},
          ...row
        };
        const { id, className, style } = rowOptions;
        return (
          <tr key={`row-${index1}`} id={id} className={className} style={style}>
            {createColumns(row, l === index1)}
          </tr>
        );
      }) || null
    );
  };

  useEffect(() => {
    setHead(() => createHeader());
  }, [headRows, sort, options, columnsLeftPositions]);

  return <thead style={style}>{head}</thead>;
}

export default Head;
