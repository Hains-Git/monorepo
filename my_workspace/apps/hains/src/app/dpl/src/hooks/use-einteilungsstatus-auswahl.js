import React, { useEffect, useState } from "react";
import { isFunction, isObject } from "../tools/types";
import Einteilungen from "../components/utils/einteilungsstatus-auswahl/Einteilungen";
import { UseRegister } from "./use-register";
import { debounce, shortwait } from "../tools/debounce";
import { UseMounted } from "./use-mounted";

const debouncedToggleOnlyDoubles = debounce((mounted, setOnlyDoubles) => {
  mounted && setOnlyDoubles((prev) => !prev);
}, shortwait);

const getEinteilungen = (e, onlyDoubles, auswahl) => {
  const result = [];
  const ignore = ['mehrfacheEnteilungenKeys'];
  if (isObject(e)) { 
    for(const key in e) {
      const obj = e[key];
      if (ignore.includes(key)) continue;
      if(!obj?.hide?.length && !obj?.einteilungen?.length) continue;
      result.push(<Einteilungen key={key} onlyDoubles={onlyDoubles} parent={obj} auswahl={auswahl} />);
    }
  }
  if(!result.length) {
    result.push(<p key="noEinteilungen">Keine überschreibbaren Einteilungen gefunden.</p>);
  }
  return result;
};

const throttledSetEinteilungen = debounce((auswahl, setEinteilungen, onlyDoubles, setShowInfo) => {
  if (isFunction(auswahl?.groupEinteilungen)) {
    setEinteilungen(getEinteilungen(auswahl.groupEinteilungen(), onlyDoubles, auswahl));
    if (auswahl.infoFkt !== undefined) {
      setShowInfo(!!auswahl.infoFkt);
    }
  }
}, shortwait);

export const UseEinteilungsstatusAuswahlInfo = (auswahl) => {
  const update = UseRegister(auswahl?._push, auswahl?._pull, auswahl);
  const [showInfo, setShowInfo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [einteilungen, setEinteilungen] = useState([]);
  const [onlyDoubles, setOnlyDoubles] = useState(false);
  const mounted = UseMounted();

  const setEinteilungenIfMounted = (e) => mounted && setEinteilungen(() => e);
  const setShowInfoIfMounted = (e) => {
    if(mounted) {
      setShowInfo(() => e);
      setShowLoader(() => false);
    }
  };

  useEffect(() => {
    setShowLoader(() => true);
    throttledSetEinteilungen(auswahl, setEinteilungenIfMounted, onlyDoubles, setShowInfoIfMounted);
    return () => {
      setEinteilungen(() => []);
    }
  }, [update, auswahl, onlyDoubles, mounted]);

  const toggleOnlyDoubles = () => debouncedToggleOnlyDoubles(mounted, setOnlyDoubles);

  return {
    showInfo,
    setShowInfo,
    einteilungen,
    toggleOnlyDoubles,
    onlyDoubles,
    showLoader
  };
};