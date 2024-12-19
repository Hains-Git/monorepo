import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Freigabetyp } from '../utils/table/types/freigaben';
import styles from './freigaben.module.css';
import CustomButton from '../utils/custom-button/CustomButton';

function Freigabetypen({
  freigabetypen,
  freigabetypenIds,
  setFreigabetypenIds
}: {
  freigabetypen: Freigabetyp[];
  freigabetypenIds: number[];
  setFreigabetypenIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={styles.freigabetypen}>
      <p
        onClick={() => {
          setShow((cur) => !cur);
        }}
      >
        Freigabetypen: <span>{show ? <FaCaretUp /> : <FaCaretDown />}</span>
      </p>
      {show && (
        <>
          <div>
            <CustomButton
              clickHandler={() => {
                setFreigabetypenIds(() => freigabetypen.map((f) => f.id));
              }}
            >
              Alle
            </CustomButton>
            <CustomButton
              clickHandler={() => {
                setFreigabetypenIds(() => []);
              }}
            >
              Keine
            </CustomButton>
          </div>
          <div>
            {freigabetypen.map((f) => (
              <label key={f.id}>
                <input
                  type="checkbox"
                  checked={freigabetypenIds.includes(f.id)}
                  onChange={(evt) => {
                    setFreigabetypenIds((prev) =>
                      prev.includes(f.id)
                        ? prev.filter((id) => id !== f.id)
                        : [...prev, f.id]
                    );
                  }}
                />{' '}
                {f.name}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Freigabetypen;
