import { numericLocaleCompare } from "../tools/helper";

export const checkMainInfos = (mainInfos, callbacks) => {
  let i = 0;
  const mainInfosArr = [];
  for (const key in mainInfos) {
    const info = mainInfos[key];
    if (!info || info.ignore) continue;
    let p = false;
    const thisKey = `${key}_${i}`;
    if (info.value !== "") {
      p = callbacks.label(thisKey, info);
    } else {
      p = callbacks.value(thisKey, info);
    }
    if (p) mainInfosArr.push(p);
    i++;
  }
  return mainInfosArr;
};

export const checkMoreInfos = (more, callbacks, sorting = false) => {
  let moreInfosArr = [];
  let i = 0;
  for (const key in more) {
    const info = more[key];
    if (!info || info.ignore) continue;
    let p = false;
    if (info.label || info.value) {
      const thisKey = `${key}_${i}`;
      // Nur das Label anzeigen
      if (info.value === "" && info.label !== "") {
        p = callbacks.label(thisKey, info);
      } else if (info.value !== "" && typeof info.value !== "object") {
        // Label und Value anzeigen
        p = callbacks.value(thisKey, info);
      } else if (typeof info.value === "object") {
        // Falls ein Label existiert,
        // wird ein Dropdownmenü erstellt mit dem Label als Überschrift
        // und dem kommenden Inhalt im Dropdown
        p = callbacks.dropdown(thisKey, info, callbacks, callbacks);
      } else {
        console.log(info, "Keine passende Darstellung für Info gefunden!");
      }
    }
    i++;
    if (p) moreInfosArr.push(p);
  }

  if (sorting) {
    switch (sorting) {
      case "asc":
        moreInfosArr = moreInfosArr.sort((a, b) => a.props.sort - b.props.sort);
        break;
      case "desc":
        moreInfosArr = moreInfosArr.sort((a, b) => b.props.sort - a.props.sort);
        break;
      case "alph-asc":
        moreInfosArr = moreInfosArr.sort((a, b) => numericLocaleCompare(a.props.sort, b.props.sort));
        break;
    }
  }

  return moreInfosArr;
};
