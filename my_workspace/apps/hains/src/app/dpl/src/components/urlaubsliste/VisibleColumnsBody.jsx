import Cell from './Cell';
import styles from './urlaubsliste.module.css';

const getAvaibleYear = (tablemodel, abwesentheiten) => {
  const years = tablemodel.yearAw.split('-');
  let year = tablemodel.yearAw;
  for (let i = 0; i < years.length; i++) {
    const _year = years[i];
    if (abwesentheiten?.[_year]) {
      year = _year;
      break;
    }
  }
  return year;
};

function VisibleColumnsBody({ tablemodel, abwesentheiten, m, ckl }) {
  const year = getAvaibleYear(tablemodel, abwesentheiten);
  return tablemodel.visibleColumns.map((ck, j) => {
    return (
      <Cell
        id={`visible-column-body-${j}`}
        className={j === ckl ? `${styles.border} visible-column-body` : 'visible-column-body'}
        key={`${m?.id}-${ck}`}
      >
        {abwesentheiten?.[year]?.[m?.id]?.[ck] ?? ''}
      </Cell>
    );
  });
}

export default VisibleColumnsBody;
