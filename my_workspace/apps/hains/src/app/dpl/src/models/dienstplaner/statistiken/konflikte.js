import Shared from "./shared";

class Konflikte extends Shared {
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
            name: { value: payload?.name || "", label: "Konflikt" },
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
        //   console.log(feld?._info);
        //   info.popupInfos.Felder.ignore = false;
        //   const feldInfo = feld?._info;
        //   info.popupInfos.Felder.value[feld.id] = {
        //     value: { ...feldInfo.mainInfos, ...feldInfo.popupInfos },
        //     label: feld.label,
        //     sort: feld.label
        //   };
        // });
        return info;
      }, `Konflikt: ${payload.name}`);
      infoEl.setInfo();
    };
  }

  /**
   * Erstellt die Daten
   */
  createData() {
    if (this?._statistiken?.konflikteBar) {
      super.createData(this._statistiken.konflikteBar(
        this?._mitarbeiter,
        this._konfliktArbeitszeittypen,
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

export default Konflikte;
