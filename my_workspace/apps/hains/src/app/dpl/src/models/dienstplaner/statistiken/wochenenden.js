import Shared from "./shared";

class Wochenenden extends Shared {
  constructor(index, parent, appModel = false) {
    super(index, parent, appModel);
    this.init();
  }

  /**
   * Initialisiert die Statistik
   */
  init() {
    this.addSorting();
    this.createData();
    this.createDataSettings();
    this.createToolTip();
    this.chart.onClick = (data) => {
      const mitarbeiter = data?.activePayload?.[0]?.payload?.mitarbeiter;
      mitarbeiter?.setInfo && mitarbeiter.setInfo();
    };
    this.setCurrentSort(0);
  }

  /**
   * Fügt das Menü für die Sortierungen hinzu
   */
  addSorting() {
    this.addToSort(
      "Wochenenden absteigend",
      "Absteigend nach Wochenenden",
      ["Wochenenden"],
      true,
      false
    );
    this.addToSort(
      "Wochenenden aufsteigend",
      "Aufsteigend nach Wochenenden",
      ["Wochenenden"],
      false,
      false
    );
    this.addToSort(
      "Alphabetisch",
      "Alphabetisch nach Mitarbeiter",
      ["name"],
      false,
      true
    );
  }

  /**
   * Erstellt die Daten
   */
  createData() {
    if (this?._statistiken?.mitarbeiterWochenendenDPLBar) {
      super.createData(this._statistiken.mitarbeiterWochenendenDPLBar(
        this?._mitarbeiter,
        (mitarbeiter, einteilungsMonat) => (!this.onlyMainZeitraum
          || einteilungsMonat?.isInMainZeitraum)
          && this.isInFilter(mitarbeiter, false)
      ));
    }
  }

  /**
   * Erstellt die Farben für die Daten
   */
  createDataSettings() {
    this.createDataSetting("Wochenenden", "Wochenenden", 0);
    this.createYReferenceLine(this._MAX_WOCHENENDEN, "Wochenenden", "");
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    this.createNotStackedTooltip();
  }
}

export default Wochenenden;
