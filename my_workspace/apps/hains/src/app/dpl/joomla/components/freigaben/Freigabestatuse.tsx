import React from 'react';
import styles from './freigaben.module.css';
import { Freigabestatus } from '../utils/table/types/freigaben';

function Freigabestatuse({
  freigabestatuse
}: {
  freigabestatuse: Freigabestatus[];
}) {
  return (
    <div className={styles.freigabestatuse}>
      <p>Legende: </p>
      <ul>
        {freigabestatuse.map((f) => (
          <li
            key={f.id}
            style={{
              backgroundColor: f.color
            }}
          >
            {f.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Freigabestatuse;
