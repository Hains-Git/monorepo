import React, { useCallback, useEffect, useState } from 'react';
import Head from './Head';
import Body from './Body';
import {
  TableData,
  Sort,
  HeadRow,
  BodyOptions,
  HeadOptions,
  ColumnsLeftPositions,
  SetFixCell,
  pagingOptions,
  Paging
} from './types/table';
import styles from './table.module.css';
import { UseMounted } from '../../../hooks/use-mounted';
import CustomButton from '../custom-button/CustomButton';
import SearchData, { defaultSearch } from './SearchData';

export type TableOptions = {
  containerClassname?: string;
  containerStyle?: object;
  className?: string;
  style?: object;
  body?: BodyOptions;
  head?: HeadOptions;
  fixColumns?: number[];
  defaultSort?: Sort;
  hasDefaultSearch?: boolean;
  fontSize?: string;
};

const defaultOptions = {};

export const tableZoom = (current: TableOptions, diff: number) => {
  if (!(current.body || current.head)) return current;
  const fontSize = parseFloat(current?.body?.fontSize || '1rem');
  const result = { ...current };
  let nextFontSize = fontSize + diff;
  if (nextFontSize < 0.5) nextFontSize = 0.5;
  else if (nextFontSize > 2.0) nextFontSize = 2.0;
  if (result.body) result.body.fontSize = `${nextFontSize}rem`;
  if (result.head) result.head.fontSize = `${nextFontSize}rem`;
  return nextFontSize === fontSize ? current : result;
};

/**
 * Renders a table with the given data, options and columns.
 * Column renders titel or headRender and a Sort-Button.
 * @param data - The data to be displayed in the table. (Array of objects)
 * @param columns - The columns to be displayed in the table. (Array of objects)
 * @param options - Options for the table. (Object)
 * @returns React-Element
 * @example
 * data = [{
 *  name: "x",
 *  nested: {name: "xn"}}
 * }, ...]
 *
 * headRows = [{
 *  rowId?: "row1",
 *  className?: "row",
 *  style?: {width: "100%"},
 *  columns: [{
 *  id?: "column1",
 *  title: "Name",
 *  dataKey?: "nested.name", # Nur der dataKey der letzten Kopfzeile wird berücksichtigt.
 *  hoverTitle?: "Name des Mitarbeiters",
 *  className?: "headCell",
 *  style?: {color: "blue"},
 *  type?: "th"|"td",
 *  getColumnClass?: (row:HeadRow, column:Column, index:number) => string,
 *  getColumnStyle?: (row:HeadRow, column:Column, index:number) => object,
 *  bodyRender?.(row:HeadRow, column:Column, index:number) => ReactElement|string,
 *  headRender?.(row:HeadRow, column:Column, index:number) => ReactElement|string,
 *  bodyOnClick?.(evt:MouseEvent, row:HeadRow, column:Column, index:number) => void
 * }, ...]}]
 *
 * options = {
 *  containerClassname?: "container",
 *  containerStyle?: {width: "100%"},
 *  className?: "table",
 *  style?: {width: "100%"},
 *  fixColumns?: [0, 1],
 *  defaultSort?: {1: "desc"},
 *  body: {
 *    // sort:Sort = {columnIndex: "asc"|"desc", ...}
 *    sort?: (rowA:TableData, rowB:TableData, sort:Sort, columns:Column[]) => number}
 *    paging?: 10 | 20 | 50 | 100
 *  },
 *  head: {
 *    multiSort: false
 *  }
 * }
 */
function Table({
  data,
  headRows,
  options = defaultOptions
}: {
  data: TableData[];
  headRows: HeadRow[];
  options?: TableOptions;
}) {
  const [sort, setSort] = useState<Sort>({ 0: 'asc' });
  const [page, setPage] = useState<number>(1);
  const [paging, setPaging] = useState<Paging>(options?.body?.paging || 0);
  const [currentData, setCurrentData] = useState<TableData[]>(data);
  const [columnsLeftPositions, setColumnsLeftPositions] =
    useState<ColumnsLeftPositions>({});
  const mounted = UseMounted();
  const containerClassname =
    `${styles.table_container} ${options?.containerClassname || ''}`.trim();
  const containerStyle = options?.containerStyle || {};
  const className = (options?.className || '').trim();
  const style = options?.style || {};

  const setFixCell: SetFixCell = (index: number) => {
    const fixColumns = options?.fixColumns;
    if (!fixColumns || !mounted) return;
    const position = fixColumns.indexOf(index);
    if (position < 0) return;
    return (el: any) => {
      if (!el) return;
      let left = 0;
      if (position > 0) {
        const cells = el.parentElement.children;
        for (let i = 0; i < position; i++) {
          const cell = cells[fixColumns[i]];
          if (!cell) continue;
          const { width } = cells[fixColumns[i]].getBoundingClientRect();
          left += width;
        }
      }
      setColumnsLeftPositions((prev) => {
        const currentValue = prev[index];
        if (currentValue === left) return prev;
        return {
          ...prev,
          [index]: left
        };
      });
    };
  };

  useEffect(() => {
    setCurrentData(() => data);
  }, [data]);

  useEffect(() => {
    setColumnsLeftPositions(() => ({}));
    setCurrentData(() => data);
  }, [data, headRows, options]);

  useEffect(() => {
    setPaging(() => options?.body?.paging || 0);
    setSort(() => (options?.defaultSort ? options.defaultSort : { 0: 'asc' }));
  }, [options]);

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(searchValue, _data, headRows, (newData: TableData[]) => {
        mounted && setCurrentData(() => newData);
      });
    },
    [headRows, mounted, setCurrentData]
  );

  const maxPage = paging ? Math.ceil(data.length / paging) : 1;
  const hasPaging = options?.body?.paging;
  return (
    <div>
      {options?.hasDefaultSearch ? (
        <SearchData search={search} data={data} />
      ) : null}
      <div className={containerClassname} style={containerStyle}>
        <table className={className} style={style}>
          <Head
            headRows={headRows}
            setSort={setSort}
            sort={sort}
            options={options?.head}
            setFixCell={setFixCell}
            columnsLeftPositions={columnsLeftPositions}
          />
          <Body
            page={page}
            maxPage={maxPage}
            data={options?.hasDefaultSearch ? currentData : data}
            headRows={headRows}
            sort={sort}
            options={options?.body}
            paging={paging}
            setFixCell={setFixCell}
            columnsLeftPositions={columnsLeftPositions}
          />
        </table>
      </div>

      {hasPaging && maxPage > 0 ? (
        <div className={styles.paging_container}>
          <div className={styles.paging}>
            {Array.from({ length: 7 }).map((_, index) => {
              let _page = index;
              if (maxPage > 5) {
                if (page > maxPage - 3) {
                  _page = maxPage + index - 5;
                } else if (page > 2) _page = page + index - 3;
              }
              let label = _page.toString();
              if (index === 0) label = '<<';
              else if (index === 6) label = '>>';
              else if (index > maxPage) return null;
              return (
                <CustomButton
                  key={`page-${label}`}
                  clickHandler={() => {
                    if (index === 0) setPage(() => 1);
                    else if (index === 6) setPage(() => maxPage);
                    else setPage(() => _page);
                  }}
                  className={page === _page ? styles.active_page : ''}
                >
                  {label}
                </CustomButton>
              );
            })}
          </div>

          <select
            value={paging}
            title="Anzahl der Einträge pro Seite"
            onChange={(evt) =>
              setPaging(() => Number(evt.target.value) as Paging)
            }
          >
            {pagingOptions.map((nr) => (
              <option key={nr} value={nr}>
                {nr || 'Alle'}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default Table;
