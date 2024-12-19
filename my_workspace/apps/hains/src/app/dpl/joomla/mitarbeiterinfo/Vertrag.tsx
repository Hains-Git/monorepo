import React, { useContext, useEffect, useState, useCallback } from 'react';

import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

import { ApiContext } from '../context/mitarbeiterinfo/ApiProvider';
import { VertragContext } from '../context/mitarbeiterinfo/VertragProvider';
import { OAuthContext } from '../context/OAuthProvider';

import styles from './app.module.css';
import CustomButton from '../components/utils/custom-button/CustomButton';
import Table, { TableOptions } from '../components/utils/table/Table';
import { Column, HeadRow, TableData } from '../components/utils/table/types/table';
import VertragPopupWrapper from '../components/mitarbeiterinfo/popup/VertragPopupWrapper';
import VertragForm from '../components/mitarbeiterinfo/form/VertragForm';
import PhaseForm from '../components/mitarbeiterinfo/form/PhaseForm';
import { renderBoolean, renderDate } from '../datenbank/models';
import { TVertrag, TVertragsArbeitszeit, TVertragsPhase } from '../helper/api_data_types';
import VertragArbeitszeitForm from '../components/mitarbeiterinfo/form/VertragArbeitszeitForm';
import { getGermandate, today } from '../helper/dates';
import { deepClone } from '../helper/util';

const headRowsPhasenDefault: HeadRow = {
  columns: [
    {
      title: 'Phasen: Von',
      dataKey: 'von',
      bodyRender: renderDate
    },
    {
      title: 'Bis',
      dataKey: 'bis',
      bodyRender: renderDate
    },
    { title: 'Gruppe', dataKey: 'vertragsstufe.vertragsgruppe.name' },
    { title: 'Stufe', dataKey: 'vertragsstufe.stufe' },
    {
      title: 'Std./Woche',
      dataKey: 'vertragsstufe.vertrags_variante.wochenstunden'
    },
    {
      title: 'Urlaubstage/Monat',
      dataKey: 'vertragsstufe.vertrags_variante.tage_monat'
    }
  ]
};

const headRowsArbeitszeitDefault: HeadRow = {
  columns: [
    {
      title: 'Arbeitszeiten: Von',
      dataKey: 'von',
      bodyRender: renderDate
    },
    {
      title: 'Bis',
      dataKey: 'bis',
      bodyRender: renderDate
    },
    { title: 'VK', dataKey: 'vk' },
    { title: 'Tage/Woche', dataKey: 'tage_woche' }
  ]
};

const renderEditBtn = (
  arialabel: string,
  canDelete: boolean,
  confirmMsg: string,
  deleteCall: () => void,
  showForm: () => void
) => {
  return (
    <div>
      <div className={styles.row}>
        <CustomButton
          aria-label={`edit-${arialabel}`}
          data-testid={`edit-${arialabel}`}
          className="as_icon primary"
          clickHandler={() => {
            showForm();
          }}
        >
          <FaEdit />
        </CustomButton>
        {canDelete ? (
          <CustomButton
            aria-label={`delete-${arialabel}`}
            data-testid={`delete-${arialabel}`}
            className="as_icon red"
            clickHandler={() => {
              const res = window.confirm(confirmMsg);
              if (!res) return;
              deleteCall();
            }}
          >
            <FaTrash />
          </CustomButton>
        ) : null}
      </div>
    </div>
  );
};

const renderAddBeforeAfterButton = (showForm: () => void) => {
  return (
    <div>
      <CustomButton className="primary as_icon" clickHandler={showForm}>
        <FaPlus />
      </CustomButton>
    </div>
  );
};

const renderAddBtn = (clickHandler: () => void, title: string, arialabel: string) => {
  return (
    <CustomButton
      className="primary"
      aria-label={`add-${arialabel}`}
      data-testid={`add-${arialabel}`}
      title={title}
      clickHandler={clickHandler}
    >
      <FaPlus />
    </CustomButton>
  );
};

const vertragTableOptions: TableOptions = {
  hasDefaultSearch: true,
  defaultSort: { 2: 'desc', 3: 'desc' },
  className: styles.max_full_width
};

function Vertrag() {
  const { user } = useContext(OAuthContext);
  const canDelete = user.roles.includes('Benutzerverwaltung') || user.roles.includes('HAINS Admins');
  const { mitarbeiterData } = useContext(ApiContext);
  const mitarbeiterName = mitarbeiterData?.mitarbeiter.planname;
  const { vertrags, show, formConfig, showPopup, deleteArbeitszeit, deletePhase, deleteVertrag, rentenEintrittDe } =
    useContext(VertragContext);
  const [tableData, setTableData] = useState<TableData[]>(vertrags || []);
  const renderEditVertragBtn = useCallback(
    (row: TableData) => {
      const vertrag = row as TVertrag;
      return renderEditBtn(
        `vertrag-${vertrag.id}`,
        canDelete,
        `Sind Sie sicher Sie möchten diesen Vertrag und alle dazugehörigen Phasen und Arbeitszeiten löschen?  `,
        () => deleteVertrag(vertrag.id),
        () => {
          show({
            form: 'vertrag',
            vertrag,
            title: `Vertrag ${vertrag?.id} Anpassen`
          });
        }
      );
    },
    [vertrags, user]
  );

  const renderEditVertragsArbeitszeitBtn = useCallback(
    (vertrag: TVertrag) => (row: TableData) => {
      const arbeitszeit = row as TVertragsArbeitszeit;
      return renderEditBtn(
        `arbeitszeit-${arbeitszeit.id}`,
        canDelete,
        `Sind Sie sicher Sie möchten die Arbeitszeit löschen?  `,
        () => {
          deleteArbeitszeit(arbeitszeit.id, arbeitszeit.vertrag_id);
        },
        () => {
          show({
            form: 'arbeitszeit',
            vertrag,
            title: `Arbeitszeit ${arbeitszeit.id} bearbeiten`,
            arbeitszeit,
            originArbeitszeit: arbeitszeit
          });
        }
      );
    },
    [vertrags, user]
  );

  const renderAddBeforeAfterVertragsArbeitszeitBtn = useCallback(
    (vertrag: TVertrag) => (row: TableData) => {
      const arbeitszeit = row as TVertragsArbeitszeit;
      return renderAddBeforeAfterButton(() => {
        show({
          form: 'arbeitszeit',
          vertrag,
          title: `Neue Arbeitszeit für Vertrag: ${vertrag.id}`,
          arbeitszeit: { ...deepClone(arbeitszeit), id: 0, von: '', bis: '' },
          originArbeitszeit: arbeitszeit
        });
      });
    },
    [vertrags, user]
  );

  const renderEditPhaseBtn = useCallback(
    (vertrag: TVertrag) => (row: TableData) => {
      const phase = row as TVertragsPhase;
      return renderEditBtn(
        `phase-${phase.id}`,
        canDelete,
        `Sind Sie sicher Sie möchten die Phase löschen?  `,
        () => deletePhase(phase.id, phase.vertrag_id),
        () => {
          show({
            form: 'phase',
            vertrag,
            title: `Phase ${phase.id} bearbeiten`,
            phase,
            originPhase: phase
          });
        }
      );
    },
    [vertrags, user]
  );

  const renderAddBeforeAfterVertragsPhaseBtn = useCallback(
    (vertrag: TVertrag) => (row: TableData) => {
      const phase = row as TVertragsPhase;
      return renderAddBeforeAfterButton(() => {
        show({
          form: 'phase',
          vertrag,
          title: `Neue Phase für Vertrag: ${vertrag.id}`,
          phase: { ...deepClone(phase), id: 0, von: '', bis: '' },
          originPhase: phase
        });
      });
    },
    [vertrags, user]
  );

  const renderAddVertragsArbeitszeitBtn = (vertrag: TVertrag) => () => {
    if (vertrag?.vertrags_arbeitszeits?.length) return '';
    return renderAddBtn(
      () => {
        show({
          form: 'arbeitszeit',
          vertrag,
          title: `Neue Arbeitszeit für Vertrag: ${vertrag.id}`
        });
      },
      `Neue Arbeitszeit für Vertrag: ${vertrag.id}`,
      'arbeitszeit'
    );
  };

  const renderAddPhaseBtn = (vertrag: TVertrag) => () => {
    if (vertrag?.vertrags_phases?.length) return '';
    return renderAddBtn(
      () => {
        show({
          form: 'phase',
          vertrag,
          title: `Neue Phase für Vertrag: ${vertrag.id}`
        });
      },
      `Neue Phase für Vertrag: ${vertrag.id}`,
      'phase'
    );
  };

  const renderAddVertragBtn = useCallback(() => {
    return renderAddBtn(
      () => {
        show({
          form: 'vertrag',
          title: `Neuer Vertrag für ${mitarbeiterName}`
        });
      },
      `Neuer Vertrag für ${mitarbeiterName}`,
      'vertrag'
    );
  }, [vertrags, user]);

  const headObjRows: HeadRow[] = [
    {
      columns: [
        {
          title: 'Vertragstyp',
          dataKey: 'vertragstyp.name'
        },
        {
          title: 'Anfang',
          dataKey: 'anfang',
          bodyRender: (row, column) => renderDate(row, column) || getGermandate(today())
        },
        {
          title: 'Ende',
          dataKey: 'ende',
          bodyRender: (row, column) => renderDate(row, column) || rentenEintrittDe
        },
        {
          title: 'Unbefristet',
          dataKey: 'unbefristet',
          sortKey: 'unbefristet',
          bodyRender: renderBoolean
        },
        {
          title: 'Kommentar',
          dataKey: 'kommentar'
        },
        {
          title: '',
          sortable: false,
          bodyRender: renderEditVertragBtn,
          headRender: renderAddVertragBtn
        }
      ]
    }
  ];

  const renderVertragsPhasen = useCallback(
    (row: TableData) => {
      const vertrag = row as TVertrag;
      const headRowsPhasen: HeadRow[] = [
        {
          columns: [
            ...headRowsPhasenDefault.columns,
            {
              title: '',
              sortable: false,
              bodyRender: renderEditPhaseBtn(vertrag),
              headRender: renderAddPhaseBtn(vertrag)
            },
            {
              title: '',
              sortable: false,
              bodyRender: renderAddBeforeAfterVertragsPhaseBtn(vertrag)
            }
          ]
        }
      ];

      const headRowsArbeitszeit: HeadRow[] = [
        {
          columns: [
            ...headRowsArbeitszeitDefault.columns,
            {
              title: '',
              sortable: false,
              bodyRender: renderEditVertragsArbeitszeitBtn(vertrag),
              headRender: renderAddVertragsArbeitszeitBtn(vertrag)
            },
            {
              title: '',
              sortable: false,
              bodyRender: renderAddBeforeAfterVertragsArbeitszeitBtn(vertrag)
            }
          ]
        }
      ];

      return (
        <div className={styles.vertrag_popup}>
          <Table
            data={deepClone(vertrag.vertrags_phases)}
            headRows={headRowsPhasen}
            options={{
              defaultSort: { 1: 'desc', 0: 'desc' },
              className: styles.max_full_width
            }}
          />
          <Table
            data={deepClone(vertrag.vertrags_arbeitszeits)}
            headRows={headRowsArbeitszeit}
            options={{
              defaultSort: { 1: 'desc', 0: 'desc' },
              className: styles.max_full_width
            }}
          />
        </div>
      );
    },
    [vertrags, user]
  );

  useEffect(() => {
    setTableData(
      vertrags.map((v) => ({
        ...v,
        addCustomRow: (row, column, indexRow, indexColumn) => {
          const newColumn: Column = { ...column, bodyRender: undefined };
          if (indexColumn === -1) {
            newColumn.bodyColspan = 6;
            newColumn.bodyRender = renderVertragsPhasen;
            newColumn.sortKey = newColumn.dataKey;
          } else {
            newColumn.getColumnStyle = () => ({ display: 'none' });
          }
          return newColumn;
        },
        className: styles.vertrag_row
      }))
    );
    return () => {
      setTableData([]);
    };
  }, [vertrags, user]);

  return (
    <>
      <div>
        <div className={styles.vertrag_infos_header}>
          <label>
            {'Geburtstag: '}
            <input
              style={{
                border: 'none',
                height: 'auto'
              }}
              type="date"
              value={mitarbeiterData?.accountInfo?.geburtsdatum || ''}
              readOnly
            />
          </label>
          <label>
            {'Rentendatum: '}
            <input
              style={{
                border: 'none',
                height: 'auto'
              }}
              type="date"
              value={mitarbeiterData?.accountInfo?.renten_eintritt || ''}
              readOnly
            />
          </label>
        </div>
        <h3>Verträge</h3>
        <Table data={tableData} headRows={headObjRows} options={vertragTableOptions} />
      </div>

      {showPopup ? (
        <VertragPopupWrapper>
          {formConfig?.form === 'vertrag' && <VertragForm />}
          {formConfig?.form === 'phase' && <PhaseForm />}
          {formConfig?.form === 'arbeitszeit' && <VertragArbeitszeitForm />}
        </VertragPopupWrapper>
      ) : null}
    </>
  );
}
export default Vertrag;
