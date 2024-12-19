import React from 'react';
import Tab from '../../utils/tab/Tab';
import EinteilungAuswahl from './EinteilungAuswahl';

function DropEinteilungAuswahlPositionTab({
  table,
  checkPosition = 0,
  button = false,
  className = ''
}) {
  const auswahl = table?.auswahl;

  if (!auswahl) return null;
  return (
    <div className={className}>
      <Tab
        parent={auswahl}
        button={button}
        checkPosition={checkPosition}
        resizableLeft={checkPosition === 2}
        resizableRight={checkPosition === 0}
        resizableBottom={checkPosition === 1}
      >
        <EinteilungAuswahl einteilungAuswahl={table?.auswahl} table={table} />
      </Tab>
    </div>
  );
}

export default DropEinteilungAuswahlPositionTab;
