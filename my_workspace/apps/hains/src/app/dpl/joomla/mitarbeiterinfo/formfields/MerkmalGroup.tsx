import React from 'react';

import { DataContext } from '../../context/mitarbeiterinfo/DataProvider';
import { AccountInfo } from '../../components/utils/table/types/accountinfo';
import MerkmalItem from '../../components/mitarbeiterinfo/MerkmalItem';
import { TMerkmal, TMitarbeiterMerkmal } from '../../helper/api_data_types';
import styles from '../app.module.css';

type TProps = {
  accountInfo: AccountInfo | undefined;
};

const groupBy = (array: any, key: string) => {
  const grouped = array.reduce((result: any, currentItem: any) => {
    (result[currentItem[key]] = result[currentItem[key]] || []).push(
      currentItem
    );
    return result;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([_, items]) => items);
};

function MerkmalGroup({ accountInfo }: TProps) {
  const [merkmale, setMerkmale] = React.useState([]);
  const [mitarbeiterMerkmale, setMitarbeiterMerkmale] =
    React.useState<TMitarbeiterMerkmal>();
  const { queryMerkmale } = React.useContext(DataContext);

  React.useEffect(() => {
    const mId = accountInfo?.mitarbeiter_id;
    if (!mId) return;
    queryMerkmale(mId).then((_data: any) => {
      if (_data?.merkmale) setMerkmale(_data?.merkmale || []);
      if (_data?.mitarbeiter_merkmale)
        setMitarbeiterMerkmale(_data.mitarbeiter_merkmale);
    });
  }, [accountInfo]);

  const groupedMerkmale = groupBy(merkmale, 'typ');

  return groupedMerkmale.map((group: any, index: number) => {
    const customKey = `${group?.[0]?.name}-${index}`;
    const groupTyp = group?.[0]?.typ;
    return (
      <div
        className={`${styles.group_merkmale} ${styles[groupTyp]}`}
        key={customKey}
      >
        {group.map((merkmal: TMerkmal) => {
          return (
            <MerkmalItem
              key={`${merkmal?.id}-${merkmal?.name}`}
              merkmal={merkmal}
              mitarbeiterMerkmal={mitarbeiterMerkmale}
            />
          );
        })}
      </div>
    );
  });
}
export default MerkmalGroup;
