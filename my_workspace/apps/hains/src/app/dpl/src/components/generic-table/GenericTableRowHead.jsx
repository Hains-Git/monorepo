import React, {
  useState,
  useEffect,
  useMemo
} from 'react';
import { IconContext } from "react-icons";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";
import styles from './generic-table.module.css';

function GenericTableRowHead({ column, order, pageTableModel }) {
  const toggleSort = (e) => {
    let sortBy = 'asc';
    if (order.key.toLowerCase() === column.key.toLowerCase()) {
      sortBy = order.sort.toLowerCase() === 'asc' ? 'desc' : 'asc';
    }
    const newOpts = {
      key: column.key,
      sort: sortBy,
      type: column.type
    };
    pageTableModel.evChangeOrder(newOpts);
  };

  let sort_asc = '';
  let sort_desc = '';

  if (column.key.toLowerCase() === order.key.toLowerCase()) {
    sort_asc = order.sort === 'asc' ? 'arrow_asc_active' : 'arrow_asc';
    sort_desc = order.sort === 'desc' ? 'arrow_desc_active' : 'arrow_desc';
  } else {
    sort_asc = 'arrow_asc';
    sort_desc = 'arrow_desc';
  }

  const styleAsc = useMemo(() => ({ size: '0.7em', className: styles[sort_asc] }), [order]);
  const styleDesc = useMemo(() => ({ size: '0.7em', className: styles[sort_desc] }), [order]);
  return (
    <th className={styles.table_th} onClick={toggleSort}>
      <span className={styles[sort_asc]}>
        <IconContext.Provider value={styleAsc}>
          <BiUpArrow />
        </IconContext.Provider>
      </span>
      <span className={styles[sort_desc]}>
        <IconContext.Provider value={styleDesc}>
          <BiDownArrow />
        </IconContext.Provider>
      </span>
      {column.title}
    </th>
  );
}

export default React.memo(GenericTableRowHead);
