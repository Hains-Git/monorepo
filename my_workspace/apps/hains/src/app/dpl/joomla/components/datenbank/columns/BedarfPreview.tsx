import React, { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Column, TableData } from '../../utils/table/types/table';
import { getNestedAttr } from '../../../helper/util';
import { Bedarf } from '../../utils/table/types/datenbank';
import BedarfPreviewInfos from './BedarfPreviewInfos';
import styles from '../datenbank.module.css';
import CustomButton from '../../utils/custom-button/CustomButton';

function BedarfPreview({ row, column }: { row: TableData; column: Column }) {
  const [showInfos, setShowInfos] = useState(false);
  const bedarfe = getNestedAttr(row, `bedarfe.${column.dataKey}`);

  if (!bedarfe?.length) return null;
  const be = bedarfe?.reduce?.(
    (
      acc: {
        min: number;
        opt: number;
      },
      bedarf: Bedarf
    ) => {
      acc.min += bedarf.min || 0;
      acc.opt += bedarf.opt || 0;
      return acc;
    },
    {
      min: 0,
      opt: 0
    }
  ) || {
    min: 0,
    opt: 0
  };
  return (
    <div className={styles.bedarf_preview}>
      <p
        onClick={() => setShowInfos((prev) => !prev)}
        title={`Mindestbedarf: ${be.min}\nOptionaler Bedarf: ${be.opt}`}
      >
        {be.min},{be.opt}
        <span>{showInfos ? <FaCaretUp /> : <FaCaretDown />}</span>
      </p>
      {showInfos && (
        <div className={styles.bedarf_preview_infos}>
          <p>
            {getNestedAttr(row, 'planname') || ''}{' '}
            <CustomButton clickHandler={() => setShowInfos(() => false)}>
              X
            </CustomButton>
          </p>
          <div>
            {bedarfe.map((el: Bedarf) => (
              <BedarfPreviewInfos key={el.id} bedarf={el} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BedarfPreview;
