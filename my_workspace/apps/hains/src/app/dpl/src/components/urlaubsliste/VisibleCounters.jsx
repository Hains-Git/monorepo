import Cell from './Cell';
import styles from './urlaubsliste.module.css';

function VisibleCounters({ visibleCounters, vcl, i, getCounterTitle }) {
  return visibleCounters.map((counter, j) => {
    const title = getCounterTitle(counter);
    return (
      <Cell
        tag="th"
        id={`visible-column-head-${j}`}
        className={j === vcl ? styles.border : ''}
        key={`row-${i}-${counter.id}`}
        title={title}
      >
        {i === 0 ? counter.planname : ''}
      </Cell>
    );
  });
}

export default VisibleCounters;
