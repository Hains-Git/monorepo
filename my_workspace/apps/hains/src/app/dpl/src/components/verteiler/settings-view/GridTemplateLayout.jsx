import { useState, useEffect } from 'react';

import TableRow from './TableRow';
import TableCol from './TableCol';
import TableColPopup from './TableColPopup';
import styles from './settings-view.module.css';
import { isObject } from '../../../tools/types';
import { UseRegister } from '../../../hooks/use-register';

const convertName = (item) => item.split(' ');

function GridTemplateLayout({ options, gridTemplate }) {
  const [tableCoordinates, setTableCoordinates] = useState({
    rowIx: null,
    colIx: null
  });

  const [showTablePopup, setShowTablePopup] = useState(false);
  const [tablePopupSettings, setTablePopupSettings] = useState(null);
  const [settingsBtn, setSettingsBtn] = useState(null);
  UseRegister(gridTemplate?._push, gridTemplate?._pull, gridTemplate);

  useEffect(() => {
    if (tablePopupSettings) {
      gridTemplate?.updateColsAndRows?.(tablePopupSettings);
    }
  }, [tablePopupSettings]);

  const onChangeSelect = (rowIx, colIx, selectVal) => {
    gridTemplate?.updateGrid?.(rowIx, colIx, selectVal);
  };

  if (!isObject(gridTemplate?.grid)) return null;
  const shouldCreate = !!(gridTemplate.rows > 0 && gridTemplate.cols > 0);
  return (
    <div className={styles.template}>
      <p>{gridTemplate.device}</p>
      <div className={styles.grid_table}>
        {shouldCreate && (
          <>
            <table>
              <tbody>
                {Object.values(gridTemplate.grid).map((item, rowIx) => (
                  <TableRow key={`row-device-grid-${rowIx}`}>
                    {convertName(item).map((tdName, colIx) => (
                      <TableCol
                        key={`col-devic-grid-${tdName}-${colIx}`}
                        item={item}
                        options={options}
                        rowIx={rowIx}
                        colIx={colIx}
                        tdName={tdName}
                        onChangeSelect={onChangeSelect}
                        setTableCoordinates={setTableCoordinates}
                        setShowTablePopup={setShowTablePopup}
                        setSettingsBtn={setSettingsBtn}
                      />
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </table>
            <TableColPopup
              tableCoordinates={tableCoordinates}
              setTablePopupSettings={setTablePopupSettings}
              showTablePopup={showTablePopup}
              setShowTablePopup={setShowTablePopup}
              settingsBtn={settingsBtn}
            />
          </>
        )}
      </div>
    </div>
  );
}
export default GridTemplateLayout;
