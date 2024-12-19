import styles from './user-settings.module.css';
import { addClassNames } from '../../../util_func/util';

function LayoutIcon({ layoutSide, changeLayout, userSettings }) {
  const active = layoutSide === userSettings.funktion_box ? 'active' : '';
  const classNames = `${layoutSide} ${active}`;

  return (
    <div
      onClick={() => changeLayout(layoutSide)}
      className={`${styles.layout} ${addClassNames(classNames, styles)}`}
    >
      <div className={styles.info}> </div>
      <div className={styles.grid}>
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export default LayoutIcon;
