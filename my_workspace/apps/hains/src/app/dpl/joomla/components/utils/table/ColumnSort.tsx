import React from 'react';
import { FaSortDown, FaSortUp, FaSort } from 'react-icons/fa';
import { SetSortFunction, Sort } from './types/table';
import styles from './table.module.css';

function ColumnSort({
  column,
  direction,
  setSort,
  multiSort
}: {
  column: number;
  setSort: SetSortFunction;
  direction: 'asc' | 'desc' | '';
  multiSort: boolean;
}) {
  const getIcon = () => {
    const sortTitle = multiSort
      ? '\nMit Shift-Taste und Klick auf die Sortierung wird nur nach der angeklickten Spalte sortiert.'
      : '\nMit Shift-Taste und Klick auf die Sortierung kann nach mehreren Spalten sortiert werden.';
    if (direction === 'desc') {
      return <FaSortDown title={`Absteigend soriert ${sortTitle}`} />;
    }
    if (direction === 'asc') {
      return <FaSortUp title={`Aufsteigend soriert ${sortTitle}`} />;
    }
    return <FaSort title={`Unsortiert ${sortTitle}`} />;
  };

  return (
    <button
      type="button"
      className={styles.column_sort_button}
      onClick={(evt) => {
        setSort((current: Sort) => {
          let result: Sort = { ...current };
          if ((!multiSort && !evt.shiftKey) || (multiSort && evt.shiftKey)) {
            result = { [column]: current[column] };
          }
          if (result[column] === 'asc') {
            result[column] = 'desc';
          } else if (result[column] === 'desc') {
            delete result[column];
          } else {
            result[column] = 'asc';
          }
          return result;
        });
      }}
    >
      {getIcon()}
    </button>
  );
}

export default ColumnSort;
