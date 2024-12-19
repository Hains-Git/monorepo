import Shared from "./shared";

class Einteilungen extends Shared {
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
      "Gesamt absteigend",
      "Absteigend nach Gesamt-Einteilungen",
      ["Dienstplan", "Urlaubsplan"],
      true,
      false
    );
    this.addToSort(
      "Gesamt aufsteigend",
      "Aufsteigend nach Gesamt-Einteilungen",
      ["Dienstplan", "Urlaubsplan"],
      false,
      false
    );
    ["Dienstplan", "Urlaubsplan"].forEach((name) => {
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
    if (this?._statistiken?.mitarbeiterEinteilungenBar) {
      super.createData(this._statistiken.mitarbeiterEinteilungenBar(
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
    this.createDataSettingsStacked();
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    this.createNotStackedTooltip([{
      dataKeys: ["Dienstplan", "Urlaubsplan"],
      label: "Gesamt"
    }]);
  }
}

export default Einteilungen;
