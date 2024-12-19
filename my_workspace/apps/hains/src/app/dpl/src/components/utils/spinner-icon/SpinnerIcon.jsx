import styles from './spinner-icon.module.css';

function SpinnerIcon({ width, height, color, borderWidth, padding }) {
  return (
    <div className={styles.spinner_wrapper}>
      <div className={styles.spinner_icon} style={{ width, height, padding }}>
        <div
          className={styles.spinner}
          style={{ borderColor: color, borderWidth }}
        />
      </div>
    </div>
  );
}

export default SpinnerIcon;
