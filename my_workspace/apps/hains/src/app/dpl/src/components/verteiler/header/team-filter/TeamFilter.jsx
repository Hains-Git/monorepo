import { useState, useEffect, useContext } from 'react';
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp
} from 'react-icons/md';
import CustomButton from '../../../utils/custom_buttons/CustomButton';
import styles from './team-filter.module.css';
import { UseRegister } from '../../../../hooks/use-register';
import { VerteilerFastContext } from '../../../../contexts/VerteilerFastProvider';

function TeamFilter({ setTeamsFiltered }) {
  const { verteiler } = useContext(VerteilerFastContext);
  const teamsObj = verteiler?._teams;
  const vorlagen = verteiler?.vorlagen;
  const [checkedTeams, setCheckedTeams] = useState([]);
  const [show, setShow] = useState(false);
  const teams = teamsObj._each().arr;
  const updateByVorlagen = UseRegister(
    vorlagen?._push,
    vorlagen?._pull,
    vorlagen
  );

  const changeTeamsChecked = (evt) => {
    const val = parseInt(evt.target.value, 10);
    if (evt.target.checked) {
      setCheckedTeams((prev) => [...prev, val]);
    } else {
      setCheckedTeams((prev) => prev.filter((id) => id !== val));
    }
  };

  const teamNames = () => {
    const names = checkedTeams.reduce((acc, id) => {
      const team = teamsObj?.[id]?.name;
      if (team) {
        acc.push(team);
      }
      return acc;
    }, []);
    if (checkedTeams.includes(0)) {
      names.push('Keine Rotation');
    }
    return names;
  };

  const setDefaultTeams = () =>
    setCheckedTeams(() => verteiler?.vorlageTeamIds || []);

  useEffect(() => {
    setDefaultTeams();
  }, [updateByVorlagen]);

  useEffect(() => {
    setTeamsFiltered(() => checkedTeams);
    verteiler?.setFilteredTeamIds?.(checkedTeams);
  }, [checkedTeams]);

  return (
    <div className="team-filter-wrapper">
      <div
        className={styles.filter_header}
        onClick={() => setShow((prev) => !prev)}
      >
        <p className={styles.legend}>
          Team Filter: (
          {teamNames().map((name) => (
            <span key={name}>{name}</span>
          ))}
          )
        </p>
        <CustomButton style={{ fontSize: '1.5rem' }} className="as_icon">
          {show ? <MdOutlineKeyboardArrowDown /> : <MdOutlineKeyboardArrowUp />}
        </CustomButton>
      </div>
      {show && (
        <>
          <div className={styles.all_none}>
            <CustomButton
              clickHandler={() => setCheckedTeams(teams.map((t) => t.id))}
            >
              Alle
            </CustomButton>
            <CustomButton clickHandler={setDefaultTeams}>Default</CustomButton>
            <CustomButton clickHandler={() => setCheckedTeams([])}>
              Keine
            </CustomButton>
          </div>
          <div className={`team-filter ${styles.team_filter}`}>
            {teams.map((team) => {
              return (
                <fieldset key={team.name}>
                  <input
                    id={`team-${team.name}`}
                    type="checkbox"
                    value={team.id}
                    checked={checkedTeams.includes(team.id)}
                    onChange={changeTeamsChecked}
                  />
                  <label htmlFor={`team-${team.name}`}>{team.name}</label>
                </fieldset>
              );
            })}
            <fieldset>
              <input
                type="checkbox"
                value={0}
                onChange={changeTeamsChecked}
                id="keine-rotation"
              />
              <label htmlFor="keine-rotation">Keine Rotation</label>
            </fieldset>
          </div>
        </>
      )}
    </div>
  );
}

export default TeamFilter;
