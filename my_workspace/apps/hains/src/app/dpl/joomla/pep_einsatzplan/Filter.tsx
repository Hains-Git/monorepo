import React from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Funktion, Team } from './types';
import styles from './app.module.css';
import CustomButton from '../components/utils/custom-button/CustomButton';

function Filter({
  filterArr,
  setIds,
  label,
  ids
}: {
  filterArr: Team[] | Funktion[];
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  label: string;
  ids: number[];
}) {
  const [show, setShow] = React.useState(false);
  return (
    <div className={styles.filter}>
      <p onClick={() => setShow((cur) => !cur)}>
        {label} {show ? <FaCaretUp /> : <FaCaretDown />}
      </p>
      {show ? (
        <div>
          <div>
            <CustomButton
              onClick={() => setIds(() => filterArr.map((f) => f.id))}
            >
              Alle
            </CustomButton>
            <CustomButton onClick={() => setIds(() => [])}>Keine</CustomButton>
          </div>
          {filterArr.map((f) => {
            return (
              <label key={f.id}>
                <input
                  type="checkbox"
                  checked={ids.includes(f.id)}
                  onChange={(evt) =>
                    setIds((curr) => {
                      if (evt.target.checked) {
                        return [...curr, f.id];
                      }
                      return curr.filter((id) => id !== f.id);
                    })
                  }
                />
                {f.name}
              </label>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default Filter;
