import React from 'react';
import VerteilerWrapper from '../verteiler/VerteilerWrapper';

function Wochenverteiler({ user, appModel }) {
  return (
    <VerteilerWrapper
      pageName="wochenverteiler"
      user={user}
      appModel={appModel}
    />
  );
}

export default Wochenverteiler;
