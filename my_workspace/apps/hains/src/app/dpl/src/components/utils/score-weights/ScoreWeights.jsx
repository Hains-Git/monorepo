import React from 'react';
import { TbWeight } from 'react-icons/tb';
import CustomButton from '../custom_buttons/CustomButton';
import { UseDropdown } from '../../../hooks/use-dropdown';
import styles from './score-weights.module.css';

function ScoreWeights({ scores, callback }) {
  const { show, handleClick, closeDropDown } = UseDropdown(false, false);

  const onChange = (e) => {
    const { name, value } = e.target;
    scores.set(name, value);
    console.log(name, value);
    callback?.(scores);
  };

  return (
    <div className={styles.scores}>
      <CustomButton
        title="Score gewichte einstellen."
        className="as_icon"
        clickHandler={handleClick}
      >
        <TbWeight />
      </CustomButton>
      {show ? (
        <div>
          <p>
            Scores Gewichtung{' '}
            <CustomButton clickHandler={closeDropDown}>X</CustomButton>
          </p>
          <div>
            <label aria-label="faktor">
              Faktor:
              <input
                name="faktor"
                type="number"
                defaultValue={scores.faktor}
                onChange={onChange}
              />
            </label>
            {Object.entries(scores.weights).map(([key, value]) => (
              <label key={key} aria-label={key} onChange={onChange}>
                {key}:
                <input name={key} type="number" defaultValue={value} />
              </label>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default ScoreWeights;
