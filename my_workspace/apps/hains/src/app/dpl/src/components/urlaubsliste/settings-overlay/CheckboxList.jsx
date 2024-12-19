import { useState, useEffect } from 'react';
import styles from '../urlaubsliste.module.css';

function isNumber(string) {
  return /^[0-9]*$/.test(string);
}

function CheckboxList({ dataObj, values, name, tablemodel }) {
  const [filter, setFilter] = useState(values || []);

  const changeCheckbox = (e) => {
    const val = e.target.value;
    const id = isNumber(val) ? parseInt(val, 10) : val;
    const ids = tablemodel.setFilterIds(id, name);
    setFilter(() => ids);
  };

  useEffect(() => {
    tablemodel.update(`${name}`);
    tablemodel.update('checkboxList');
  }, [filter]);

  const isChecked = (obj) => {
    return filter.includes(obj.id);
  };

  const createFieldsets = () => {
    return Object.values(dataObj).map((obj) => {
      return (
        <fieldset key={`${name}-checkbox-${obj.id}`}>
          <input
            id={`${name}-checkbox-filter-${obj.id}`}
            type="checkbox"
            value={obj.id}
            name={obj.name}
            onChange={changeCheckbox}
            checked={isChecked(obj)}
          />
          <label htmlFor={`${name}-checkbox-filter-${obj.id}`}>
            {obj.name}
          </label>
        </fieldset>
      );
    });
  };

  return <div className={styles.checkbox_filter}>{createFieldsets()}</div>;
}
export default CheckboxList;
