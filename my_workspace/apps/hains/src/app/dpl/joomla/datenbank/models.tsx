import React, { ReactElement } from 'react';
import { FaEdit } from 'react-icons/fa';
import { Column, TableData } from '../components/utils/table/types/table';
import {
  cleanInactiveName,
  getNestedAttr,
  numericLocaleCompare
} from '../helper/util';
import ColorBlock from '../components/datenbank/columns/ColorBlock';
import Check from '../components/datenbank/columns/Check';
import ThemenProStandort from '../components/datenbank/columns/ThemenProStandort';
import Arbeitszeitverteilung from '../components/datenbank/columns/Arbeitszeitverteilung';
import ContentFromArray from '../components/datenbank/columns/ContentFromArray';
import TeamKV from '../components/datenbank/columns/TeamVk';
import Abwesentheitenueberblick from '../components/datenbank/forms/Abwesenheitenueberblick';
import Arbeitsplaetze from '../components/datenbank/forms/Arbeitsplaetze';
import Arbeitszeittypen from '../components/datenbank/forms/Arbeitszeittypen';
import Arbeitszeitverteilungen from '../components/datenbank/forms/Arbeitszeitverteilungen';
import Dienstbedarfe from '../components/datenbank/forms/Dienstbedarfe';
import Dienste from '../components/datenbank/forms/Dienste';
import Dienstgruppen from '../components/datenbank/forms/Dienstgruppen';
import Dienstkategorien from '../components/datenbank/forms/Dienstkategorien';
import Dienstplaner from '../components/datenbank/forms/Dienstplaner';
import Freigabetypen from '../components/datenbank/forms/Freigabtypen';
import Funktionen from '../components/datenbank/forms/Funktionen';
import Kalendermarkierungen from '../components/datenbank/forms/Kalendermarkierungen';
import Kontingente from '../components/datenbank/forms/Kontingente';
import Kostenstellen from '../components/datenbank/forms/Kostenstellen';
import Stundennachweisstatuse from '../components/datenbank/forms/Stundennachweisstatuse';
import TagesverteilerUntergruppen from '../components/datenbank/forms/TagesverteilerUntergruppen';
import TagesverteilerGruppen from '../components/datenbank/forms/TagesverteilerGruppen';
import Teams from '../components/datenbank/forms/Teams';
import Themen from '../components/datenbank/forms/Themen';
import Vertragstypen from '../components/datenbank/forms/Vertragstypen';
import WochenverteilerUntergruppen from '../components/datenbank/forms/WochenverteilerUntergruppen';
import Zeitraumkategorien from '../components/datenbank/forms/Zeitraumkategorien';
import Bereiche from '../components/datenbank/forms/Bereiche';
import Merkmal from '../components/datenbank/forms/Merkmal';
import MerkmalOption from '../components/datenbank/forms/MerkmalOption';

import styles from './app.module.css';
import BedarfPreview from '../components/datenbank/columns/BedarfPreview';
import {
  Bedarf,
  BedarfPreviewData,
  Schichten
} from '../components/utils/table/types/datenbank';
import Abwesenheitenspalten from '../components/datenbank/forms/Abwesenheitenspalten';
import Dienstplanpaths from '../components/datenbank/forms/Dienstplanpaths';
import PlanTabs from '../components/datenbank/forms/PlanTabs';
import Merkmale from '../components/datenbank/forms/Merkmale';
import { checkmark } from '../../src/tools/htmlentities';
import Einteilungskontexte from '../components/datenbank/forms/Einteilungskontexte';
import Einteilungsstatuse from '../components/datenbank/forms/Einteilungsstatuse';
import { getGermandate } from '../helper/dates';

const mitarbeiterDetailsLinkBase = `${window.location.origin}/dpl/mitarbeiterinfo/?view=detail&id=`;
const vertragLink = `${window.location.origin}/dpl/mitarbeiterinfo/?view=vertrag&id=`;
// const vertragstypenLink = `${window.location.origin}/hains/dienstplaner/index.php?option=com_dienstplaner&view=vertragstypedit&id=`;

export const getter_routes = {
  bereiche: 'getbereicheslist',
  standorte: 'getstandortlist',
  dienste: 'getdienstelist',
  diensteOhneFreiEintragbar: 'getdienstelist_ohne_frei_eintragbar',
  dienstgruppen: 'getdienstgruppelist',
  dienstverteilungstypen: 'getdienstverteilungslist',
  arbeitszeitverteilung: 'getarbeitszeitverteilungslist',
  zeitraumkategorien: 'getzeitraumkategorielist',
  teams: 'getteamslist',
  kostenstellen: 'getkostenstellenlist',
  arbeitszeittypen: 'getarbeitszeittypslist',
  zeitraumregeln: 'getzeitraumregelslist',
  freigabetypen: 'getfreigabetypslist',
  funktionen: 'getfunktionslist',
  themen: 'getthemalist',
  vertragstypen: 'getvertragstypenlist',
  contentLayoutOptions: 'getcontentlayoutlist',
  tagesverteilerHeadlines: 'gettagesverteilerheadlinelist',
  verteilerVorlagen: 'getverteilervorlagenlist',
  mitarbeiter: 'getmitarbeiterlist_no_platzhalter',
  vertragsphasen: 'getvertragsphaseslist_all_by_mitarbeiter',
  dienstplanpaths: 'getdienstplanpathlist',
  plantabs: 'getplantabslist',
  planintervals: 'getplanintervallist',
  intervalpatterns: 'getintervalpatternlist',
  merkmal: 'getmerkmallist',
  merkmaloption: 'getmerkmaloptionlist',
  merkmalopt: 'getmerkmaloptlist'
};

export type DBModel = {
  label: string;
  routeBase: string;
  description: string;
  columns: Column[];
  fixColumns: number[];
  showLoeschen: boolean;
  showSpeichern: boolean;
  showreset: boolean;
  createData: boolean;
  previewRoute: string;
  fixPreviewColumns: number[];
  formatPreview?: (res: any) => { data: TableData[]; columns: Column[] };
  getForm?: (row: TableData | null, formSelectOptions: any) => ReactElement;
  formSelectOptions?: (keyof typeof getter_routes)[];
  selectVKDay?: (res: any, data: TableData[]) => TableData[];
  selectZeitraumkategorieVorschau?: boolean;
  selectDienstbedarfeVorschau?: boolean;
  replaceEdit?: (row: TableData, column: Column) => ReactElement | string;
};

const defaultModelOptions = {
  fixColumns: [1],
  showLoeschen: true,
  showSpeichern: true,
  showreset: true,
  createData: true,
  previewRoute: '',
  fixPreviewColumns: [0]
};

const renderEditVertragLink = (row: TableData, column: Column) => (
  <a
    target="_blank"
    href={`${vertragLink}${getNestedAttr(row, 'mitarbeiter_id')}`}
    aria-label="Vertrag bearbeiten"
    title="Mitarbeiter Verträge und Absprachen öffnen"
    rel="noreferrer"
  >
    <FaEdit />
  </a>
);

const renderMitarbeiterLink = (row: TableData, column: Column) => {
  const name =
    cleanInactiveName(getNestedAttr(row, column?.dataKey || '')) ||
    getNestedAttr(row, 'mitarbeiter.name') ||
    '_';
  const mitarbeiterId =
    getNestedAttr(row, 'mitarbeiter_id')?.toString?.() || '';
  return mitarbeiterId ? (
    <a
      target="_blank"
      href={`${mitarbeiterDetailsLinkBase}${mitarbeiterId}`}
      title={`Mitarbeiter Details öffnen für ${name}`}
      rel="noreferrer"
    >
      {name}
    </a>
  ) : (
    name
  );
};

export const renderColor = (row: TableData, column: Column) => (
  <ColorBlock color={getNestedAttr(row, column?.dataKey || '')} />
);

export const renderBoolean = (row: TableData, column: Column) => (
  <Check checked={!!getNestedAttr(row, column?.dataKey || '')} />
);

const renderStandortThemen = (row: TableData, column: Column) => (
  <ThemenProStandort
    standorteThemen={getNestedAttr(row, column?.dataKey || '')}
  />
);

export const renderDate = (row: TableData, column: Column) => {
  const date = getNestedAttr(row, column?.dataKey || '');
  return date ? getGermandate(date) : '';
};

const renderArbeitszeitverteilung = (row: TableData, column: Column) => (
  <Arbeitszeitverteilung row={row} />
);

const renderFromArray =
  (
    key: string,
    titleKey?: string,
    callback?: (el: any, index: number) => string | React.JSX.Element,
    sort?: (a: any, b: any) => number
  ) =>
  (row: TableData, column: Column) => (
    <ContentFromArray
      elKey={key}
      titleKey={titleKey || ''}
      arr={getNestedAttr(row, column?.dataKey || '')}
      callback={callback}
      sort={sort}
    />
  );

const renderFromArrayJoin = (
  el: any,
  arr: {
    label: string;
    key: string;
    date?: boolean;
  }[]
) =>
  arr
    .reduce((acc: string[], { label, key, date = false }) => {
      const value = getNestedAttr(el, key);
      if (value) {
        const str = date ? getGermandate(value) : value;
        acc.push(label ? `${label}: ${str}` : `${str}`);
      }
      return acc;
    }, [])
    .join(', ');

const renderTeamVK = (row: TableData, column: Column) => (
  <TeamKV team_vk={getNestedAttr(row, column?.dataKey || '')} />
);

const renderBedarfPreview = (row: TableData, column: Column) => (
  <BedarfPreview row={row} column={column} />
);

const options: DBModel[] = [
  {
    ...defaultModelOptions,
    label: 'Absprachen (Arbeitszeit)',
    routeBase: 'arbeitszeitabsprachen',
    description: 'Absprachen bzgl. der Arbeitszeit',
    replaceEdit: renderEditVertragLink,
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Mitarbeiter',
        dataKey: 'mitarbeiter.planname',
        bodyRender: renderMitarbeiterLink
      },
      {
        title: 'Bemerkung',
        dataKey: 'bemerkung'
      },
      { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
      { title: 'Von', dataKey: 'anfang', bodyRender: renderDate },
      { title: 'Bis', dataKey: 'ende', bodyRender: renderDate },
      { title: 'Arbeitszeit (Anfang)', dataKey: 'arbeitszeit_von_time' },
      { title: 'Arbeitszeit (Ende)', dataKey: 'arbeitszeit_bis_time' },
      { title: 'Pause (Minuten)', dataKey: 'pause' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Absprachen (nicht einteilen)',
    routeBase: 'nichteinteilenabsprachen',
    description:
      'Absprachen bzgl. Einteilungen in Standorte, die nicht erwünscht sind',
    replaceEdit: renderEditVertragLink,
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Mitarbeiter',
        dataKey: 'mitarbeiter.planname',
        bodyRender: renderMitarbeiterLink
      },
      { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
      { title: 'Von', dataKey: 'anfang', bodyRender: renderDate },
      { title: 'Bis', dataKey: 'ende', bodyRender: renderDate },
      {
        title: 'Nicht einteilen (Standorte und Themen)',
        dataKey: 'nicht_einteilen_standort_themens',
        bodyRender: renderStandortThemen,
        getColumnClass: () => styles.break_white_space
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Abwesentheitenspalten',
    routeBase: 'abwesentheitenspalten',
    description: 'Verwaltung der Abwesentheiten Spaltennamen',
    showLoeschen: false,
    createData: false,
    getForm: (row) => <Abwesenheitenspalten row={row} />,
    columns: [
      { title: 'Id', dataKey: 'id' },
      { title: 'Planname', dataKey: 'planname' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Beschreibung', dataKey: 'beschreibung' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Abwesentheitenueberblick',
    routeBase: 'abwesentheitenueberblick',
    description: 'Verwaltung der Abwesentheiten',
    formSelectOptions: ['mitarbeiter'],
    getForm: (row, formSelectOptions) => (
      <Abwesentheitenueberblick
        row={row}
        formSelectOptions={formSelectOptions}
      />
    ),
    columns: [
      { title: 'Id', dataKey: 'id' },
      {
        title: 'Mitarbeiter',
        dataKey: 'mitarbeiter.planname',
        bodyRender: renderMitarbeiterLink
      },
      { title: 'Jahr', dataKey: 'jahr' },
      { title: 'Gesamt', dataKey: 'ug' },
      { title: 'Verbleiben', dataKey: 'uv' },
      { title: 'Sonderurlaub', dataKey: 'uz' },
      { title: 'Urlaub', dataKey: 'u' },
      { title: 'Resturlaub', dataKey: 'ru' },
      { title: 'Genommen', dataKey: 'gu' },
      { title: 'Teilzeiturlaub', dataKey: 'tzu' },
      { title: 'Fortbildungen Max.', dataKey: 'fo_max' },
      { title: 'Fortbildungen', dataKey: 'fo' },
      { title: 'Dienstreise', dataKey: 'dr' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Arbeitsplätze',
    routeBase: 'arbeitsplaetze',
    description: 'Arbeitsplätze/Säle etc.',
    getForm: (row, formSelectOptions) => (
      <Arbeitsplaetze row={row} formSelectOptions={formSelectOptions} />
    ),
    formSelectOptions: ['bereiche', 'standorte'],
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Bereich', dataKey: 'bereich.name' },
      { title: 'Standort', dataKey: 'standort.name' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Arbeitszeittypen',
    routeBase: 'arbeitszeittyps',
    description:
      'Arbeitszeittypen enthält die möglichen Typen von Arbeitszeiten',
    getForm: (row) => <Arbeitszeittypen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Sys', dataKey: 'sys', bodyRender: renderBoolean },
      { title: 'Dienstzeit', dataKey: 'dienstzeit', bodyRender: renderBoolean },
      {
        title: 'Arbeitszeit',
        dataKey: 'arbeitszeit',
        bodyRender: renderBoolean
      },
      { title: 'Zählen', dataKey: 'count', bodyRender: renderBoolean },
      { title: 'Max', dataKey: 'max' },
      { title: 'Min', dataKey: 'min' },
      {
        title: 'Bereitschaft',
        dataKey: 'bereitschaft',
        bodyRender: renderBoolean
      },
      {
        title: 'Rufbereitschaft',
        dataKey: 'rufbereitschaft',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Arbeitszeitverteilung',
    routeBase: 'arbeitszeitverteilungs',
    description:
      'Verteilung von Arbeitszeiten, welche Bedarfen zugeordnet werden',
    formSelectOptions: ['dienstgruppen', 'arbeitszeittypen'],
    getForm: (row, formSelectOptions) => (
      <Arbeitszeitverteilungen
        row={row}
        formSelectOptions={formSelectOptions}
      />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Dauer in Tagen', dataKey: 'dauer' },
      {
        title: 'Arbeitszeit',
        dataKey: 'verteilung',
        bodyRender: renderArbeitszeitverteilung
      },
      { title: 'Dienstgruppe vorher Zeit (Std.)', dataKey: 'pre_std' },
      {
        title: 'Dienstgruppe vorher',
        dataKey: 'pre_dienstgruppe.name'
      },
      {
        title: 'Überschneidung vorher Zeit (Minuten)',
        dataKey: 'pre_ueberschneidung_minuten'
      },
      { title: 'Dienstgruppe', dataKey: 'dienstgruppe.name' },
      { title: 'Dienstgruppe Zeit (Std.)', dataKey: 'std' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Automatische Einteilungen',
    routeBase: 'automatischeeinteilungen',
    description:
      'Regeln für Einteilungen, die automatisiert vorgenommen werden könne',
    replaceEdit: renderEditVertragLink,
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Mitarbeiter',
        dataKey: 'mitarbeiter.planname',
        bodyRender: renderMitarbeiterLink
      },
      { title: 'Dienst', dataKey: 'po_dienst.planname' },
      { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
      { title: 'Von', dataKey: 'anfang', bodyRender: renderDate },
      { title: 'Bis', dataKey: 'ende', bodyRender: renderDate },
      { title: 'Tage', dataKey: 'days' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Bereiche',
    routeBase: 'bereiche',
    description: 'Standort Bereiche',
    formSelectOptions: ['standorte', 'bereiche'],
    getForm: (row, formSelectOptions) => (
      <Bereiche row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Planname', dataKey: 'planname' },
      { title: 'Url-Name', dataKey: 'name_url' },
      { title: 'Info', dataKey: 'info' },
      { title: 'Standort', dataKey: 'standort.name' },
      { title: 'Überg. Bereich', dataKey: 'bereich.name' },
      {
        title: 'Verteiler Dienstfrei',
        dataKey: 'verteiler_frei',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Dienstbedarf',
    routeBase: 'dienstbedarf',
    previewRoute: 'bedarfs_preview',
    formatPreview: (res) => {
      const result: {
        data: TableData[];
        columns: Column[];
      } = {
        data: [],
        columns: [
          {
            title: 'Dienst',
            dataKey: 'planname'
          }
        ]
      };
      if (!res) return result;

      const dienste = res?.dienste;
      const bedarfe = res?.bedarf;
      const bereiche = res?.bereiche;
      const arbeitszeitverteilungen = res?.arbeitszeitverteilungen;
      const zeitverteilungen = res?.zeitverteilungen;

      const diensteData: {
        [key: string]: BedarfPreviewData;
      } = {};
      if (typeof res?.dates === 'object') {
        for (const dataKey in res.dates) {
          const el: any = res.dates[dataKey];
          const label: string = el?.label?.toString?.() || '';
          const feiertag =
            getNestedAttr(el, 'feiertag.name')?.toString?.() || '';
          const feiertagClass = feiertag ? styles.feiertag : '';
          result.columns.push({
            title: label,
            dataKey,
            hoverTitle: feiertag,
            sortable: false,
            getColumnClass: () => feiertagClass,
            headRender: () => (
              <div>
                {label.split(' ').map((str: string) => (
                  <p key={str}>{str}</p>
                ))}
              </div>
            ),
            bodyRender: renderBedarfPreview
          });
          if (typeof dienste !== 'object' && el?.by_dienst) continue;
          for (const dienstId in dienste) {
            const dienst = dienste?.[dienstId];
            const by_dienst = el?.by_dienst?.[dienstId];
            if (typeof by_dienst !== 'object') continue;
            if (!diensteData[dienstId]) {
              diensteData[dienstId] = {
                id: dienstId,
                planname: dienst?.planname || '',
                bedarfe: {
                  [dataKey]: []
                }
              };
            } else {
              diensteData[dienstId].bedarfe[dataKey] = [];
            }
            for (const bereichId in by_dienst) {
              const bedarf = bedarfe[by_dienst?.[bereichId]?.bedarf_id];
              if (typeof bedarf !== 'object') continue;
              const avId = bedarf?.arbeitszeitverteilung_id || 0;
              const arbeitszeitverteilung = arbeitszeitverteilungen[avId];
              const arbeitszeit = zeitverteilungen[avId];
              const datesBedarf: Bedarf = {
                id: parseInt(bedarf?.id || 0, 10),
                min: parseInt(bedarf?.min || 0, 10),
                opt: parseInt(bedarf?.opt || 0, 10),
                arbeitszeitverteilung: {
                  name: arbeitszeitverteilung?.name?.toString?.() || '',
                  arbeitszeit: {
                    freizeiten: (arbeitszeit?.freizeiten as Schichten) || {},
                    schichten: (arbeitszeit?.schichten as Schichten) || {}
                  }
                },
                bereich: {
                  name: bereiche?.[bereichId]?.name?.toString?.() || ''
                }
              };

              diensteData[dienstId].bedarfe[dataKey].push(datesBedarf);
            }
          }
        }
      }
      result.data = Object.values(diensteData);

      return result;
    },
    description:
      'Bedarfe für Dienste, welchen Arbeitszeitverteilungen und Zeitraumkategorien zugeordnet werden',
    fixColumns: [0, 1],
    formSelectOptions: [
      'dienste',
      'kostenstellen',
      'bereiche',
      'dienstverteilungstypen',
      'zeitraumkategorien',
      'arbeitszeitverteilung'
    ],
    getForm: (row, formSelectOptions) => (
      <Dienstbedarfe row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Dienst', dataKey: 'po_dienst.name' },
      { title: 'Kostenstelle', dataKey: 'kostenstelle.name' },
      { title: 'Bereich', dataKey: 'bereich.name' },
      { title: 'Mindestbedarf', dataKey: 'min' },
      { title: 'optionaler Zusatzbedarf', dataKey: 'opt' },
      { title: 'Ungültig ab', dataKey: 'end_date', bodyRender: renderDate },
      { title: 'Dienstverteilungstyp', dataKey: 'dienstverteilungstyp.name' },
      { title: 'Verteilungscode', dataKey: 'verteilungscode' },
      { title: 'Arbeitszeitverteilung', dataKey: 'arbeitszeitverteilung.name' },
      { title: 'Zeitraumkategorie', dataKey: 'zeitraumkategorie.name' },
      {
        title: 'In Urlaubssaldo ignorieren',
        dataKey: 'ignore_in_urlaubssaldo',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Dienste',
    routeBase: 'dienste',
    description: 'Dienste, in die Mitarbeiter eingeteilt werden',
    formSelectOptions: ['teams', 'kostenstellen', 'freigabetypen', 'themen'],
    getForm: (row, formSelectOptions) => (
      <Dienste row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Planname', dataKey: 'planname' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Aneasy Name', dataKey: 'aneasy_name' },
      { title: 'PEP Name', dataKey: 'pep_name' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Team', dataKey: 'team.name' },
      { title: 'Kostenstelle', dataKey: 'kostenstelle.name' },
      {
        title: 'Frei eintragbar',
        dataKey: 'frei_eintragbar',
        bodyRender: renderBoolean
      },
      {
        title: 'Für alle Teams',
        dataKey: 'dpl_all_teams',
        bodyRender: renderBoolean
      },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor },
      { title: 'PEP Farbe', dataKey: 'pep_color', bodyRender: renderColor },
      {
        title: 'Freigabetypen',
        dataKey: 'freigabetypenDetails',
        bodyRender: renderFromArray('name')
      },
      {
        title: 'Themen',
        dataKey: 'themaDetails',
        bodyRender: renderFromArray('name')
      },
      { title: 'Reihenfolge', dataKey: 'order' },
      {
        title: 'Priorisiere Wunsch',
        dataKey: 'priorisiere_wunsch',
        bodyRender: renderBoolean
      },
      {
        title: 'Stundennachweis Urlaub',
        dataKey: 'stundennachweis_urlaub',
        bodyRender: renderBoolean
      },
      {
        title: 'Stundennachweis Krank',
        dataKey: 'stundennachweis_krank',
        bodyRender: renderBoolean
      },
      {
        title: 'Stundennachweis Sonstiges',
        dataKey: 'stundennachweis_sonstig',
        bodyRender: renderBoolean
      },
      { title: 'Stundennachweis von', dataKey: 'stundennachweis_default_von' },
      { title: 'Stundennachweis bis', dataKey: 'stundennachweis_default_bis' },
      { title: 'Stundennachweis Std.', dataKey: 'stundennachweis_default_std' },
      {
        title: 'Tagesaldo nutzen',
        dataKey: 'use_tagessaldo',
        bodyRender: renderBoolean
      },
      { title: 'Preset', dataKey: 'preset', bodyRender: renderBoolean },
      { title: 'Sys', dataKey: 'sys', bodyRender: renderBoolean },
      {
        title: 'Vorhergehende Tage ignorieren',
        dataKey: 'ignore_before',
        bodyRender: renderBoolean
      },
      { title: 'Aufwand', dataKey: 'aufwand' },
      {
        title: 'Schwacher Konflikt (Mehrfacheinteilungen)',
        dataKey: 'weak_parallel_conflict',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Dienstgruppen',
    routeBase: 'dienstgruppe',
    description: 'Gruppierte Dienste',
    formSelectOptions: ['dienste'],
    getForm: (row, formSelectOptions) => (
      <Dienstgruppen row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      {
        title: 'Dienste',
        dataKey: 'diensteDetails',
        bodyRender: renderFromArray('planname', 'name')
      },
      { title: 'Label (Veröffentlichen)', dataKey: 'publish_label' },
      {
        title: 'Aktivieren (Veröffentlichen)',
        dataKey: 'use_in_publish',
        bodyRender: renderBoolean
      },
      { title: 'Priorität (Veröffentlichen)', dataKey: 'publish_prio' },
      {
        title: 'Farbe BG (Veröffentlichen)',
        dataKey: 'publish_color_bg',
        bodyRender: renderColor
      },
      {
        title: 'Farbe HL (Veröffentlichen)',
        dataKey: 'publish_color_hl',
        bodyRender: renderColor
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Dienstkategorien',
    routeBase: 'dienstkategorie',
    description: 'Kategorien von Diensten und Dienstwünschen',
    formSelectOptions: ['teams', 'themen'],
    getForm: (row, formSelectOptions) => (
      <Dienstkategorien row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Planname', dataKey: 'poppix_name' },
      { title: 'Name', dataKey: 'name' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      {
        title: 'Themen',
        dataKey: 'themaDetails',
        bodyRender: renderFromArray('name')
      },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor },
      { title: 'Auswählbar', dataKey: 'selectable', bodyRender: renderBoolean },
      { title: 'Reihenfolge', dataKey: 'order' },
      {
        title: 'Kalendermarkierung',
        dataKey: 'mark',
        bodyRender: renderBoolean
      },
      {
        title: 'Teams',
        dataKey: 'teamDetails',
        bodyRender: renderFromArray('name')
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Plan Pfade',
    routeBase: 'dienstplanpath',
    description: 'Pfade für Pläne',
    formSelectOptions: ['planintervals', 'plantabs', 'intervalpatterns'],
    getForm: (row, formSelectOptions) => (
      <Dienstplanpaths row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Pfad', dataKey: 'path' },
      { title: 'Gruppe', dataKey: 'plan_tab.name' },
      { title: 'Position', dataKey: 'position' },
      { title: 'Intervall', dataKey: 'planinterval.typ' },
      { title: 'Planmuster', dataKey: 'plan_pattern' },
      { title: 'Anzahl', dataKey: 'nr_intervall' },
      { title: 'Anzahl Versionen', dataKey: 'nr_versions' },
      { title: 'Offset', dataKey: 'offset_to_now' },
      {
        title: 'Beginnge Montags',
        dataKey: 'begin_on_monday',
        bodyRender: renderBoolean
      },
      {
        title: 'Kalender Titel',
        dataKey: 'kalender_name'
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Dienstplaner',
    routeBase: 'dienstplaner',
    description: 'Dienstplaner und ihre Teamzugehörigkeit',
    formSelectOptions: ['teams', 'verteilerVorlagen'],
    createData: false,
    showLoeschen: false,
    getForm: (row, formSelectOptions) => (
      <Dienstplaner row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Name',
        dataKey: 'name',
        bodyRender: renderMitarbeiterLink
      },
      {
        title: 'Team',
        dataKey: 'dienstplaners_teams',
        bodyRender: renderFromArray('name')
      },
      {
        title: 'Verteiler Vorlagen',
        dataKey: 'dienstplaners_verteiler_vorlagens',
        bodyRender: renderFromArray(
          'name',
          '',
          (el) => ` (${getNestedAttr(el, 'typ')})`
        )
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Einteilungskontext',
    routeBase: 'einteilungskontext',
    description: 'Einteilungskontexte',
    createData: false,
    showLoeschen: false,
    getForm: (row) => <Einteilungskontexte row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Name',
        dataKey: 'name'
      },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung'
      },
      {
        title: 'Farbe',
        dataKey: 'color',
        bodyRender: renderColor
      },
      {
        title: 'TV',
        dataKey: 'tagesverteiler',
        bodyRender: renderBoolean
      },
      {
        title: 'Default',
        dataKey: 'default',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Einteilungsstatus',
    routeBase: 'einteilungsstatus',
    description: 'Einteilungsstatuse',
    createData: false,
    showLoeschen: false,
    getForm: (row) => <Einteilungsstatuse row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Name',
        dataKey: 'name'
      },
      {
        title: 'Farbe',
        dataKey: 'color',
        bodyRender: renderColor
      },
      {
        title: 'Öffentlich',
        dataKey: 'public',
        bodyRender: renderBoolean
      },
      {
        title: 'Gültig',
        dataKey: 'counts',
        bodyRender: renderBoolean
      },
      {
        title: 'Vorschlag',
        dataKey: 'vorschlag',
        bodyRender: renderBoolean
      },
      {
        title: 'Wählbar',
        dataKey: 'waehlbar',
        bodyRender: renderBoolean
      },
      {
        title: 'System',
        dataKey: 'sys',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Freigabetypen',
    routeBase: 'freigabetyps',
    description: 'Freigabetypen',
    getForm: (row) => <Freigabetypen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Planname', dataKey: 'planname' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Reihenfolge', dataKey: 'sort' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Funktionen',
    routeBase: 'funktions',
    description: 'Mitarbeiter-Funktionen',
    formSelectOptions: ['teams'],
    getForm: (row, formSelectOptions) => (
      <Funktionen row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Planname', dataKey: 'planname' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Prio', dataKey: 'prio' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor },
      { title: 'Team', dataKey: 'team.name' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Kalendermarkierungen',
    routeBase: 'kalendermarkierung',
    description: 'Speziele Tage wie (Schulferien, Veranstaltungen)',
    getForm: (row) => <Kalendermarkierungen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Kategorie', dataKey: 'category' },
      { title: 'Jahr', dataKey: 'year' },
      { title: 'Von', dataKey: 'start', bodyRender: renderDate },
      { title: 'Bis', dataKey: 'ende', bodyRender: renderDate },
      { title: 'Priorität', dataKey: 'prio' },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Kontingente',
    routeBase: 'kontingente',
    description: 'Kontingente für die Rotationen der Mitarbeiter',
    showLoeschen: false,
    createData: false,
    formSelectOptions: ['teams', 'themen', 'dienste'],
    getForm: (row, formSelectOptions) => (
      <Kontingente row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Position', dataKey: 'position' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Kurzname', dataKey: 'kurzname' },
      {
        title: 'Kommentar',
        dataKey: 'kommentar',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Team', dataKey: 'team.name' },
      {
        title: 'Themen',
        dataKey: 'themaDetails',
        bodyRender: renderFromArray('name')
      },
      {
        title: 'Dienste',
        dataKey: 'kontingent_po_dienst',
        bodyRender: renderFromArray(
          '',
          '',
          (el) =>
            `${getNestedAttr(el, 'po_dienst.planname')} (${getNestedAttr(el, 'eingeteilt_count_factor')})${getNestedAttr(el, 'magic_einteilung') ? checkmark : ''}`
        )
      },
      { title: 'Default', dataKey: 'default', bodyRender: renderBoolean },
      {
        title: 'Sonderrotation',
        dataKey: 'sonderrotation',
        bodyRender: renderBoolean
      },
      {
        title: 'Alle Rotationen anzeigen',
        dataKey: 'show_all_rotations',
        bodyRender: renderBoolean
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Kostenstellen',
    routeBase: 'kostenstellen',
    description: 'Kostenstellen',
    showLoeschen: false,
    getForm: (row) => <Kostenstellen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Kostenstelle', dataKey: 'name' },
      { title: 'Nummer', dataKey: 'nummer' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Merkmal',
    routeBase: 'merkmal',
    description: 'Merkmale für einen Mitarbeiter',
    getForm: (row) => <Merkmal row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Beschreibung', dataKey: 'beschreibung' },
      { title: 'Editierbar', dataKey: 'can_edit' },
      { title: 'Typ', dataKey: 'typ' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Merkmaloption',
    routeBase: 'merkmaloption',
    description: 'Optionen für die Merkmale die einen typ selectbox haben',
    formSelectOptions: ['merkmalopt'],
    getForm: (row, formSelectOptions) => (
      <MerkmalOption row={row} formSelectOptions={formSelectOptions} />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Wert', dataKey: 'wert' },
      { title: 'Merkmal', dataKey: 'merkmal.name' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Plan Gruppen',
    routeBase: 'plantabs',
    description: 'Gruppen für Pläne',
    getForm: (row) => <PlanTabs row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Position', dataKey: 'position' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Stundennachweisstatuse',
    routeBase: 'stundennachweis_statuse',
    description: 'Statuse für Stundennachweise',
    showLoeschen: false,
    getForm: (row) => <Stundennachweisstatuse row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Bestätigt', dataKey: 'confirmed', bodyRender: renderBoolean },
      { title: 'Eingereicht', dataKey: 'submitted', bodyRender: renderBoolean }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Tagesverteiler-Gruppen',
    routeBase: 'tagesverteilerheadline',
    description: 'Überschriften im Tagesverteiler',
    getForm: (row) => <TagesverteilerGruppen row={row} />,
    columns: [
      { title: 'id', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Planname', dataKey: 'planname' },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Tagesverteiler-Untergruppen',
    routeBase: 'bereichtagesverteiler',
    description:
      'Zuordnung von Bereichen oder Diensten zu Tagesverteiler-Gruppen',
    formSelectOptions: [
      'tagesverteilerHeadlines',
      'bereiche',
      'dienste',
      'contentLayoutOptions'
    ],
    getForm: (row, formSelectOptions) => (
      <TagesverteilerUntergruppen
        row={row}
        formSelectOptions={formSelectOptions}
      />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Tagesverteiler Gruppe', dataKey: 'tagesverteiler.name' },
      {
        title: 'Farbe Gruppe',
        dataKey: 'tagesverteiler.color',
        bodyRender: renderColor
      },
      { title: 'Bereich', dataKey: 'bereich.name' },
      { title: 'dienst', dataKey: 'po_dienst.planname' },
      { title: 'Farbe Untergruppe', dataKey: 'color', bodyRender: renderColor },
      { title: 'Content-Layout', dataKey: 'content_layout' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Teams',
    routeBase: 'teams',
    description: 'Mitarbeiter Teams',
    formSelectOptions: ['kostenstellen', 'funktionen'],
    getForm: (row, formSelectOptions) => (
      <Teams row={row} formSelectOptions={formSelectOptions} />
    ),
    selectVKDay: (res: any, data: TableData[]) => {
      if (!Array.isArray(data)) return data;
      if (typeof res !== 'object') return data;
      return data.map((el) => {
        const team =
          typeof el === 'object' && getNestedAttr(res, `teams.${el.id}`);
        const team_vk =
          typeof team === 'object'
            ? {
                label: team.vk?.toString?.() || '??',
                title: team.mitarbeiter
              }
            : {
                label: '',
                title: []
              };
        return {
          ...el,
          team_vk
        };
      });
    },
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      { title: 'VK', dataKey: 'team_vk', bodyRender: renderTeamVK },
      { title: 'Kostenstelle', dataKey: 'kostenstelle.name' },
      {
        title: 'Funktionen',
        dataKey: 'funktionenDetails',
        bodyRender: renderFromArray('planname', 'name')
      },
      { title: 'Default', dataKey: 'default', bodyRender: renderBoolean },
      { title: 'Krank Puffer', dataKey: 'krank_puffer' },
      {
        title: 'KW Krank Puffer',
        dataKey: 'team_kw_krankpuffers',
        bodyRender: renderFromArray(
          '',
          '',
          (el) =>
            `KW ${getNestedAttr(el, 'kw')}: ${getNestedAttr(el, 'puffer')}`
        )
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Themen',
    routeBase: 'thema',
    description:
      'Themengebiete für die Dienste, Dienstkategorien und Kontingente',
    getForm: (row) => <Themen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Farbe', dataKey: 'color', bodyRender: renderColor }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Vertragstypen',
    routeBase: 'vertragstypen',
    description: 'Verschiedene Vertragswerke',
    showLoeschen: false,
    getForm: (row) => <Vertragstypen row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Vertragsname', dataKey: 'name' },
      {
        title: 'Gruppen',
        dataKey: 'vertragsgruppes',
        bodyRender: renderFromArray(
          '',
          '',
          (el) => {
            const stufen = getNestedAttr(el, 'vertragsstuves');
            if (Array.isArray(stufen) && stufen.length) {
              return (
                <>
                  {stufen.map((stufe) => (
                    <span key={stufe.id}>
                      {renderFromArrayJoin(stufe, [
                        { label: '', key: 'vertragsgruppe.name' },
                        { label: 'Stufe', key: 'stufe' },
                        { label: 'Gehalt/Monat', key: 'monatsgehalt' },
                        { label: 'Jahre', key: 'nach_jahren' },
                        {
                          label: 'Std./Woche',
                          key: 'vertrags_variante.wochenstunden'
                        },
                        {
                          label: 'Urlaubstage/Monat',
                          key: 'vertrags_variante.tage_monat'
                        },
                        {
                          label: 'Von',
                          key: 'vertrags_variante.von',
                          date: true
                        },
                        {
                          label: 'Bis',
                          key: 'vertrags_variante.bis',
                          date: true
                        }
                      ])}
                    </span>
                  ))}
                </>
              );
            }
            return `${getNestedAttr(el, 'name')}`;
          },
          (a, b) =>
            numericLocaleCompare(
              getNestedAttr(a, 'name'),
              getNestedAttr(b, 'name')
            )
        ),
        getColumnClass: () =>
          `${styles.break_white_space} ${styles.vertrags_phases}`
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Verträge',
    routeBase: 'vertrags',
    description: 'Verträge der Mitarbeiter',
    replaceEdit: renderEditVertragLink,
    selectVKDay: (res: any, data: TableData[]) => {
      if (!Array.isArray(data)) return data;
      if (typeof res !== 'object') return data;
      return data.map((el) => {
        const vertrag = getNestedAttr(res, `vertraege.${el.id}`);
        const team =
          typeof vertrag === 'object' &&
          getNestedAttr(res, `teams.${vertrag.team_id}`);
        const team_vk =
          typeof team === 'object'
            ? {
                label: `${team.name?.toString?.() || '??'}: ${team.vk?.toString?.() || '??'}`,
                title: team.mitarbeiter
              }
            : {
                label: '',
                title: []
              };
        return {
          ...el,
          team_vk
        };
      });
    },
    columns: [
      { title: 'ID', dataKey: 'id' },
      {
        title: 'Mitarbeiter',
        dataKey: 'mitarbeiter.planname',
        bodyRender: renderMitarbeiterLink
      },
      { title: 'Team-VK', dataKey: 'team_vk', bodyRender: renderTeamVK },
      { title: 'Typ', dataKey: 'vertragstyp.name' },
      { title: 'Anfang', dataKey: 'anfang', bodyRender: renderDate },
      { title: 'Ende', dataKey: 'ende', bodyRender: renderDate },
      {
        title: 'Unbefristet',
        dataKey: 'unbefristet',
        bodyRender: renderBoolean
      },
      {
        title: 'Kommentar',
        dataKey: 'kommentar',
        getColumnClass: () => styles.break_white_space
      },
      {
        title: 'Phasen',
        dataKey: 'vertrags_phases',
        bodyRender: renderFromArray('', '', (el) =>
          renderFromArrayJoin(el, [
            { label: '', key: 'vertragsgruppe.name' },
            { label: 'Stufe', key: 'vertragsstufe.stufe' },
            { label: 'Std./Woche', key: 'vertrags_variante.wochenstunden' },
            { label: 'Von', key: 'von', date: true },
            { label: 'Bis', key: 'bis', date: true }
          ])
        ),
        getColumnClass: () =>
          `${styles.break_white_space} ${styles.vertrags_phases}`
      },
      {
        title: 'Arbeitszeit',
        dataKey: 'vertrags_arbeitszeits',
        bodyRender: renderFromArray('', '', (el) =>
          renderFromArrayJoin(el, [
            { label: 'VK', key: 'vk' },
            { label: 'Tage/Woche', key: 'tage_woche' },
            { label: 'Von', key: 'von', date: true },
            { label: 'Bis', key: 'bis', date: true }
          ])
        ),
        getColumnClass: () => styles.vertrags_phases
      }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Wochenverteiler-Untergruppen',
    routeBase: 'bereichwochenverteiler',
    description: 'Zuordnung von Bereichen oder Diensten zum Wochenverteiler',
    fixColumns: [0],
    formSelectOptions: ['bereiche', 'dienste', 'contentLayoutOptions'],
    getForm: (row, formSelectOptions) => (
      <WochenverteilerUntergruppen
        row={row}
        formSelectOptions={formSelectOptions}
      />
    ),
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Farbe Gruppe', dataKey: 'color_hl', bodyRender: renderColor },
      { title: 'Bereich', dataKey: 'bereich.name' },
      { title: 'dienst', dataKey: 'po_dienst.planname' },
      {
        title: 'Farbe Untergruppe',
        dataKey: 'color_bg',
        bodyRender: renderColor
      },
      { title: 'Position', dataKey: 'order' },
      { title: 'Content-Layout', dataKey: 'content_layout' }
    ]
  },
  {
    ...defaultModelOptions,
    label: 'Zeitraumkategorien',
    routeBase: 'zeitraumkategorie',
    description: 'Regeln zur Zuordnung der Bedarfe zu bestimmten Tagen',
    previewRoute: 'zeitraumkategorien_preview',
    fixPreviewColumns: [0, 1, 2],
    formatPreview: (res) => {
      const result: {
        data: TableData[];
        columns: Column[];
      } = {
        data: [],
        columns: [
          {
            title: 'ID',
            dataKey: 'id'
          },
          {
            title: 'Zeitraumkategorie',
            dataKey: 'name'
          },
          {
            title: 'Prio',
            dataKey: 'prio'
          }
        ]
      };
      if (!res) return result;

      if (typeof res?.dates === 'object') {
        for (const dataKey in res.dates) {
          const el: any = res.dates[dataKey];
          const label = el?.label?.toString?.() || '';
          const feiertag =
            getNestedAttr(el, 'feiertag.name')?.toString?.() || '';
          const feiertagClass = feiertag ? styles.feiertag : '';
          result.columns.push({
            title: label,
            dataKey,
            hoverTitle: feiertag,
            sortable: false,
            getColumnClass: () => feiertagClass,
            headRender: () => <p>{label}</p>,
            bodyRender: (row: TableData) =>
              el?.zeitraumkategorien?.includes(row?.id) ? <Check checked /> : ''
          });
        }
      }

      if (typeof res?.zeitraumkategorien === 'object') {
        result.data = Object.values(res.zeitraumkategorien);
      }
      return result;
    },
    getForm: (row) => <Zeitraumkategorien row={row} />,
    columns: [
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
      {
        title: 'Beschreibung',
        dataKey: 'beschreibung',
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Zeitraumregel', dataKey: 'zeitraumregel.name' },
      { title: 'Priorität', dataKey: 'prio' },
      { title: 'Anfang', dataKey: 'anfang', bodyRender: renderDate },
      { title: 'Ende', dataKey: 'ende', bodyRender: renderDate },
      {
        title: 'Regelcode',
        dataKey: 'regelcode',
        bodyRender: (row: TableData, column: Column) => {
          const value =
            getNestedAttr(row, column?.dataKey || '')?.toString?.() || '';
          return value.split('_').join(', ');
        },
        getColumnClass: () => styles.break_white_space
      },
      { title: 'Sys', dataKey: 'sys', bodyRender: renderBoolean }
    ]
  }
];

export const db_routes = new Set(options.map((el) => el.routeBase));
export const models = options.sort((a, b) => a.label.localeCompare(b.label));
