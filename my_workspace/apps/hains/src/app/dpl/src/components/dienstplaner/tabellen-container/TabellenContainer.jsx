import React, { useEffect, useState } from 'react';
import { UseRegister } from '../../../hooks/use-register';
import { UseTooltip } from '../../../hooks/use-tooltip';
import Table from '../table/Table';
import Info from '../../utils/info/Info';
import DropEinteilungAuswahlPositionTab from '../einteilung-auswahl/DropEinteilungAuswahlPosition';
import { addClassNames } from '../../../util_func/util';
import styles from './tabellen-container.module.css';

function TabellenContainer({
  dienstplan,
  title = '',
  className = 'table_container'
}) {
  const update = UseRegister(dienstplan?._push, dienstplan?._pull, dienstplan);
  const [table, setTable] = useState(null);

  useEffect(() => {
    setTable(() => dienstplan?.table || null);
  }, [update]);

  const [onOver, onOut] = UseTooltip(title);

  if (!table) return null;
  return (
    <>
      <DropEinteilungAuswahlPositionTab
        table={table}
        checkPosition={1}
        button={false}
        className="drop-einteilung-auswahl-horizontal"
      />
      <Info parent={table} />
      <div
        className={addClassNames(className, styles)}
        onMouseOver={onOver}
        onMouseOut={onOut}
      >
        <Table table={table} />
        <DropEinteilungAuswahlPositionTab
          table={table}
          checkPosition={2}
          button={false}
          className="drop-einteilung-auswahl-vertical"
        />
      </div>
    </>
  );
}

export default TabellenContainer;
