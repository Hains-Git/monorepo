import Cell from './Cell';
import styles from './urlaubsliste.module.css';

function VisibleColumns({ tablemodel, awColumnNames, i, ckl }) {
  const getTitle = (col) => {
    const result = [];
    const name = col?.name || '';
    const desc = col?.beschreibung || '';
    if (name) result.push({ txt: name });
    if (desc) result.push({ txt: `${desc}` });
    return result;
  };

  return tablemodel.visibleColumns.map((ck, j) => {
    return (
      <Cell
        id={`visible-column-head-${j}`}
        tag="th"
        className={j === ckl ? styles.border : ''}
        title={getTitle(awColumnNames[ck])}
        key={`row-${i}-${ck}`}
      >
        {i === 0 ? ck : ''}
      </Cell>
    );
  });
}

export default VisibleColumns;
