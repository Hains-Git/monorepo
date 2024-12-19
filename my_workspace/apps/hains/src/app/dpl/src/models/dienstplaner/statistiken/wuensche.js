import Shared from "./shared";

class Wuensche extends Shared {
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
      const wuensche = payload?.wuensche;
      const infoEl = this.createInfoEl(() => {
        const info = {
          mainInfos: {
            name: { value: payload?.name || "", label: "Typ" },
            anzahl: { value: payload?.Anzahl.toString() || "", label: "Anzahl" }
          },
          popupInfos: {
            Wuensche: {
              value: {}, label: "Wünsche", sorting: "asc", ignore: true
            }
          }
        };
        // Deaktivieren, da dies ungewöhnlich lange dauert
        // wuensche?.forEach?.((w) => {
        //   info.popupInfos.Wuensche.ignore = false;
        //   info.popupInfos.Wuensche.value[w.id] = w._popupInfo;
        // });
        return info;
      }, `Wünsche: ${payload.name}`);
      infoEl.setInfo();
    };
  }

  /**
   * Erstellt die Daten
   */
  createData() {
    if (this?._statistiken?.wuenscheErfuelltBar) {
      super.createData(this._statistiken.wuenscheErfuelltBar(
        this?._wuensche,
        (mitarbeiter, wunsch) => (!this.onlyMainZeitraum
          || wunsch?.date?.isInMainZeitraum)
          && this.isInFilter(mitarbeiter, wunsch)
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

export default Wuensche;
