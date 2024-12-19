import React, { useEffect, useState } from 'react';
import { debounce } from '../../../helper/debounce';
import { HeadRow, TableData } from './types/table';
import { booleanSearch } from '../../../helper/search';
import { getNestedAttr } from '../../../helper/util';

export const defaultSearch = (
  searchValue: string,
  data: TableData[],
  headRows: HeadRow[],
  setNewData: (data: TableData[]) => void
) => {
  const value = searchValue?.toLocaleLowerCase?.()?.trim?.() || '';
  if (searchValue === '') {
    setNewData(data);
  } else {
    const l = headRows.length - 1;
    const dataKeys =
      headRows?.[l]?.columns?.reduce?.((acc: (keyof TableData)[], column) => {
        if (column.dataKey) acc.push(column.dataKey as keyof TableData);
        return acc;
      }, []) || [];
    if (!dataKeys.length) return;
    let isInSearch = false;
    setNewData(
      data.filter((row) => {
        dataKeys.find((key) => {
          const attr =
            getNestedAttr(row, key)
              ?.toString?.()
              ?.toLocaleLowerCase?.()
              ?.trim?.() || '';
          isInSearch = booleanSearch(attr, value);
          return isInSearch;
        });
        return isInSearch;
      })
    );
  }
};

function SearchData({
  search,
  data,
  placeholder = 'Suche...'
}: {
  search: (searchValue: string, data: TableData[]) => void;
  data: TableData[];
  placeholder?: string;
}) {
  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = debounce(search, 300);

  useEffect(() => {
    debouncedSearch(searchValue, data);
  }, [search, data]);

  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(evt) => {
          setSearchValue(() => evt.target.value);
          debouncedSearch(evt.target.value, data);
        }}
      />
    </div>
  );
}

export default SearchData;
