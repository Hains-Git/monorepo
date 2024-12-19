import { useState, useEffect } from 'react';
import styles from '../urlaubsliste.module.css';

function TeamsCheckboxList({ urlaubsliste }) {
  const team = urlaubsliste?.team || {};
  const [teamsFilter, setTeamsFilter] = useState(urlaubsliste?.teamIds || []);

  const changeTeamCheckbox = (e) => {
    const id = parseInt(e.target.value, 10);
    const teamIds = urlaubsliste.setTeamIds(id);
    setTeamsFilter(() => teamIds);
  };

  useEffect(() => {
    urlaubsliste.update('teamsCheckbox');
  }, [teamsFilter]);

  return (
    <div className={styles.checkbox_filter}>
      {Object.values(team).map((t) => {
        return (
          <fieldset key={`team-checkbox-${t.id}`}>
            <input
              id={`team-checkbox-filter-${t.id}`}
              type="checkbox"
              value={t.id}
              name={t.name}
              onChange={changeTeamCheckbox}
              checked={teamsFilter.includes(t.id)}
            />
            <label htmlFor={`team-checkbox-filter-${t.id}`}>{t.name}</label>
          </fieldset>
        );
      })}
    </div>
  );
}

export default TeamsCheckboxList;
