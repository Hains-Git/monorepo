import React from 'react';
import { Column, TableData } from '../components/utils/table/types/table';
import { getFontColorByWhite, getNestedAttr } from '../helper/util';
import { History, PlanerDate } from './types';
import { PepContext } from '../context/pep/PepProvider';

export const renderName = (row: TableData) => getNestedAttr(row, 'pep_name')?.trim?.() || '';

function Einteilung({ row, column, tag }: { row: TableData; column: Column; tag: PlanerDate }) {
  const { showKontextColors, showPepName, setHistory, setHistoryLabel } = React.useContext(PepContext);
  const einteilungen = getNestedAttr(row, `einteilungen.${column.id}`) || [];
  if (!einteilungen?.length) return '';

  return (
    einteilungen?.map?.((e: any, i: number) => {
      let color_key = 'po_dienst.pep_color';
      if (showKontextColors) color_key = 'einteilungskontext.color';
      else if (!showPepName) color_key = 'po_dienst.color';
      const color = getNestedAttr(e, color_key) || '';
      const { color: calColor } = getFontColorByWhite(color);
      const title = [];

      const dienst_name = getNestedAttr(e, 'po_dienst.name');
      if (dienst_name) title.push(`Dienst: ${dienst_name}`);

      const description = getNestedAttr(e, 'description');
      if (description) title.push(`Beschreibung: ${description}`);
      const kontext_name = getNestedAttr(e, 'einteilungskontext.name');

      if (kontext_name) {
        const comment = getNestedAttr(e, 'context_comment') || '';
        title.push(`Kontext: ${kontext_name} ${comment ? `(${comment})` : ''}`);
      }

      if (e?.kostenstelle) {
        title.push(
          `Kostenstelle: ${getNestedAttr(e, 'kostenstelle.name') || ''} (${getNestedAttr(e, 'kostenstelle.nummer')})`
        );
      }

      const arbeitsplatz = getNestedAttr(e, 'arbeitsplatz.name');
      if (arbeitsplatz) title.push(`Arbeitsplatz: ${arbeitsplatz}`);

      const comment = getNestedAttr(e, 'info_comment') || '';
      if (comment) title.push(`Kommentar: ${comment}`);

      const versionen = getNestedAttr(e, 'versionen');
      const versionenArr = [
        ...(Array.isArray(versionen) ? versionen : []).sort((a, b) => {
          const updated_at_a = new Date(getNestedAttr(a, 'updated_at')?.toString?.() || '').getTime();
          const updated_at_b = new Date(getNestedAttr(b, 'updated_at')?.toString?.() || '').getTime();
          return updated_at_a - updated_at_b;
        })
      ];

      // Gemeinsame Versionen zusammenfassen!
      const vl = versionenArr.length;
      if (vl > 1) title.push(`Versionen: ${vl}`);
      const nameKey = showPepName ? 'po_dienst.pep_name' : 'po_dienst.planname';
      const dienstName = getNestedAttr(e, nameKey) || '';
      versionenArr.unshift(e);
      const hasChanges = versionenArr.find(
        (v) => dienstName !== getNestedAttr(v, nameKey) || kontext_name !== getNestedAttr(v, 'einteilungskontext.name')
      );

      return (
        <p
          key={`einteilung-${i}`}
          title={title.join('\n')}
          style={color ? { backgroundColor: color, color: calColor } : {}}
          onClick={() => {
            const label = [tag.label];
            const mitarbeiter = renderName(row);
            if (mitarbeiter) label.push(mitarbeiter);
            if (dienstName) label.push(dienstName);
            setHistoryLabel(() => label.join(', '));
            setHistory(() => {
              const result: History[] = [];
              versionenArr.forEach((v: any) => {
                result.push({
                  Arbeitsplatz: getNestedAttr(v, 'arbeitsplatz.name') || '',
                  Dienst: getNestedAttr(v, 'po_dienst.name') || '',
                  PepDienst: getNestedAttr(v, nameKey) || '',
                  Bereich: getNestedAttr(v, 'bereich.name') || '',
                  Kontext: getNestedAttr(v, 'einteilungskontext.name') || '',
                  Kontextkommentar: getNestedAttr(v, 'context_comment') || '',
                  Status: getNestedAttr(v, 'einteilungsstatus.name') || '',
                  Kommentar: getNestedAttr(v, 'info_comment') || '',
                  Bearbeitet: getNestedAttr(v, 'updated_at') || '',
                  Nutzer: getNestedAttr(v, 'user') || ''
                });
              });
              return result;
            });
          }}
        >
          {dienstName}
          {hasChanges ? '*' : ''}
        </p>
      );
    }) || ''
  );
}

export default Einteilung;
