import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { showExtraClass, isDoubleClass } from '../styles/basic';
import {
  debounce, throttle, wait
} from '../tools/debounce';
import { UseMounted } from './use-mounted';
import { UseRegister } from './use-register';
import { sortAuswahlDropdown } from '../tools/helper';
import { isArray } from '../tools/types';
import AuswahlRow from '../components/dienstplaner/einteilung-auswahl/AuswahlRow';

export const UseFeld = (feld, type) => {
  const [value, setValue] = useState(feld.getValue(type));
  const [showClass, setShowClass] = useState('');

  const defaultClassName = () => `dienstplan-einteilung ${showClass}`.trim();

  const [vorschlaege, setVorschlaege] = useState([]);
  const [style, setStyle] = useState(null);
  const [title, setTitle] = useState('');
  const [konflikte, setKonflikte] = useState(false);
  const [className, setClassName] = useState(defaultClassName());
  const [focusedIndex, setFocusedIndex] = useState(0);
  const mounted = UseMounted();

  const update = UseRegister(feld?._push, feld?._pull, feld);
  const updateThroughMitarbeiter = UseRegister(
    feld?.pushInMitarbeiter,
    feld?.pullFromMitarbeiter,
    feld?.mitarbeiter
  );
  const refInput = useRef(null);

  const addEinteilungInfos = (_title) => {
    const einteilung = feld?.einteilung;
    const kontextKommentar = einteilung?.context_comment;
    const kontext = einteilung?.einteilungskontext?.name || einteilung?.einteilungskontext_id;
    if (kontextKommentar || kontext) {
      _title.unshift({ txt: `Kontext: ${kontext}\n${kontextKommentar}\n` });
    }
    const kommentar = einteilung?.info_comment;
    if (kommentar) {
      _title.unshift({ txt: `Kommentar: ${kommentar}` });
    }
    return _title;
  };

  const reset = throttle((feldToCheck) => {
    if (mounted) {
      const result = feldToCheck?.getStyle?.(type, false);
      const _title = addEinteilungInfos(result?.title || []);
      const isDouble = feldToCheck?.isDouble;
      setStyle(() => result?.style || null);
      setClassName(() => `${defaultClassName()} ${result?.className || ""} ${isDouble ? isDoubleClass : ""}`.trim());
      setTitle(() => _title);
      setKonflikte(() => result?.konflikte || false);
    }
  }, wait);

  useEffect(() => {
    feld?.setRef?.(refInput?.current || false);
    return () => {
      feld?.setRef?.(false);
    };
  }, [refInput, feld]);

  const closeDropDown = () => {
    mounted && setVorschlaege(() => []);
  };

  const vorschlaegeCallback = (mitarbeiter, auswahlFeld, i) => (
    <AuswahlRow
      feld={auswahlFeld}
      mitarbeiter={mitarbeiter}
      type="mitarbeiter"
      infoParent={mitarbeiter}
      key={`${auswahlFeld?.id}_${mitarbeiter?.id}_${i}`}
      closeDropDown={closeDropDown}
      score={mitarbeiter.getScore
        ? mitarbeiter.getScore(auswahlFeld)
        : {
          value: 0,
          title: "",
          props: false
        }}
    />
  );

  const updateVorschlaege = (vorschlaegeArr) => {
    setFocusedIndex(() => 0);
    setVorschlaege(() => (isArray(vorschlaegeArr)
      ? sortAuswahlDropdown(vorschlaegeArr, true) : []));
  };

  const getVorschlaege = () => {
    // Vorschläge anzeigen, wenn kein Mitarbeiter eingetragen wurde
    if (!feld?.mitarbeiter && feld?.getVorschlaege) {
      updateVorschlaege(feld.getVorschlaege(value, vorschlaegeCallback, false));
    } else {
      closeDropDown();
    }
  };

  useEffect(() => {
    if (feld?.mitarbeiter || feld.value === "") {
      setValue(() => feld.getValue(type));
    }
    reset(feld);
  }, [feld, update, updateThroughMitarbeiter, showClass]);

  useEffect(() => {
    getVorschlaege();
  }, [value]);

  const focusOnInput = () => {
    refInput?.current?.focus?.();
  };

  const handleFocus = (evt, check = false) => {
    evt?.stopPropagation?.();
    feld?.setFocus?.(check);
    setShowClass(() => showExtraClass);
    getVorschlaege();
  };

  const handleBlur = (evt) => {
    evt?.stopPropagation?.();
    setShowClass(() => '');
  };

  const einteilen = useCallback(debounce((eintrag) => {
    const vorschlaegeArr = feld.einteilen({
      vorschlaegeCallback,
      value: eintrag,
      post: true,
      eachFeld: true
    })?.vorschlaege;
    updateVorschlaege(vorschlaegeArr);
  }, wait), [feld]);

  const handleChange = (evt) => {
    if(type !== 'mitarbeiter') return;
    evt.stopPropagation();
    setValue(() => evt.target.value);
    reset();
    einteilen(evt.target.value);
  };

  const onKeyDown = (evt) => {
    evt.stopPropagation();
    feld?.onKeyDown?.(
      evt,
      vorschlaege,
      (shouldEinteilen = false, diff = 1) => {
        if (!mounted) return;
        if (shouldEinteilen) {
          const vorschlagFeld = vorschlaege[focusedIndex]?.props?.feld;
          const mitarbeiter = vorschlaege[focusedIndex]?.props?.mitarbeiter;
          vorschlagFeld?.debouncedEinteilen?.({
            value: mitarbeiter.id,
            post: true,
            eachFeld: true
          });
        } else {
          const l = vorschlaege?.length || 0;
          setFocusedIndex((current) => {
            const next = current + diff;
            if (next < 0) return l >= 0 ? l - 1 : 0;
            return next >= l ? 0 : next;
          });
        }
      }
    );
  };

  const isVorschlag = () => {
    if (feld?.einteilung) {
      return feld.einteilung?.vorschlag;
    }
    return false;
  };

  const isNotPublic = () => {
    if (feld?.einteilung) {
      return !feld.einteilung?.public;
    }
    return false;
  }

  return {
    value,
    className,
    style,
    title,
    refInput,
    vorschlaege,
    konflikte,
    focusOnInput,
    handleFocus,
    handleBlur,
    handleChange,
    onKeyDown,
    focusedIndex,
    isVorschlag,
    isNotPublic
  };
};
