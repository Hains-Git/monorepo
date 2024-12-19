import { development, showConsole } from "../../tools/flags";
import Channel from "../helper/channel";
import DienstplanerDataEinteilung from "./einteilung";

/**
 * Erstellt ein neues Channel-Objekt für den Dienstplan
 */
class DienstplanerChannel extends Channel{
  constructor(parent = false, appModel = false) {
    super("dienstplan", parent, appModel, false);
    this.setUpdateBedarfe();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * Liefert das erste Date-Objekt
   */
  get firstDate() {
    return this?._dates?._getByIndex?.(0);
  }

  /**
   * Liefert die Einteilung aus this._einteilungen
   * @param {Number} id
   * @returns Object
   */
  getEinteilung(id) {
    return this._getIdsObject("_einteilungen", id, false);
  }

  /**
   * Setzt das updateBedarfe Attribut
   * @param {Boolean} updateBedarfe
   */
  setUpdateBedarfe(check = false) {
    this._set("updateBedarfe", check);
    this._update();
  }

  /**
   * Empfängt die Daten und führt entsprechende Operationen aus
   * @param {Object} data
   */
  receive(data = false) {
    if (development) console.log("dienstplanChannel", data);
    this.einteilen(data?.einteilungen);
    this.freigabeUpdate(data?.freigabe, data?.freigabetypen_dienste_ids);
    this.rotationUpdate(data?.rotation, data?.addRotation);
    this.bedarfeUpdateMsg(data?.bedarfe_update);
    this.wunschUpdate(data?.wunsch);
  }

  /**
   * Erstellt Einteilungen und liefert entweder deren Id oder die Einteilung
   * @param {Array} einteilungen
   * @param {Boolean} getIds
   * @returns Array
   */
  createEinteilungen(einteilungen, getIds = false, callback = false) {
    return einteilungen?.map?.((e) => {
      const einteilung = new DienstplanerDataEinteilung(e, this._appModel);
      einteilung?.add?.(false);
      if (this._isFunction(callback)) {
        callback(einteilung);
      } 
      return getIds ? einteilung?.id : einteilung;
    }) || [];
  }

  /**
   * Aktualisiert die Einteilungen
   * @param {Object} einteilungen
   */
  einteilen(einteilungen) {
    if (!this._isObject(einteilungen)) return;
    let update = false;
    const mitarbeiterEl = {};
    const dienstEl = {};
    const mitarbeiterDienstEl = {};
    const addEl = (el, id, obj) => {
      if(obj[id]) {
        if(!obj[id].includes(el)) obj[id].push(el);
      } else {
        obj[id] = [el];
      }
    };

    const removed = {};
    const firstDate = this.firstDate;
    const firstDateId = firstDate?.id;
    const bedarfNotFound = {};
    for (const key in einteilungen) {
      const [bereich_id, tag, po_dienst_id] = key.split("_");
      const date = this?._dates?.[tag];
      // Nur wenn der Tag im Dienstplan ist
      if(!date) continue;
      const byDienstBereich = date?.getBereich?.(po_dienst_id, bereich_id);
      const dienst = this?._dienste?.[po_dienst_id];
      if(dienst?.hasBedarf && !byDienstBereich && !bedarfNotFound?.[tag]?.[po_dienst_id]) {
        if(!bedarfNotFound[tag]) bedarfNotFound[tag] = [];
        bedarfNotFound[tag][po_dienst_id] = {
          byDienstBereich: date?.getFirstBereich?.(po_dienst_id),
          einteilungenArr: einteilungen[key]
        };
      }
      if (
        byDienstBereich?.updateEinteilungenIds
        && byDienstBereich?.einteilungEinteilen
        && byDienstBereich?.resetEinteilungen
      ) {
        if(!removed[key]) {
          removed[key] = true;
          byDienstBereich.resetEinteilungen();
        }
        // Macht ein Update der Einteilung_ids im byDienstBereich und teilt die Einteilungen neu ein
        byDienstBereich.updateEinteilungenIds(
          this.createEinteilungen(einteilungen[key], true, (e) => {
            const mId = e?.mitarbeiter_id;
            const dId = e?.po_dienst_id;
            addEl(date?.getMitarbeiterEl?.(mId), mId, mitarbeiterEl);
            addEl(date?.getDienstEl?.(dId), dId, dienstEl);
            addEl(firstDate?.getTableDienstHeadEl?.(mId, dId), firstDateId, mitarbeiterDienstEl);
            return byDienstBereich.einteilungEinteilen(e, true);
          })
        );
        update = true;
      } else if(development) {
        console.log(
          "Es wurde kein passendes byDienstBereich gefunden", 
          key, 
          byDienstBereich, 
          this, 
          byDienstBereich?.updateEinteilungenIds, 
          byDienstBereich?.einteilungEinteilen, 
          byDienstBereich?.resetEinteilungen
        );
      }
    }

    for(const tag in bedarfNotFound) {
      for(const po_dienst_id in bedarfNotFound[tag]) {
        const { byDienstBereich, einteilungenArr } = bedarfNotFound[tag][po_dienst_id];
        byDienstBereich?.updateEinteilungenIds(
          this.createEinteilungen(einteilungenArr, true, (e) => {
            const mId = e?.mitarbeiter_id;
            const dId = e?.po_dienst_id;
            addEl(firstDate?.getTableDienstHeadEl?.(mId, dId), firstDateId, mitarbeiterDienstEl);
            return byDienstBereich.einteilungEinteilen(e, true);
          })
        );
        update = true;
      }
    }

    if(update) {
      this?._einteilungsstatusAuswahl?._update?.();
      this?._dienstplanTable?._update?.();
      Object.values(mitarbeiterEl)?.forEach?.((el) => el?._update?.());
      Object.values(dienstEl)?.forEach?.((el) => el?._update?.());
      Object.values(mitarbeiterDienstEl)?.forEach?.((el) => el?._update?.());
    }
  }

  /**
   * Führt ein Update der Freigabe durch
   * @param {Object} freigabe
   * @param {Array} dienste_ids
   */
  freigabeUpdate(freigabe, dienste_ids = []) {
    super.freigabeUpdate(freigabe, dienste_ids);
  }

  /**
   * Führt ein Update der Rotation durch
   * @param {Object} rotation
   * @param {Boolean} add
   */
  rotationUpdate(rotation, add = false) {
    super.rotationUpdate(rotation, add, (r, oldR, mitarbeiter, oldM) => {
      this?._dates?._each?.((date) => {
        if (date?.getMitarbeiterEl && date.updateRotation) {
          const oldEl = date.getMitarbeiterEl(oldM?.id);
          oldEl?.updateRotation && oldEl.updateRotation(oldR, false);
          date.updateRotation(oldR, false);
          const el = date.getMitarbeiterEl(mitarbeiter?.id);
          el?.updateRotation && el.updateRotation(r, add);
          date.updateRotation(r, add);
        }
      });
    });
  }

  /**
   * Ändert ggf. das updateBedarfe-Attribut
   * @param {Boolean} update
   */
  bedarfeUpdateMsg(update) {
    if (update) this.setUpdateBedarfe("Bedarfe wurden aktualisiert!");
  }

  /**
   * Führt ein Update über die Mitarbeiterin durch
   * @param {Object} mitarbeiter
   * @param {Object} oldM
   */
  updateThroughMitarbeiter(mitarbeiter, oldM) {
    super.updateThroughMitarbeiter(mitarbeiter, oldM);
    this.updateFrontend();
  }

  /**
   * Führt ein Update des Frontends durch
   */
  updateFrontend() {
    this?._statistic?.updateFilter?.();
    this?._dienstplanTable?.updateFrontendThroughChannel?.();
  }
}

export default DienstplanerChannel;
