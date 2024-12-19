import React, { useCallback, useEffect, useState } from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import { isFunction } from '../../../tools/types';
import { numericLocaleCompare } from '../../../tools/helper';
import Checkbox from './Checkbox';
import { throttle, wait } from '../../../tools/debounce';
import styles from './search.module.css';

function SearchGroup({
  group,
  size,
  updateGroup,
  eachItem,
  callUpdateCheckboxes,
  updateCheckboxes,
  callSearch,
  toggleChecked,
  input,
  createGroupTitle
}) {
  const { caret, show, handleClick } = UseDropdown(false, false);
  const showDropdown = show || size === 1;
  const labelKey = group.labelKey;
  const [value, setValue] = useState(group?.searchValue || '');

  useEffect(() => {
    setValue(() => group?.searchValue || '');
  }, [group, group?.searchValue]);

  const debouncedUpdate = useCallback(
    throttle((_input) => {
      updateGroup(group, _input);
      callUpdateCheckboxes();
      callSearch(_input);
    }, wait),
    [group, callUpdateCheckboxes, callSearch]
  );

  const setGroupTitle = useCallback(
    throttle(() => {
      createGroupTitle();
    }, wait),
    [group, createGroupTitle]
  );

  const handleInput = (e) => {
    setValue(() => e.target.value);
    group.searchValue = e.target.value;
    setGroupTitle();
    debouncedUpdate(input);
  };

  const sort = isFunction(group?.sort)
    ? (a, b) => group.sort(a.props.element, b.props.element)
    : (a, b) => numericLocaleCompare(a.props.label, b.props.label);

  return (
    <div className={styles['search-group-component-container']}>
      {size > 1 && (
        <p onClick={handleClick}>
          {group.label} <span className={styles.caret}>{caret}</span>
        </p>
      )}
      {showDropdown && (
        <div className={styles['search-group-component']}>
          {show && (
            <input
              placeholder="Suche"
              type="text"
              onChange={handleInput}
              value={value}
            />
          )}
          <div className={styles['search-group-component-dropdown']}>
            {eachItem(group, (element, i) => (
              <Checkbox
                key={`${element.id}-${i}`}
                element={element}
                label={element?.[labelKey]?.toString?.() || ''}
                group={group}
                updateCheckboxes={updateCheckboxes}
                toggleChecked={toggleChecked}
                callSearch={callSearch}
                input={input}
              />
            ))?.sort?.(sort) || []}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchGroup;
