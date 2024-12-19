import React, { Dispatch, SetStateAction } from 'react';
import Select from './form/Select';
import { TFunktion } from '../../helper/api_data_types';

type TProps = {
  funktionen: TFunktion[];
  setFilter: Dispatch<SetStateAction<{ funktion: string; aktiv: string }>>;
};

export default function FunktionsFilter({ funktionen, setFilter }: TProps) {
  const dataFunktionen = [
    { id: '', planname: 'Funktionen(Alle)' },
    ...funktionen
  ];

  const callbackOnChange = (val: string) => {
    setFilter((state: any) => ({ ...state, funktion: val }));
  };

  return (
    <Select
      keyExtractor="id"
      optionText="planname"
      data={dataFunktionen}
      callback={callbackOnChange}
      label=""
    />
  );
}
