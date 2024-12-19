import Shared from "./shared";

class Wochentage extends Shared {
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
      "Einteilungen absteigend",
      "Absteigend nach Einteilungen",
      ["Wochentage", "Wochenenden"],
      true,
      false
    );
    this.addToSort(
      "Einteilungen aufsteigend",
      "Aufsteigend nach Einteilungen",
      ["Wochentage", "Wochenenden"],
      false,
      false
    );
    ["Wochentage", "Wochenenden", "Feiertage"].forEach((name) => {
      this.addToSort(
        `${name} absteigend`,
        `Absteigend nach ${name}-Einteilungen`,
        [name],
        true,
        false
      );
      this.addToSort(
        `${name} aufsteigend`,
        `Aufsteigend nach ${name}-Einteilungen`,
        [name],
        false,
        false
      );
    });
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
    if (this?._statistiken?.mitarbeiterWochentageDPLBar) {
      super.createData(this._statistiken.mitarbeiterWochentageDPLBar(
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
    this.createNotStackedTooltip([{
      dataKeys: ["Wochentage", "Wochenenden"],
      label: "Einteilungen"
    }]);
  }
}

export default Wochentage;
