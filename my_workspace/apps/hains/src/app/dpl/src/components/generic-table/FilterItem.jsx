import React from 'react';

import Input from './Input';
import Select from './Select';

function FilterItem({ filter, filterItemCb }) {
  let html = '';
  switch (filter.type) {
    case 'text':
      html = <Input filter={filter} filterItemCb={filterItemCb} />;
      break;
    case 'date':
      html = <Input filter={filter} filterItemCb={filterItemCb} />;
      break;
    case 'select':
      html = <Select filter={filter} filterItemCb={filterItemCb} />;
      break;
  }
  return <div className={`filter-${filter.key}`}>{html}</div>;
}

export default FilterItem;
