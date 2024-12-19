import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Funktion } from '../utils/table/types/freigaben';
import styles from './freigaben.module.css';
import CustomButton from '../utils/custom-button/CustomButton';

function Funktionen({
  funktionen,
  funktionenIds,
  setFunktionenIds
}: {
  funktionen: Funktion[];
  funktionenIds: number[];
  setFunktionenIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [show, setShow] = useState(true);

  return (
    <div className={styles.funktionen}>
      <p
        onClick={() => {
          setShow((cur) => !cur);
        }}
      >
        Funktionen: <span>{show ? <FaCaretUp /> : <FaCaretDown />}</span>
      </p>
      {show && (
        <>
          <div>
            <CustomButton
              clickHandler={() => {
                setFunktionenIds(() => funktionen.map((f) => f.id));
              }}
            >
              Alle
            </CustomButton>
            <CustomButton
              clickHandler={() => {
                setFunktionenIds(() => []);
              }}
            >
              Keine
            </CustomButton>
          </div>
          <div>
            {funktionen.map((f) => (
              <label title={f.name} key={f.id}>
                <input
                  type="checkbox"
                  checked={funktionenIds.includes(f.id)}
                  onChange={(evt) => {
                    setFunktionenIds((prev) =>
                      prev.includes(f.id) ? prev.filter((id) => id !== f.id) : [...prev, f.id]
                    );
                  }}
                />{' '}
                {f.planname}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Funktionen;
