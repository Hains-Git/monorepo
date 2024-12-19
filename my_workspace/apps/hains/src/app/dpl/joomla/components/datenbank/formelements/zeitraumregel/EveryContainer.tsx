import React from 'react';
import Every from './Every';
import CheckBoxen from './CheckBoxen';

function EveryContainer({
  label,
  checked,
  setChecked,
  setIds,
  labels,
  ids,
  children = undefined
}: {
  label: string;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setIds: React.Dispatch<React.SetStateAction<number[]>>;
  labels: string[];
  ids: number[];
  children?: React.ReactNode;
}) {
  return (
    <Every
      checked={checked}
      toggleChecked={() => {
        setChecked((cur) => !cur);
      }}
      label={label}
    >
      {!checked && (
        <>
          {children}
          <CheckBoxen
            labels={labels}
            checked={(index) => ids.includes(index)}
            handler={(index) =>
              setIds((cur) =>
                cur.includes(index)
                  ? cur.filter((i) => i !== index)
                  : [...cur, index]
              )
            }
          />
        </>
      )}
    </Every>
  );
}

export default EveryContainer;
