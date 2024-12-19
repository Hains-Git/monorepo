import Bedarf from "../../models/apimodels/bedarf";
import Basic from "../../models/basic";
import { createAppModel } from "../mockdata/appmodel";

const bedarfe = {
  "1": {
      "id": 1,
      "min": 1,
      "po_dienst_id": 38,
      "bereich_id": 68,
      "end_date": null,
      "dienstverteilungstyp_id": 2,
      "verteilungscode": "1",
      "opt": 0,
      "arbeitszeitverteilung_id": 2,
      "zeitraumkategories_id": 9,
      "kostenstelle_id": 3
  }
}

const appModel = createAppModel({
  data: {
    arbeitszeitverteilungen: {
      2: {}
    },
    bereiche: {
      68: {}
    },
    dienstverteilungstypen: {
      2: {}
    },
    kostenstellen: {
      3: {}
    },
    po_dienste: {
      38: {}
    },
    zeitraumkategorien: {
      9: {}
    }
  },
  page: {
    data: {
      dienste: {
        38: {}
      }
    }
  }
});

describe("Bedarf", () => {
  const b = new Bedarf(bedarfe[1], appModel);
  test("Instance of Bedarf and Basic", () => {
    expect(b).toBeInstanceOf(Bedarf);
    expect(b).toBeInstanceOf(Basic);
  });

  test("get zeitraumkategorie", () => {
    expect(b.zeitraumkategorie).toBe(appModel.data.zeitraumkategorien[b.zeitraumkategories_id]);
  })

  test("get arbeitszeitverteilung", () => {
    expect(b.arbeitszeitverteilung).toBe(appModel.data.arbeitszeitverteilungen[b.arbeitszeitverteilung_id]);
  })

  test("get dienst", () => {
    expect(b.dienst).toBe(appModel.page.data.dienste[b.po_dienst_id]);
  })

  test("get dienstverteilungstyp", () => {
    expect(b.dienstverteilungstyp).toBe(appModel.data.dienstverteilungstypen[b.dienstverteilungstyp_id]);
  })

  test("get bereich", () => {
    expect(b.bereich).toBe(appModel.data.bereiche[b.bereich_id]);
  })

  test("get kostenstelle", () => {
    expect(b.kostenstelle).toBe(appModel.data.kostenstellen[b.kostenstelle_id]);
  })
});
