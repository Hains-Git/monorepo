import Fuehrung from './fuehrung/Fuehrung';
import { UseRegister } from '../../../../hooks/use-register';
import EinteilungAuswahl from '../../einteilung-auswahl/EinteilungAuswahl';
import Tab from '../../../utils/tab/Tab';
import Tabs from '../../tabs/Tabs';
import CustomFeldAuswahl from '../../table/customfeld/CustomFeldAuswahl';

function Toolbar({ table }) {
  UseRegister(table?._push, table?._pull, table);

  if (!table) return null;
  return (
    <div className="dienstplan-tabellen-container-toolbar">
      <Tabs title="">
        <Tab parent={table?.auswahl} button>
          <EinteilungAuswahl einteilungAuswahl={table?.auswahl} table={table} />
        </Tab>
        <Tab parent={table?.customFelder} button={false}>
          <CustomFeldAuswahl customFelder={table?.customFelder} />
        </Tab>
      </Tabs>
      <Fuehrung table={table} />
    </div>
  );
}

export default Toolbar;
