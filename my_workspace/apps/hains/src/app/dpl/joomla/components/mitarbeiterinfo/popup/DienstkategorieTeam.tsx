import React, { useState } from 'react';

import styles from './popup.module.css';
import { TTeam } from '../../../helper/api_data_types';

type TProps = {
  team: TTeam;
  popupData: any;
  wunschAbgebenFunc: any;
};

function DienstkategorieTeam({ team, popupData, wunschAbgebenFunc }: TProps) {
  const [isVis, setIsVis] = useState(team.id === popupData.teamAm.id);

  const onWunschAbgeben = (tdk: any) => {
    const dienstkategorie_id = tdk.id;
    wunschAbgebenFunc(dienstkategorie_id);
  };

  const renderDienstkategories = () => {
    return (team as any)?.dienstkategories?.map?.((tdk: any) => {
      return (
        <p key={tdk.id} onClick={() => onWunschAbgeben(tdk)}>
          <span style={{ backgroundColor: tdk.color }} />
          {tdk.name}
        </p>
      );
    });
  };

  return (
    <div className={styles.dienstkategorie_team} key={team.id}>
      <h3 onClick={() => setIsVis((cur) => !cur)}>{team.name}</h3>
      {isVis && (
        <div className={styles.dienstkategorie}>{renderDienstkategories()}</div>
      )}
    </div>
  );
}

export default DienstkategorieTeam;
