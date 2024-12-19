import Shared from "./shared";

class Rotationen extends Shared {
  constructor(index, parent, appModel = false) {
    super(index, parent, appModel);
    this.init();
  }

  /**
   * Initialisiert die Statistik
   */
  init() {
    this.createData();
    this.createDataSettings();
    this.createToolTip();
    this.chart.onClick = (data) => {
      const payload = data?.activePayload?.[0]?.payload;
      const felder = payload?.felder;
      const infoEl = this.createInfoEl(() => {
        const info = {
          mainInfos: {
            name: { value: payload?.name || "", label: "Typ" },
            anzahl: { value: payload?.Anzahl.toString() || "", label: "Anzahl" }
          },
          popupInfos: {
            Felder: {
              value: {}, label: "Einteilungen", sorting: "alph-asc", ignore: true
            }
          }
        };
        // Deaktivieren, da dies ungewöhnlich lange dauert
        // felder?.forEach?.((feld) => {
        //   info.popupInfos.Felder.ignore = false;
        //   const feldInfo = feld?._info;
        //   info.popupInfos.Felder.value[feld.id] = {
        //     value: { ...feldInfo.mainInfos, ...feldInfo.popupInfos },
        //     label: feld.label,
        //     sort: feld.label
        //   };
        // });
        return info;
      }, `Einteilungen: ${payload.name}`);
      infoEl.setInfo();
    };
  }

  /**
   * Erstellt die Daten
   */
  createData() {
    if (this?._statistiken?.inRotationenBar) {
      super.createData(this._statistiken.inRotationenBar(
        this?._mitarbeiter,
        (mitarbeiter, feld) => (!this.onlyMainZeitraum
          || feld?.date?.isInMainZeitraum)
          && this.isInFilter(mitarbeiter, feld)
      ));
    }
  }

  /**
   * Erstellt die Farben für die Daten
   */
  createDataSettings() {
    this.createDataSettingsNotStacked();
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    this.createNotStackedTooltip();
  }
}

export default Rotationen;
