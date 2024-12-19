import styles from '../urlaubsliste.module.css';

function Block({ headline, children }) {
  return (
    <div className="settings-block">
      {headline && <h4>{headline}</h4>}
      <div className={styles.setting_block_item}>{children}</div>
    </div>
  );
}
export default Block;
