import { useState } from 'react';
import Grid from '../grid/Grid';
import Table from '../table/Table';
import Info from '../header/Info';
import TeamFilter from '../header/team-filter/TeamFilter';

import { UseRegisterKey } from '../../../hooks/use-register';

function UserLayout({ verteiler }) {
  UseRegisterKey(
    'change-grid-layout',
    verteiler.data.push,
    verteiler.data.pull
  );

  const [teamsFiltered, setTeamsFiltered] = useState([]);

  const getTV = () => (
    <div
      className={`user-layout ${
        verteiler.pageName === 'tagesverteiler'
          ? verteiler.data.user_settings.funktion_box
          : ''
      }`}
    >
      <div className="daycol-header-wrapper">
        <TeamFilter setTeamsFiltered={setTeamsFiltered} />
        <Info teamsFiltered={teamsFiltered} />
      </div>
      <div className="daycol-wrapper">
        <Grid />
      </div>
    </div>
  );

  const getWV = () => <Table verteiler={verteiler} />;

  return verteiler.pageName === 'tagesverteiler' ? getTV() : getWV();
}

export default UserLayout;
