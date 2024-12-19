import React from 'react';
import FilterItem from './FilterItem';

function Filters({ filters, filterItemCb }) {
  const checkForVisibilty = (filter) => {
    const checkFilter = filters.find(
      (_filter) => _filter.key === filter.visible_on.key
    );
    if (!checkFilter) return null;
    const isIdInFilter = filter.visible_on.ids.includes(
      checkFilter.initial_val
    );
    return isIdInFilter ? (
      <FilterItem
        key={`filter-${filter.key || 0}`}
        filter={filter}
        filterItemCb={filterItemCb}
      />
    ) : null;
  };

  return (
    <>
      {filters.map((filter, ix) =>
        !filter.hasOwnProperty('visible_on') ? (
          <FilterItem
            key={`filter-${filter.key || ix}`}
            filter={filter}
            filterItemCb={filterItemCb}
          />
        ) : (
          checkForVisibilty(filter)
        )
      )}
    </>
  );
}
export default Filters;
