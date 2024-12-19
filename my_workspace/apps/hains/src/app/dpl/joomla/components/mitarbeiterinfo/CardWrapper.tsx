import React, { ReactNode } from 'react';
import styles from '../../mitarbeiterinfo/app.module.css'

type TProps = {
  children: ReactNode;
};

export default function CardWrapper({ children }: TProps) {
  return <div className={styles.card_wrapper}>{children}</div>;
}
