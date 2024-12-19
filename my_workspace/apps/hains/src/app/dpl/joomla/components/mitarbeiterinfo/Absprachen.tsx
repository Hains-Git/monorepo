import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import React, { useContext } from 'react';
import CustomButton from '../utils/custom-button/CustomButton';
import {
  AbsprachePopupContext,
  AbsprachePopupProvider
} from '../../context/mitarbeiterinfo/AbsprachePopupProvider';
import { ApiContext } from '../../context/mitarbeiterinfo/ApiProvider';
import styles from '../../mitarbeiterinfo/app.module.css';
import { AbspracheType, TAbsprache } from '../../helper/api_data_types';
import { DataContext } from '../../context/mitarbeiterinfo/DataProvider';
import AbsprachePopup from './popup/AbsprachePopup';
import { HeadRow, TableData } from '../utils/table/types/table';
import Table, { TableOptions } from '../utils/table/Table';

type TProps = {
  label: string;
  type: AbspracheType;
  absprachen: TAbsprache[];
  headRow: HeadRow;
};

const options: TableOptions = {
  hasDefaultSearch: true,
  defaultSort: { 0: 'desc' },
  className: styles.max_full_width
};

function Absprachen({ label, type, absprachen, headRow }: TProps) {
  const { deleteAbsprache } = useContext(ApiContext);

  const { editAbsprache, setTitle, createAbsprache } = useContext(
    AbsprachePopupContext
  );

  const onEdit = (absprache: TableData) => {
    setTitle(label);
    editAbsprache(absprache as TAbsprache, type);
  };

  const onCreate = () => {
    setTitle(label);
    createAbsprache(type);
  };

  const onDelete = (id: number) => {
    const res = window.confirm(
      `Soll die Absprache (Typ: ${type}) wirklich gelöscht werden?`
    );
    if (res) {
      deleteAbsprache(id, type);
    }
  };

  const renderBtns = (absprache: TableData) => (
    <div className={styles.row}>
      <CustomButton
        className="as_icon primary"
        clickHandler={() => onEdit(absprache)}
      >
        <FaEdit />
      </CustomButton>
      <CustomButton
        className="as_icon red"
        clickHandler={() => onDelete(absprache.id)}
      >
        <FaTrash />
      </CustomButton>
    </div>
  );

  const renderAddBtn = () => (
    <CustomButton className="primary" clickHandler={onCreate}>
      <FaPlus />
    </CustomButton>
  );

  const headRows: HeadRow[] = [
    {
      columns: [
        {
          title: 'ID',
          dataKey: 'id'
        },
        ...headRow.columns,
        {
          title: '',
          sortable: false,
          bodyRender: renderBtns,
          headRender: renderAddBtn
        }
      ]
    }
  ];

  return (
    <div>
      <h3>{label}</h3>
      <Table data={absprachen} headRows={headRows} options={options} />
    </div>
  );
}

export function AbsprachenWrapper({ children }: { children: React.ReactNode }) {
  const { config } = useContext(DataContext);
  if (!config?.id) return null;
  return (
    <AbsprachePopupProvider mitarbeiter_id={config.id}>
      {children}
      <AbsprachePopup />
    </AbsprachePopupProvider>
  );
}

export default Absprachen;
