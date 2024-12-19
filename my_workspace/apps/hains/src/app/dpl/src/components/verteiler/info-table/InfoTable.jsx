import { useContext } from 'react';
import GenericTable from '../../generic-table/GenericTable';
import { UseRegisterKey } from '../../../hooks/use-register';
import HeightAdjustWrapper from '../../utils/height-adjust-wrapper/HeightAdjustWrapper';
import CustomButton from '../../utils/custom_buttons/CustomButton';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function InfoTable() {
  const { useVerteilerFastContextFields, verteiler } =
    useContext(VerteilerFastContext);
  const { showInfoTable } = useVerteilerFastContextFields(['showInfoTable']);

  UseRegisterKey(
    'updateTable',
    verteiler?.infoTableModel?.push,
    verteiler?.infoTableModel?.pull
  );

  if (!verteiler?.infoTableModel) return null;
  if (!showInfoTable.get) return false;

  return (
    <HeightAdjustWrapper>
      <div className="wrapper-content">
        <div className={`info-table ${showInfoTable.get ? 'open' : ''}`}>
          <div className="info-table-content">
            <div className="header">
              <h3>Informationen zum Verteiler</h3>
              <CustomButton
                className="close-popup"
                type="button"
                // clickHandler={() => setShowInfoTable(false)}
                clickHandler={() => showInfoTable.set(false)}
              >
                X
              </CustomButton>
            </div>
            <GenericTable pageTableModel={verteiler.infoTableModel} />
          </div>
        </div>
      </div>
    </HeightAdjustWrapper>
  );
}
export default InfoTable;
