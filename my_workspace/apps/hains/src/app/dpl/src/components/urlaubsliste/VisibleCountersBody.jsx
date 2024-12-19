import Cell from './Cell';
import styles from './urlaubsliste.module.css';

function VisibleCountersBody({ visibleCounters, vcl, awCounterPoDienst, m, getCounterTitle }) {
  return visibleCounters.map((counter, j) => {
    const counterVal = awCounterPoDienst[counter?.id]?.[m?.id]?.[counter?.po_dienst_id];
    const title = getCounterTitle(counter);
    return (
      <Cell
        id={`visible-column-body-${j}`}
        className={j === vcl ? `${styles.border} visible-column-body` : 'visible-column-body'}
        key={`${m?.id}-${counter.id}`}
        title={title}
      >
        {counterVal || ''}
      </Cell>
    );
  });
}

export default VisibleCountersBody;
