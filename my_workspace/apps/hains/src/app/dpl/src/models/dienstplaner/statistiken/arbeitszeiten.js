import Shared from "./shared";

class Arbeitszeiten extends Shared {
  constructor(index, parent, appModel = false) {
    super(index, parent, appModel);
    this.init();
  }

  get emptyAsRegeldienst(){
    return !!this?._user?.dienstplanTableSettings?.empty_as_regeldienst;
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
    console.log(this);
  }

  /**
   * Fügt das Menü für die Sortierungen hinzu
   */
  addSorting() {
    const keys = ["Volldienst", "Bereitschaft", "Rufbereitschaft"];
    if(this.emptyAsRegeldienst) {
      keys.push("Default Volldienst");
    }
    this.addToSort(
      "Gesamt absteigend",
      "Absteigend nach Gesamt-Abreitszeit (Std.)",
      keys,
      true,
      false
    );
    this.addToSort(
      "Gesamt aufsteigend",
      "Aufsteigend nach Gesamt-Abreitszeit (Std.)",
      keys,
      false,
      false
    );
    keys.forEach((name) => {
      this.addToSort(
        `${name} absteigend`,
        `Absteigend nach ${name}-Abreitszeit (Std.)`,
        [name],
        true,
        false
      );
      this.addToSort(
        `${name} aufsteigend`,
        `Aufsteigend nach ${name}-Abreitszeit (Std.)`,
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
    const emptyAsRegeldienst = this.emptyAsRegeldienst;
    if (this?._statistiken?.mitarbeiterArbeitszeitenBar) {
      super.createData(this._statistiken.mitarbeiterArbeitszeitenBar(
        this?._mitarbeiter,
        ({mitarbeiter, feld, date}) => (
          !this.onlyMainZeitraum
          || feld?.date?.isInMainZeitraum 
          || date?.isInMainZeitraum
        ) && (feld 
            ? this.isInFilter(mitarbeiter, feld) 
            : true),
          emptyAsRegeldienst,
          true
      ));
    }
  }

  /**
   * Erstellt die Farben für die Daten
   */
  createDataSettings() {
    this.createDataSettingsStacked();
    if(this?.chart?.dataSettings?.Soll) {
      this.chart.dataSettings.Soll.stackedId = "Soll";
      this.chart.dataSettings.Soll.type = "scatter";
      this.chart.dataSettings.Soll.fill = "#000000";
      this.chart.yAxis.axisKey = "Soll";
    }
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    const keys = ["Volldienst", "Bereitschaft", "Rufbereitschaft"];
    if(this.emptyAsRegeldienst) {
      keys.push("Default Volldienst");
    }
    this.createNotStackedTooltip([{
      dataKeys: keys,
      label: "Gesamt"
    }]);
  }
}

export default Arbeitszeiten;
