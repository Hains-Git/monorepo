import { useEffect, useState } from 'react';
import { formatDate, today } from '../tools/dates';
import { deepClone } from '../tools/helper';
import { development } from '../tools/flags';
import { isObject } from '../tools/types';
import DienstplanCalendar from '../models/helper/dienstplancalendar';
import { UseMounted } from './use-mounted';
import { returnError } from '../tools/hains';

/**
 * @returns Funktion, die nur die letzte Anfrage an die Api verarbeitet
 */
const getMonatsplanLastCall = () => {
  let globalNonce = {};
  return async (calendar, isReady, createDienstplan) => {
    if (!isReady()) return;
    const localNonce = {};
    globalNonce = localNonce;
    const anfang = calendar.tag || formatDate(today());
    const resp = calendar?.getMonatsplan?.(anfang);
    const params = resp?.params;
    const dpl = await resp?.dienstplan;
    if (localNonce !== globalNonce || !(dpl && params)) return;
    createDienstplan(dpl, params);
  };
};

/**
 * Anfrage an die API für den Monatsplan
 */
const getMonatsplan = getMonatsplanLastCall();

/**
 * Initialisiert den Dienstplan mit seinen Daten und Unterseiten.
 * @param {Object} appModel
 * @param {Object} user
 * @returns dienstplan
 */
export const UseDienstPlaner = (appModel, user) => {
  const [dienstplan, setDienstplan] = useState(false);
  const [lastSession, setLastSession] = useState(false);
  const [calendar, setCalendar] = useState(false);
  const [showCalender, setShowCalender] = useState(true);
  const mounted = UseMounted();

  /**
   * @returns True, wenn user und appModel existieren und mounted true ist
   */
  const isReady = () => {
    const isMounted = user && appModel && mounted;
    return isMounted;
  };

  /**
   * Neuen Deinstplan erstellen
   * @param {Object} dpl
   * @param {Object} params
   */
  const setNewDienstplan = (dpl = {}, params = {}) => {
    const otherProps = {
      calendar,
      anfang: params.anfang,
      ende: params.ende
    };
    const data = {
      pageName: 'dienstplaner',
      pageData: dpl,
      state: otherProps,
      user
    };
    if (development) {
      const sessionDpl = lastSession?.dpl;
      const sessionOtherProps = lastSession?.otherProps;
      const sessionQuery = lastSession?.query;
      console.log('sitzung', sessionDpl, sessionQuery, sessionOtherProps);
      if (sessionDpl && sessionQuery && sessionOtherProps) {
        data.dpl = sessionDpl;
        data.query = sessionQuery;
        data.otherProps = {
          ...sessionOtherProps
        };
      }
      setLastSession(() => deepClone(data));
    }
    appModel.init(data);
    const newDienstPlan = appModel.page;
    calendar?.removeLoader?.();
    setDienstplan(() => newDienstPlan);
  };

  /**
   * Validiert die API-Response
   * und erstellt ggf. einen neuen Dienstplan oder leitet zur Home-Seite weiter
   * @param {any} response
   * @param {Object} params
   */
  const createDienstplan = (response, params) => {
    if (!isReady()) return;
    if (development) console.log('response start', deepClone(response));
    if (isObject(response) && isObject(params)) {
      if (response?.error_msg) {
        alert(response.error_msg);
      } else {
        setNewDienstplan(response, params);
      }
    } else {
      alert('Etwas ist schief gelaufen.');
    }
  };

  /**
   * Abfrage des Dienstplan-Datums
   */
  useEffect(() => {
    if (isReady()) {
      setCalendar(
        () => new DienstplanCalendar('dienstplaner', appModel, 'month')
      );
      if (development && lastSession) {
        setNewDienstplan();
        return;
      }
    }

    return () => {
      if (development) return;
      setDienstplan(() => false);
      setCalendar(() => false);
    };
  }, [user, appModel, mounted]);

  /**
   * Reset des Dienstplans
   */
  useEffect(() => {
    return () => {
      dienstplan?.reset?.(false);
    };
  }, [dienstplan]);

  /**
   * Aktualisiert das Datum des Kalenders
   * @param {String} date
   * @param {String} view
   */
  const dateUpdated = (date, view, callback = false) => {
    calendar?.getDienstplaene?.(date, view, callback);
  };

  /**
   * Bestätigen die Auswahl des Kalenders und lädt den Dienstplan
   * @param {String} date
   */
  const dateConfirmed = (date) => {
    calendar?.loading?.();
    setShowCalender(() => false);
    dienstplan?.reset?.(false);
    setDienstplan(() => false);
    const dateString = formatDate(date.day);
    calendar?.setTag?.(dateString);
    getMonatsplan(calendar, isReady, createDienstplan).catch(returnError);
  };

  /**
   * Font-Size des Dienstplans ändern
   * @param {Object} evt
   */
  const changeSize = (evt, setLoading) => {
    evt.stopPropagation();
    let button = evt.target;
    while (button && button.tagName !== 'BUTTON') {
      button = button.parentElement;
    }
    const txt = button.getAttribute('data-info');
    const add = txt === '+' ? 1 : -1;
    const reset = txt === '=';
    if (dienstplan?.table?.setFontSize) {
      dienstplan.table.setFontSize(add, reset);
    } else if (user?.setFontSize) {
      user.setFontSize(add, reset);
    }
    setLoading?.(() => false);
  };

  return [
    dienstplan,
    calendar,
    dateUpdated,
    dateConfirmed,
    showCalender,
    setShowCalender,
    changeSize
  ];
};
