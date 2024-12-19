import React from 'react';
import VerteilerWrapper from '../verteiler/VerteilerWrapper';

function Tagesverteiler({ user, appModel }) {
  return (
    <VerteilerWrapper
      pageName="tagesverteiler"
      user={user}
      appModel={appModel}
    />
  );
}

export default Tagesverteiler;
