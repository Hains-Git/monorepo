import React, { useEffect, useState } from 'react';
import Input from './form/Input';

type TProps = {
  beginn: string;
  ende: string;
  tageWoche: string;
};

type TTage = {
  [key: number | string]: number;
};

export default function UrlaubstageJahr({ beginn, ende, tageWoche }: TProps) {
  const [tage, setTage] = useState<TTage>({});

  function calculateMonths(startDate: Date, endDate: Date) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const result: TTage = {};

    for (let year = startYear; year <= endYear; year++) {
      const startMonth = year === startYear ? startDate.getMonth() + 1 : 0;
      const endMonth = year === endYear ? endDate.getMonth() : 11;
      const tageProMonat = 0.5 * Number(tageWoche);

      result[year] = Math.round((endMonth - startMonth + 1) * tageProMonat);
    }

    return result;
  }

  useEffect(() => {
    if (!beginn || !ende) return;

    const startDate = new Date(beginn);
    const endDate = new Date(ende);
    const result = calculateMonths(startDate, endDate);
    setTage(result);
  }, [beginn, ende, tageWoche]);

  if (!beginn || !ende) {
    return null;
  }

  return Object.keys(tage).map((year) => {
    const days = String(tage[year]);
    return (
      <Input
        key={year}
        name={`urlaubstage[${year}]`}
        label={`${year}`}
        aria-label={`urlaubstage-${year}`}
        value={days}
        title={`Urlaubstage für ${year}`}
      />
    );
  });
}
