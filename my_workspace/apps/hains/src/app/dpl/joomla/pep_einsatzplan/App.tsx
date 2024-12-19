import React, { useCallback, useEffect, useState } from 'react';
import { CellHook } from 'jspdf-autotable';
import { MdToggleOff, MdToggleOn, MdZoomIn, MdZoomOut } from 'react-icons/md';
import { Reason, User } from '../helper/ts_types';
import styles from './app.module.css';
import { Column, HeadRow, TableData } from '../components/utils/table/types/table';
import { UseMounted } from '../hooks/use-mounted';
import { returnError } from '../helper/hains';
import SearchData, { defaultSearch } from '../components/utils/table/SearchData';
import Table, { TableOptions, tableZoom } from '../components/utils/table/Table';
import DateInput, { GetData } from '../components/utils/date-input/DateInput';
import { getFontColorByWhite, getNestedAttr, hexToRgb, numericLocaleCompare } from '../helper/util';
import TablePdfButton from '../components/utils/custom-button/TablePdfButton';
import CustomButton from '../components/utils/custom-button/CustomButton';
import TableCsvButton from '../components/utils/custom-button/TableCsvButton';
import HistoryPopup from './HistoryPopup';
import { Funktion, History, Team, PlanerDate } from './types';
import { DBGetterGroupedRequest } from '../helper/api_helper';
import { isObject } from '../helper/types';
import Filter from './Filter';
import Einteilung, { renderName } from './Einteilung';
import { PepProvider } from '../context/pep/PepProvider';

const defaultHeadRows: HeadRow[] = [
  {
    columns: [
      {
        title: 'Mitarbeiter',
        dataKey: 'pep_name',
        getColumnClass: () => styles.mitarbeiter,
        bodyRender: (row: TableData) => (
          <p title={`Name: ${getNestedAttr(row, 'name')}\nPlanname: ${getNestedAttr(row, 'planname')}`}>
            {renderName(row)}
          </p>
        )
      }
    ]
  }
];

const defaultOptions: TableOptions = {
  fixColumns: [0],
  className: styles.table,
  containerStyle: { maxHeight: '95vh' },
  body: {
    fontSize: '1rem',
    paging: 50
  },
  head: {
    fontSize: '1rem'
  }
};

const getAsArray = (arr: any) => {
  if (Array.isArray(arr)) return arr;
  if (isObject(arr)) return Object.values(arr);
  return [];
};

function App({ user, hainsOAuth }: { user: User; hainsOAuth: any }) {
  const [data, setData] = useState<TableData[]>([]);
  const [currentData, setCurrentData] = useState<TableData[]>([]);
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [funktionenIds, setFunktionenIds] = useState<number[]>([]);
  const [teamIds, setTeamIds] = useState<number[]>([]);
  const [funktionen, setFunktionen] = useState<Funktion[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [headRows, setHeadRows] = useState<HeadRow[]>(defaultHeadRows);
  const [options, setOptions] = useState<TableOptions>(defaultOptions);
  const [aktiv, setAktiv] = useState<boolean>(true);
  const [history, setHistory] = useState<History[]>([]);
  const [getDienstfrei, setGetDienstfrei] = useState<boolean>(false);
  const [historyLabel, setHistoryLabel] = useState<string>('');
  const [showKontextColors, setShowKontextColors] = useState<boolean>(false);
  const [showPepName, setShowPepName] = useState<boolean>(true);
  const mounted = UseMounted();

  const renderEinteilung = (tag: PlanerDate, row: TableData, column: Column) => (
    <Einteilung row={row} column={column} tag={tag} />
  );

  const getData: GetData = (dates, finishLoading) => {
    setData(() => []);
    const params: {
      von: string;
      bis: string;
      funktionenIds: number[];
      teamIds: number[];
      dienstfrei?: boolean;
    } = { ...dates, funktionenIds, teamIds };
    if (getDienstfrei) params.dienstfrei = true;
    hainsOAuth.api('pep_einsatzplan', 'post', params).then(
      (_data: any) => {
        if (mounted) {
          const newData: TableData[] = Array.isArray(_data?.data) ? _data.data : [];
          const newHeadRows: HeadRow[] = [
            {
              columns: [...defaultHeadRows[0].columns]
            }
          ];
          _data?.tage?.forEach?.((tag: PlanerDate) => {
            let className = '';
            if (typeof tag.feiertag === 'object') className = styles.feiertag;
            else if (tag.is_weekend) className = styles.weekend;
            const feiertagname = typeof tag.feiertag === 'object' ? tag.feiertag.name : tag.feiertag;

            newHeadRows[0].columns.push({
              id: tag.id,
              title: tag.label,
              hoverTitle: `${tag.label} ${tag.year}\n${feiertagname}`,
              dataKey: `einteilungen.${tag.id}.@.dienst`,
              sortable: false,
              getColumnClass: () => `${styles.tag} ${className}`,
              bodyRender: (row, column) => renderEinteilung(tag, row, column)
            });
          });
          setData(() => newData);
          setCurrentData(() => newData);
          setHeadRows(() => newHeadRows);
        }
        finishLoading();
      },
      (err: Reason) => {
        finishLoading();
        returnError(err);
      }
    );
  };

  const search = useCallback(
    (searchValue: string, _data: TableData[]) => {
      if (!mounted) return;
      defaultSearch(searchValue, _data, headRows, (newData: TableData[]) => {
        mounted && setCurrentData(() => newData);
      });
    },
    [headRows, mounted, setCurrentData]
  );

  const didParseCell: CellHook = (_data) => {
    const lastHeadIndex = headRows.length - 1;
    const cell = _data.cell;
    const row = _data.row;
    const column = _data.column;
    let dataTableHeadCell = headRows?.[lastHeadIndex]?.columns?.[column.index];
    if (!dataTableHeadCell) return;
    if (_data.section === 'head') {
      dataTableHeadCell = headRows?.[row.index]?.columns?.[column.index];
      cell.styles.fillColor = '#dedede';
      cell.styles.textColor = '#000000';
    }
    if (!dataTableHeadCell) return;
    const classList = dataTableHeadCell?.getColumnClass?.(data[0], dataTableHeadCell, 0) || '';
    if (classList.includes(styles.feiertag)) {
      cell.styles.fillColor = '#e9cdff';
    } else if (classList.includes(styles.weekend)) {
      cell.styles.fillColor = '#d4d4d4';
    }
  };

  const didDrawCell: CellHook = (_data) => {
    if (_data.section !== 'body') return;
    const lastHeadIndex = headRows.length - 1;
    const row = filteredData[_data.row.index];
    const column = headRows?.[lastHeadIndex]?.columns?.[_data.column.index];
    if (!row || !column) return;
    const cell = _data.cell;
    const doc = _data.doc;
    const padding = Number(cell.styles.cellPadding);
    if (Number.isNaN(padding)) return;
    const einteilungen = getNestedAttr(row, `einteilungen.${column.id}`) || [];
    const text = _data.cell.text;
    if (!einteilungen.length) return;
    const l = text.length;
    const height = (cell.contentHeight - 2 * padding) / l;
    const width = cell.width - 4;
    const x = cell.x + 2;
    const y = cell.y;
    einteilungen.forEach((e: any, i: number) => {
      const txt = text[i];
      if (!txt) return;
      let color_key = 'po_dienst.pep_color';
      if (showKontextColors) color_key = 'einteilungskontext.color';
      else if (!showPepName) color_key = 'po_dienst.color';
      const color = getNestedAttr(e, color_key) || '';
      if (!color) return;
      const bgColor = hexToRgb(color, 255);
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      const { color: calColor } = getFontColorByWhite(color);
      if (calColor) {
        const textColor = hexToRgb(calColor, 0);
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      }
      const rectY = y + padding + i * height;
      doc.rect(x, rectY, width, height - 2, 'F');
      doc.text(txt, x + padding, rectY, { baseline: 'top' });
    });
  };

  const zoom = (diff: number) => {
    setOptions((current) => tableZoom(current, diff));
  };

  useEffect(() => {
    setFilteredData(() => currentData.filter((d) => getNestedAttr(d, 'aktiv') === aktiv));
    return () => {
      setFilteredData(() => []);
    };
  }, [aktiv, currentData]);

  useEffect(() => {
    if (user && hainsOAuth) {
      DBGetterGroupedRequest(hainsOAuth, ['funktionen', 'teams'], (res) => {
        if (mounted) {
          const _funktionen = (getAsArray(res?.funktionen?.data) as Funktion[]).sort((a, b) => a.prio - b.prio);
          const _teams = (getAsArray(res?.teams?.data) as Team[]).sort((a, b) => numericLocaleCompare(a.name, b.name));
          setFunktionen(() => _funktionen);
          setTeams(() => _teams);
          setFunktionenIds(() => _funktionen.map((f) => f.id));
          setTeamIds(() => _teams.map((t) => t.id));
        }
      });
    }
    return () => {
      setFunktionen(() => []);
      setTeams(() => []);
      setFunktionenIds(() => []);
      setTeamIds(() => []);
    };
  }, [user, hainsOAuth]);

  const bodyCallBack = (row: TableData, column: Column, seperator = ',') => {
    if (column.title === 'Mitarbeiter') return renderName(row);
    const einteilungen = getNestedAttr(row, `einteilungen.${column.id}`) || [];
    if (!Array.isArray(einteilungen)) return '';
    // Im Ausdruck auch das Sternchen anzeigen
    return einteilungen.map((e: any) => getNestedAttr(e, 'po_dienst.pep_name') || '').join(seperator);
  };

  return (
    <div>
      {user ? (
        <div className={styles.page}>
          <div>
            <Filter filterArr={funktionen} setIds={setFunktionenIds} label="Funktionen" ids={funktionenIds} />
            <Filter filterArr={teams} setIds={setTeamIds} label="Teams" ids={teamIds} />
          </div>
          <div className={styles.options}>
            <SearchData search={search} data={data} />
            <DateInput getData={getData} interval diffDays={65} />
            <TablePdfButton
              data={filteredData}
              filename="PEP Einsatzplan"
              headRows={headRows}
              didParseCell={didParseCell}
              didDrawCell={didDrawCell}
              bodyCallBack={(row, column) => bodyCallBack(row, column, '\n')}
            />
            <TableCsvButton
              data={filteredData}
              filename="PEP Einsatzplan"
              headRows={headRows}
              bodyCallBack={(row, column) => bodyCallBack(row, column, ', ')}
            />
            <CustomButton clickHandler={() => zoom(0.1)}>
              <MdZoomIn />
            </CustomButton>
            <CustomButton clickHandler={() => zoom(-0.1)}>
              <MdZoomOut />
            </CustomButton>
            <CustomButton
              title={aktiv ? 'Aktive Mitarbeiter' : 'Inaktive Mitarbeiter'}
              clickHandler={() => setAktiv((current) => !current)}
              className={aktiv ? 'green' : 'red'}
            >
              {aktiv ? <MdToggleOff /> : <MdToggleOn />}
            </CustomButton>
            <CustomButton
              title={showKontextColors ? 'Nutze Farben der Kontexte' : 'Nutze Farben der Dienste'}
              clickHandler={() => setShowKontextColors((current) => !current)}
              className={showKontextColors ? 'primary' : ''}
            >
              {showKontextColors ? <MdToggleOff /> : <MdToggleOn />}
            </CustomButton>
            <CustomButton
              title={showPepName ? 'Nutze den PEP-Namen' : 'Nutze den Plannamen des Dienstes'}
              clickHandler={() => setShowPepName((current) => !current)}
              className={showPepName ? 'primary' : ''}
            >
              {showPepName ? <MdToggleOff /> : <MdToggleOn />}
            </CustomButton>
            <label title="Sollen die Dienstfrei als Folge von bestimmten Diensten berechnet werden?">
              <input type="checkbox" onChange={(evt) => setGetDienstfrei(() => evt.target.checked)} />
              Dienstfrei
            </label>
          </div>
          <PepProvider
            showKontextColors={showKontextColors}
            setHistory={setHistory}
            setHistoryLabel={setHistoryLabel}
            showPepName={showPepName}
          >
            <Table data={filteredData} headRows={headRows} options={options} />
          </PepProvider>
          <HistoryPopup
            history={history}
            label={historyLabel}
            closeHistory={() => {
              setHistory(() => []);
            }}
          />
        </div>
      ) : (
        <p>Bitte einloggen!</p>
      )}
    </div>
  );
}

export default App;
