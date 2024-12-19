import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { TableData } from '../utils/table/types/table';
import { TData } from '../../mitarbeiterinfo/types';

import Select from './form/Select';

type TProps = {
  setFilter: Dispatch<SetStateAction<{ funktion: string; aktiv: string }>>;
};

export default function AktivFilter({ setFilter }: TProps) {
  const options = [
    { val: 'true', name: 'Aktiv' },
    { val: 'false', name: 'Inaktiv' }
  ];

  const onChangeCb = (val: string) => {
    setFilter((state) => ({ ...state, aktiv: val }));
  };

  return (
    <Select
      keyExtractor="val"
      optionText="name"
      data={options}
      label=""
      callback={onChangeCb}
    />
  );
}
