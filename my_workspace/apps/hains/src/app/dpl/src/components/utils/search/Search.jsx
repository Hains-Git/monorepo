import React, { useCallback, useEffect, useState } from 'react';
import { UseDropdown } from '../../../hooks/use-dropdown';
import SearchGroup from './SearchGroup';
import { isArray, isFunction, isObject } from '../../../tools/types';
import { UseMounted } from '../../../hooks/use-mounted';
import { throttle, wait } from '../../../tools/debounce';
import { getDefaultGroupSearchFkt } from '../../../tools/helper';
import styles from './search.module.css';
import { addClassNames } from '../../../util_func/util';

/**
 * Bekommt eine Suchfunktion (search), die bei Änderungen ausgeführt wird.
 * Bekommt ein Objekt mit Gruppen, die durchsucht werden sollen.
 * Bekommt ein Start-Input, der beim Start gesetzt wird. (default = "")
 *
 * * groups = {
 *   * key: {
 *     * label: 'Name der Gruppe',
 *     * data: [element1, element2, ...] || (callback) => [element1, element2, ...], element = { name: "value" }
 *     * optionale Attribute (automatisch erstellt, wenn nicht angegeben):
 *       * labelKey: 'name', (Name des Labels, für ein Daten-Element)
 *       * search: (element, value) => booleanSearch(element[labelKey], value), Suchfunktion
 *       * checked: [element1, element2, ...], Aktivierte Elemente
 *       * searchValue: '', Start-Suchwert der Gruppe (String)
 *       * sort: (elementA, elementB) => numericLocaleCompare(a.labelKey, b.labelKey), Sortiertfunktion, um die angezeigten Daten zu sortieren
 *   * }
 * * }
 * @param {Object} param0 { search, groups, startInput = '' }
 */
// && im Input entspricht einem && zwischen den Suchen für Parents auf den Gruppen
function Search({ search, groups, startInput = '', className = '' }) {
  const [input, setInput] = useState(startInput);
  const { caret, show, handleClick } = UseDropdown(false, false);
  const mounted = UseMounted();
  const [updateCheckboxes, setUpdateCheckboxes] = useState({});
  const [groupTitle, setGroupTitle] = useState('');

  const createDefaults = (group, key) => {
    // Label muss ein String sein
    if (typeof group?.label !== 'string')
      group.label = key?.toString?.() || 'Gruppe';
    // labelKey wird default auf 'name' gesetzt
    if (group?.labelKey === undefined) group.labelKey = 'name';
    // search wird default auf booleanSearch gesetzt
    if (!isFunction(group?.search)) {
      group.search = getDefaultGroupSearchFkt(group);
    }
    // checked wird default auf [] gesetzt
    if (!isArray(group?.checked)) {
      group.checked = [];
    }
    // searchValue wird default auf '' gesetzt
    if (typeof group?.searchValue !== 'string') {
      group.searchValue = '';
    }
  };

  const callUpdateCheckboxes = useCallback(() => {
    mounted && setUpdateCheckboxes(() => ({}));
  }, [mounted, setUpdateCheckboxes]);

  const callSearch = useCallback(
    (_input) => {
      mounted && search?.(_input, groups);
    },
    [mounted, search, groups]
  );

  const eachItem = (group, callback) => {
    if (isFunction(group?.data)) {
      return group.data(callback) || [];
    }
    return group?.data?.map?.((element, i) => callback(element, i)) || [];
  };

  const toggleChecked = (group, element, check) => {
    if (check) {
      if (!group.checked.includes(element)) group.checked.push(element);
    } else {
      group.checked = group.checked.filter((el) => el !== element);
    }
  };

  const updateGroup = (group, _input) => {
    eachItem(group, (element) => {
      let check = group?.searchValue === '' && _input === '';
      if (!check) {
        check = group.search(
          element,
          group?.searchValue === '' ? _input : group.searchValue
        );
      }
      toggleChecked(group, element, check);
    });
  };

  const updateGroups = useCallback(
    throttle((_input) => {
      for (const key in groups) {
        const group = groups[key];
        if (!isObject(group)) continue;
        updateGroup(group, _input);
      }
      callUpdateCheckboxes();
      callSearch(_input);
    }, wait),
    [groups]
  );

  const handleInput = (e) => {
    const _input = e.target.value;
    setInput(() => _input);
    updateGroups(_input);
  };

  useEffect(() => {
    setInput(() => startInput);
    updateGroups(startInput);
  }, [startInput]);

  useEffect(() => {
    let title = '';
    for (const key in groups) {
      const group = groups[key];
      if (!isObject(group)) continue;
      createDefaults(group, key);
      if (group?.searchValue) {
        title += `${group.label}: ${group?.searchValue}`;
      }
    }
    setGroupTitle(() => title);
  }, [groups]);

  const createGroupTitle = () => {
    mounted &&
      setGroupTitle(() => {
        let title = '';
        Object.values(groups).forEach((group) => {
          if (title) title += '\n';
          title += group?.searchValue
            ? `${group.label}: ${group?.searchValue}`
            : '';
        });
        return title;
      });
  };

  const clearSearch = () => {
    for (const key in groups) {
      const group = groups[key];
      if (!isObject(group)) continue;
      group.searchValue = '';
    }
    createGroupTitle();
    handleInput({ target: { value: '' } });
  };

  const getItems = () => {
    const result = [];
    const size = Object.keys(groups).length;
    for (const key in groups) {
      const group = groups[key];
      if (!isObject(group)) continue;
      result.push(
        <SearchGroup
          key={key}
          group={group}
          size={size}
          updateGroup={updateGroup}
          toggleChecked={toggleChecked}
          eachItem={eachItem}
          callSearch={callSearch}
          callUpdateCheckboxes={callUpdateCheckboxes}
          updateCheckboxes={updateCheckboxes}
          input={input}
          createGroupTitle={createGroupTitle}
        />
      );
    }
    return result;
  };

  if (!isFunction(search) || !isObject(groups)) return null;
  const hasGroups = !!Object.keys(groups).length;
  return (
    <div
      className={`${styles['search-component-container']} ${addClassNames(className, styles)}`}
    >
      <div className={styles['search-component-main-search']}>
        <span>
          <input
            placeholder="Suche"
            type="text"
            onChange={handleInput}
            value={input}
          />
          <span onClick={clearSearch}>X</span>
        </span>

        {hasGroups && (
          <span
            className={styles.caret}
            onClick={handleClick}
            title={groupTitle}
          >
            {caret}
          </span>
        )}
      </div>
      {show && hasGroups && (
        <div className={styles['search-component-dropdown-container']}>
          <div className={styles['search-component-dropdown']}>
            {getItems()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
