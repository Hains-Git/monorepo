import React, { useCallback, useContext } from 'react';

import Headline from '../Headline/Headline';

import TwoColSaal from './TwoColSaal';
import OneCol from './OneCol';
import OneColList from './OneColList';
import { UseRegisterKey } from '../../../hooks/use-register';

import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';

function Content({ bereich_id, content_layout, bereich_section, dayCol }) {
  const { useVerteilerFastContextFields, verteiler, employeesRoom } =
    useContext(VerteilerFastContext);

  const { showForm, newEinteilung } = useVerteilerFastContextFields([
    'showForm',
    'newEinteilung'
  ]);

  UseRegisterKey('roomSort', verteiler.push, verteiler.pull, verteiler);

  const dragOver = (e) => {
    e.preventDefault();
    const elem = e.target.closest('div.po-dienst-row');
    elem.style.border = '1px dashed #000';
  };

  const dragLeave = (e) => {
    e.preventDefault();
    const elem = e.target.closest('div.po-dienst-row');
    elem.style.border = '1px solid transparent';
  };

  // Dropped und SearchCallback sollten die Bereich-Id ggf.
  // aus dem Bedarf holen (in renderNotDienstfrei)

  const dropped = (e, bedarf) => {
    e.preventDefault();
    const elem = e.target.closest('div.po-dienst-row');
    elem.style.border = '1px solid transparent';

    const einteilungsId = parseInt(e.dataTransfer.getData('einteilungsId'), 10);
    const mitarbeiterId = e.dataTransfer.getData('mitarbeiterId');

    if (!einteilungsId && !mitarbeiterId) return;

    let _po_dienst_id = 0;

    _po_dienst_id = parseInt(elem.dataset.po_id, 10);

    if (einteilungsId) {
      const einteilung = verteiler.data.einteilungen[einteilungsId];
      if (
        _po_dienst_id === einteilung.po_dienst_id &&
        dayCol === einteilung.tag
      )
        return;
    }

    if (bedarf?.isFull) {
      alert('Bedarf ist gedeckt');
      return;
    }

    const einteilung = verteiler.data.einteilungen[einteilungsId];
    const data = {
      einteilung,
      mitarbeiter: { id: parseInt(mitarbeiterId, 10) },
      po_dienst: { id: _po_dienst_id },
      bereich_id: bereich_id || bedarf?.bereich_id || 0,
      tag: dayCol,
      be_id: bedarf?.id || 0
    };
    showForm.set(true);
    newEinteilung.set({ ...data });
  };

  const searchBoxCallback = (_bereich_id) => (_data) => {
    const data = {
      einteilung: _data.einteilung,
      mitarbeiter: { id: parseInt(_data.mitarbeiter.id, 10) },
      po_dienst: { id: _data.po_dienst.id },
      bereich_id: _bereich_id,
      be_id: _data.be_id,
      tag: _data.tag,
      fieldId: _data.fieldId,
      isOpt: _data.isOpt
    };
    showForm.set(true);
    newEinteilung.set({ ...data });
  };

  const getLayout = (
    be_id,
    _bereich_id,
    einteilung,
    po_dienst,
    index2,
    cssClass = ''
  ) => {
    // Bereich-Id aus Bedarf nehmen, nicht aus dem Parameter
    // Da dieser ggf. nicht gesetzt ist
    // (Tagesverteiler-Untergruppe mit po_dienst_id hat keine bereich_id)
    const fieldId = `${po_dienst.id}_${index2}`;
    const key = `${fieldId}_${_bereich_id}_${index2}`;
    switch (content_layout) {
      case 'one_col':
        return (
          <OneCol
            key={key}
            verteiler={verteiler}
            content_layout={content_layout}
            employee={einteilung?.mitarbeiter}
            einteilung={einteilung}
            po_dienst={po_dienst}
            be_id={be_id}
            searchBoxClb={searchBoxCallback(_bereich_id)}
            cssClass={cssClass}
            bereich_section={bereich_section}
            fieldId={fieldId}
            dayCol={dayCol}
            bereich_id={_bereich_id}
          />
        );
      case 'one_col_list':
        return (
          <OneColList
            key={key}
            verteiler={verteiler}
            content_layout={content_layout}
            employee={einteilung?.mitarbeiter}
            einteilung={einteilung}
            po_dienst={po_dienst}
            searchBoxClb={searchBoxCallback(_bereich_id)}
            bereich_section={bereich_section}
            dayCol={dayCol}
            be_id={be_id}
            bereich_id={_bereich_id}
          />
        );
      case 'two_col_saal':
        if (einteilung.id) {
          if (!employeesRoom[dayCol]) employeesRoom[dayCol] = {};
          employeesRoom[dayCol][einteilung.id] = einteilung.arbeitsplatz_id;
        }
        return (
          <TwoColSaal
            key={key}
            verteiler={verteiler}
            content_layout={content_layout}
            employee={einteilung?.mitarbeiter}
            einteilung={einteilung}
            be_id={be_id}
            po_dienst={po_dienst}
            searchBoxClb={searchBoxCallback(_bereich_id)}
            cssClass={cssClass}
            bereich_section={bereich_section}
            fieldId={fieldId}
            dayCol={dayCol}
            bereich_id={_bereich_id}
          />
        );
      default:
        return <p key={key}>No Layout defined</p>;
    }
  };

  const renderDienstfrei = (po_dienst, einteilungen) => (
    <div
      title={po_dienst.id}
      id={`po_dienst_id_${po_dienst.id}`}
      data-po_id={po_dienst.id}
      className="po-dienst-row"
      key={po_dienst.id}
    >
      {content_layout !== 'one_col_list' && (
        <Headline
          key={po_dienst.planname}
          text={po_dienst.planname}
          cssClass="content-headline"
          doubleClickHandler={(evt) => po_dienst?.setInfo?.(evt)}
        />
      )}

      {einteilungen.map((item, index2) =>
        getLayout(
          item?.feld?.bedarfId || 0,
          bereich_id,
          item,
          po_dienst,
          index2,
          'no-drag'
        )
      )}
    </div>
  );

  const renderNotDienstfrei = (
    po_dienst,
    einteilungen,
    be,
    gesamtBedarf,
    _bereich,
    label
  ) => {
    const key = `${po_dienst.id}_${be?.id || 0}`;
    return (
      <div
        id={`po_dienst_id_${po_dienst.id}`}
        data-po_id={po_dienst.id}
        className="po-dienst-row"
        key={key}
        onDragOver={dragOver}
        onDrop={(evt) => dropped(evt, be)}
        onDragLeave={dragLeave}
      >
        {einteilungen?.length && content_layout !== 'one_col_list' ? (
          <Headline
            key={key}
            text={label}
            doubleClickHandler={(evt) => {
              verteiler.popupExtras = { po_dienst, be, bereich: _bereich };
              if (_bereich) _bereich?.setInfo?.(evt, false);
              else po_dienst?.setInfo?.(evt, false);
            }}
            cssClass="content-headline"
          />
        ) : null}
        {einteilungen.map((item, index2) => {
          let optMinClass =
            index2 < (be?.min || (0 && !item?.is_optional))
              ? 'min'
              : (index2 >= gesamtBedarf && gesamtBedarf >= 0 && 'exceed') ||
                'opt';

          if (item?.id && item?.is_optional) {
            optMinClass = 'opt';
          }

          return getLayout(
            be?.id,
            bereich_id || be?.bereich_id || 0,
            item,
            po_dienst,
            index2,
            optMinClass
          );
        })}
      </div>
    );
  };

  return (
    <div className={`content ${content_layout}`}>
      {verteiler?.getContent?.(
        bereich_section,
        dayCol,
        true,
        ({
          po_dienst,
          einteilungen,
          be,
          gesamtBedarf,
          dienstfrei,
          index,
          _bereich,
          label
        }) => {
          return dienstfrei
            ? renderDienstfrei(po_dienst, einteilungen, index)
            : renderNotDienstfrei(
                po_dienst,
                einteilungen,
                be,
                gesamtBedarf,
                _bereich,
                label,
                index
              );
        },
        true
      ) || null}
    </div>
  );
}

export default Content;
