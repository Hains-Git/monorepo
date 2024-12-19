import Basic from "../basic";

/**
 * Klasse um ein Arbeitszeitverteilung-Objekt zu erstellen.
 * @class
 */
class Arbeitszeitverteilung extends Basic {
  constructor(obj, appModel = false, preventExtension = true) {
    super(appModel);
    this._set("dauer", obj.dauer);
    this._set("verteilung", obj.verteilung);
    this._set("zeittypen", obj.zeittypen);
    this._setInteger("id", obj.id);
    this._set("name", obj.name);
    this._setFloat("std", obj.std);
    this._setInteger("dienstgruppe_id", obj.dienstgruppe_id);
    this._setFloat("pre_std", obj.pre_std);
    this._setInteger("pre_dienstgruppe_id", obj.pre_dienstgruppe_id);
    this._setInteger("pre_ueberschneidung_minuten", obj.pre_ueberschneidung_minuten);
    if (preventExtension) this._preventExtension();
  }

  /**
   * Liefert die zugehörige Dienstgruppe aus dem Singleton.
   * Falls keine dienstgruppe_id existiert, wird false zurückgegeben.
   */
  get dienstgruppe() {
    return this._getIdsObject("_dienstgruppen", "dienstgruppe_id", !!this.dienstgruppe_id);
  }

  /**
   * Liefert die zugehörige Dienstgruppe aus dem Singleton.
   * Falls keine pre_dienstgruppe_id existiert, wird false zurückgegeben.
   */
  get preDienstgruppe() {
    return this._getIdsObject("_dienstgruppen", "pre_dienstgruppe_id", !!this.pre_dienstgruppe_id);
  }

  /**
   * Liefert zu allen Zeittypen den passenden Arbeitszeittyp.
   * Falls ein Arbeitszeittyp nicht gefunden wird, wird seine ID zurückgegeben.
   */
  get arbeitszeittypen() {
    return this._getIdsObject("_arbeitszeittypen", "zeittypen", false);
  }

  /**
   * Liefert zu jeder Verteilung einen formattierte Zeit.
   */
  get zeitverteilung() {
    const zeit = [];
    if (this.verteilung) {
      this.verteilung.forEach((timeStr) => {
        zeit.push(this._formatTime(timeStr));
      });
    }

    return zeit;
  }

  /**
   * Liefert ein Objekt mit Informationen zu der Arbeitszeitverteilung.
   * Darunter gehören Name, ID, Zeiten, Gruppe
   */
  get _info() {
    const info = {
      value: {
        id: {
          value: this.id,
          label: "ID"
        },
        name: {
          value: this.name,
          label: "Name"
        },
        verteilung: {
          value: this.verteilungInfo,
          label: "Zeiten"
        }
      },
      label: "Arbeitszeitverteilung"
    };
    if (this.pre_dienstgruppe_id) {
      const dienstgruppe = this.preDienstgruppe;
      const diensteNamen = dienstgruppe?.diensteNamen || [];
      info.value.preDienstgruppe = {
        value: {
          name: { value: dienstgruppe ? dienstgruppe.name : this.pre_dienstgruppe_id.toString(), label: "Name" },
          std: { value: `${this.pre_std} Std.`, label: "Intervall vor erster Schicht" },
          minuten: { value: `${this.pre_ueberschneidung_minuten} Minuten`, label: "Akzeptierte Überschneidung" },
          dienste: { value: diensteNamen.join("\n"), label: "Dienste" }
        },
        label: "Vorherige Dienstgruppe"
      };
    }
    if (this.dienstgruppe_id) {
      const dienstgruppe = this.dienstgruppe;
      const diensteNamen = dienstgruppe?.diensteNamen || [];
      info.value.dienstgruppe = {
        value: {
          name: { value: dienstgruppe ? dienstgruppe.name : this.pre_dienstgruppe_id.toString(), label: "Name" },
          std: { value: `${this.std} Std.`, label: "Intervall nach letzter Schicht" },
          dienste: { value: diensteNamen.join("\n"), label: "Dienste" }
        },
        label: "Folgende Dienstgruppe"
      };
    }

    return info;
  }

  /**
   * Liefert ein Objekt mit Informationen zu den Zeittypen und ihren Zeiten.
   */
  get verteilungInfo() {
    const verteilung = this.zeitverteilung;
    let tag = 1;
    const info = {};

    this.arbeitszeittypen.forEach((typ, i) => {
      const key = `tag_${tag}`;
      if (!info[key]) {
        info[key] = {
          value: {},
          label: `Tag ${tag}`
        };
      }

      const start = verteilung[i];
      const end = verteilung[i + 1];

      if (end.timenr <= start.timenr) {
        tag++;
      }

      info[key].value[i] = {
        value: `${start.time} - ${end.time}`,
        label: `${this._isObject(typ) ? typ.name : typ}`
      };
    });

    return info;
  }
}

export default Arbeitszeitverteilung;
