import React from 'react';
import styles from './loader.module.css';

function Loader({ className = '' }: { className?: string }) {
  return (
    <div className={`${className} ${styles.loader_container}`.trim()}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loader;
