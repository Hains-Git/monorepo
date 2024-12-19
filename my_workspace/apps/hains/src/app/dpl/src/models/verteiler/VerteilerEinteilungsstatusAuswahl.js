import EinteilungsstatusAuswahl from '../helper/einteilungsstatus-auswahl';
import { toDate, formatDate } from '../../tools/dates';

class VerteilerEinteilungsstatusAuswahl extends EinteilungsstatusAuswahl {
  constructor(appModel = false) {
    super(appModel, true);
  }

  /**
   * Filtert die Einteilungen nach bestimmten Bedingungen
   * @param {Object} e
   * @returns True, wenn die Einteilung berücksichtigt werden soll
   */
  showEinteilung(e) {
    // Einteilungen filtern anhand der Vorlage
    const verteiler_dates = this?._page?.data?.verteiler_dates;
    let filtered = false;
    const eTag = toDate(e.tag);
    const eTagStr = formatDate(eTag);
    filtered = verteiler_dates?.find?.((item) => {
      const date = toDate(item);
      const dateStr = formatDate(date);
      return eTagStr === dateStr;
    });
    return !!filtered;
  }
}

export default VerteilerEinteilungsstatusAuswahl;
