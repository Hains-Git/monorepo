import Shared from "./shared";

class Nachtdienste extends Shared {
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
      "Nachtdienste absteigend",
      "Absteigend nach Nachtdiensten",
      ["Nachtdienste"],
      true,
      false
    );
    this.addToSort(
      "Nachtdienste aufsteigend",
      "Aufsteigend nach Nachtdiensten",
      ["Nachtdienste"],
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
    if (this?._statistiken?.mitarbeiterNachtdienstEinteilungenBar) {
      super.createData(this._statistiken.mitarbeiterNachtdienstEinteilungenBar(
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
    this.createDataSetting("Nachtdienste", "Nachtdienste", 0);
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    this.createNotStackedTooltip();
  }
}

export default Nachtdienste;
