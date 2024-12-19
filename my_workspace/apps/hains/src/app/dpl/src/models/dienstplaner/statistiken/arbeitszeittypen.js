import Shared from "./shared";

class Arbeitszeittypen extends Shared {
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
    const keys = this?._konfliktArbeitszeittypen?.map
      ? this._konfliktArbeitszeittypen.map((typ) => typ.name)
      : [];
    this.addToSort(
      "Gesamt absteigend",
      "Absteigend nach Gesamt",
      keys,
      true,
      false
    );
    this.addToSort(
      "Gesamt aufsteigend",
      "Aufsteigend nach Gesamt",
      keys,
      false,
      false
    );
    keys.forEach((key) => {
      this.addToSort(
        `${key} absteigend`,
        `Absteigend nach ${key}`,
        [key],
        true,
        false
      );
      this.addToSort(
        `${key} aufsteigend`,
        `Aufsteigend nach ${key}`,
        [key],
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
    if (this?._statistiken?.mitarbeiterArbeitszeitenTypenBar) {
      super.createData(this._statistiken.mitarbeiterArbeitszeitenTypenBar(
        this?._mitarbeiter,
        this?._konfliktArbeitszeittypen,
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
    this.createDataSettingsStacked();
    this?._konfliktArbeitszeittypen?.forEach?.((typ) => {
      const key = typ.name;
      const min = typ?.min || 0;
      const max = typ?.max || 0;
      this.createYReferenceLine(max, key, "");
      this.createYReferenceLine(min, key, "");
      if (this.chart.dataSettings[key].label && (min > 0 || max > 0)) {
        const add = [];
        if (min > 0) add.push(`Min: ${min}`);
        if (max > 0) add.push(`Max: ${max}`);
        this.chart.dataSettings[key].label += ` (${add.join(", ")})`;
      }
    });
  }

  /**
   * Erstellt das Tooltip für den Graphen
   */
  createToolTip() {
    this.createNotStackedTooltip([{
      dataKeys: this?._konfliktArbeitszeittypen?.map
        ? this._konfliktArbeitszeittypen.map((typ) => typ.name)
        : [],
      label: "Gesamt"
    }]);
  }
}

export default Arbeitszeittypen;
