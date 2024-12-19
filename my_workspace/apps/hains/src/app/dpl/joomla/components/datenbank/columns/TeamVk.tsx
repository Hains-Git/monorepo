import React, { useState } from 'react';
import styles from '../datenbank.module.css';
import Loader from '../../utils/loader/Loader';

function TeamKV({
  team_vk
}: {
  team_vk: {
    label: string;
    title: string[];
  };
}) {
  const [title, setTitle] = useState<string[]>([]);

  const onOVer = () => {
    if (Array.isArray(team_vk.title))
      setTitle(() => team_vk.title.sort((a, b) => a.localeCompare(b)));
  };

  const onOut = () => {
    setTitle(() => []);
  };

  if (typeof team_vk !== 'object') {
    return (
      <div className={styles.team_vk_loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={styles.team_vk_container}
      onMouseOver={onOVer}
      onMouseOut={onOut}
    >
      <p>{team_vk.label}</p>
      <div className={styles.team_vk_title_container}>
        {title.length ? (
          <ul className={styles.team_vk_title}>
            {title.map((el, i) =>
              typeof el === 'string' ? <li key={i}>{el}</li> : null
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default TeamKV;
