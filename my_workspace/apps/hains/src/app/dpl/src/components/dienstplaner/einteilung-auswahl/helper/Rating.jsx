import { TbStarFilled } from 'react-icons/tb';
import { nonBreakSpace } from '../../../../tools/htmlentities';
import styles from '../einteilungauswahl.module.css';
import { UseTooltip } from '../../../../hooks/use-tooltip';

function Rating({ rating }) {
  const [onOver, onOut] = UseTooltip(
    rating?.value ? `Rating: ${rating.value}` : ''
  );

  return rating ? (
    <div
      className={styles.rating_container}
      onMouseOver={onOver}
      onMouseOut={onOut}
    >
      <TbStarFilled fill="yellow" />

      <div
        className={styles.rating}
        style={{
          width: `${rating.percValue}%`
        }}
      >
        {nonBreakSpace}
      </div>
    </div>
  ) : null;
}

export default Rating;
