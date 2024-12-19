import React from 'react';
import { ContextOptions } from '../helper/mailer_context_types';
import styles from './app.module.css';

function ContextOption({ option }: { option: ContextOptions }) {
  return (
    <div className={styles.context_option}>
      <p>API Parameter</p>
      {Object.entries(option).map(([key, value]) => {
        const arr = Array.isArray(value) ? value : [value];
        return (
          <div key={key}>
            <p>{key}:</p>
            <div>
              {arr.map((v, i) => (
                <p key={`value-${i}`}>
                  {key === 'params' ? `${i}: ` : ''}
                  {v}
                </p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ContextOption;
