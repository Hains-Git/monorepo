import Bedarfeintrag from "../../models/apimodels/bedarfeintrag";
import Basic from "../../models/basic";
import { clearAppModelFromBasic, createAppModel } from "../mockdata/appmodel";

beforeAll(() => {
  clearAppModelFromBasic();
});

const bedarfeintraege = {
  "990947": {
      "id": 990947,
      "tag": "2022-09-16",
      "dienstplanbedarf_id": 12,
      "po_dienst_id": 32,
      "dienstbedarf_id": 8,
      "dienstverteilungstyp_id": 1,
      "bereich_id": 68,
      "verteilungscode": "2",
      "is_block": true,
      "first_entry": 990947,
      "min": 1,
      "opt": 0,
      "ausgleich_tage": 2,
      "kostenstelle_id": 2
  },
  "990948": {
      "id": 990948,
      "tag": "2022-09-17",
      "dienstplanbedarf_id": 12,
      "po_dienst_id": 32,
      "dienstbedarf_id": 8,
      "dienstverteilungstyp_id": 1,
      "bereich_id": 68,
      "verteilungscode": "2",
      "is_block": true,
      "first_entry": 990947,
      "min": 1,
      "opt": 0,
      "ausgleich_tage": 2,
      "kostenstelle_id": 2
  },
  "991547": {
      "id": 991547,
      "tag": "2022-09-04",
      "dienstplanbedarf_id": 12,
      "po_dienst_id": 61,
      "dienstbedarf_id": 66,
      "dienstverteilungstyp_id": 1,
      "bereich_id": 79,
      "verteilungscode": "2",
      "is_block": false,
      "first_entry": 991547,
      "min": 1,
      "opt": 1,
      "ausgleich_tage": 0,
      "kostenstelle_id": 2
  }
}

const appModel = createAppModel({
  data: {
    bereiche: {
      68: {}
    },
    dienstverteilungstypen: {
      1: {}
    },
    kostenstellen: {
      2: {}
    },
    po_dienste: {
      32: {}
    }
  },
  page: {
    data: {
      bedarfe: {
        8: {
          arbeitszeitverteilung: {
            dienstgruppe: {},
            preDienstgruppe: {},
            std: 10.0,
            pre_std: 15.4,
            pre_ueberschneidung_minuten: 30.2,
          }
        }
      },
      bedarfseintraege: {
        990947: {
          tag: "2022-09-16",
          // Notwendig für einige der Methodens
          block_ids: [990947, 990948],
          checkedBlock: [],
          felder: []
        },
        990948: {
          tag: "2022-09-17",
          block_ids: [990947, 990948],
          checkedBlock: [],
          felder: []
        }
      },
      dates: {
        "2022-09-16": {},
        "2022-09-17": {}
      },
      dienste: {
        32: {}
      },
      schichten: {
        990947: []
      }
    }
  }
});

describe("Bedarfeintrag", () => {
  const data = bedarfeintraege[990947];
  const b = new Bedarfeintrag(data, appModel);
  const secondBlockBedarf = bedarfeintraege[990948];
  test("Instanceof Bedarfeintrag and Basic", () => {
    expect(b).toBeInstanceOf(Bedarfeintrag);
    expect(b).toBeInstanceOf(Basic);
  })

  describe("Getter", () => {
    const bedarf = appModel.page.data.bedarfe[b.dienstbedarf_id];
    const arbeitszeitverteilung = appModel.page.data.bedarfe[b.dienstbedarf_id].arbeitszeitverteilung;
    test("get tagzahl", () => {
      expect(b.tagzahl).toBe(20220916);
    })
  
    test("get startBedarfId", () => {
      expect(b.startBedarfId).toBe(data.first_entry);
    })
  
    test("get startBedarfsEintrag", () => {
      expect(b.startBedarfsEintrag).toBe(appModel.page.data.bedarfseintraege[b.first_entry]);
    })
  
    test("get bedarf", () => {
      expect(b.bedarf).toBe(bedarf);
    })
  
    test("get arbeitszeitverteilung", () => {
      expect(b.arbeitszeitverteilung).toBe(arbeitszeitverteilung);
    })
  
    test("get startTag", () => {
      expect(b.startTag).toBe(appModel.page.data.bedarfseintraege[b.first_entry].tag);
    })
  
    test("get dienst", () => {
      expect(b.dienst).toBe(appModel.page.data.dienste[b.po_dienst_id]);
    })

    test("get isFull", () => {
      expect(b.isFull).toBe(false);
    })
  
    test("get date", () => {
      expect(b.date).toBe(appModel.page.data.dates[b.tag]);
    })
  
    test("get schichten", () => {
      expect(b.schichten).toBe(appModel.page.data.schichten[b.id]);
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

    test("get dienstgruppe", () => {
      expect(b.dienstgruppe).toBe(arbeitszeitverteilung.dienstgruppe);
    })

    test("get preDienstgruppe", () => {
      expect(b.preDienstgruppe).toBe(arbeitszeitverteilung.preDienstgruppe);
    })

    test("get dienstgruppeStd", () => {
      expect(b.dienstgruppeStd).toBe(arbeitszeitverteilung.std);
    })

    test("get preDienstgruppeStd", () => {
      expect(b.preDienstgruppeStd).toBe(arbeitszeitverteilung.pre_std);
    })

    test("get preAcceptedUeberschneidung", () => {
      expect(b.preAcceptedUeberschneidung).toBe(arbeitszeitverteilung.pre_ueberschneidung_minuten);
    })

    test("get gesamtBedarf", () => {
      expect(b.gesamtBedarf).toBe(b.min + b.opt);
    })

    test("get lastBedarfTag", () => {
      expect(b.lastBedarfTag).toBe(secondBlockBedarf.tag);
    })
  });

  describe("Methods", () => {
    const felder = [{value: "test"}, {value: "test"}];
    const first = appModel.page.data.bedarfseintraege[b.id];
    const second = appModel.page.data.bedarfseintraege[secondBlockBedarf.id];
    const block_ids = [990947, 990948];
    const addAllFelder = (b) => {
      felder.forEach(feld => {
        if(!b.felder.includes(feld)) {
          b.felder.push(feld);
        }
      });
    };

    const addAllBlockIds = (b) => {
      block_ids.forEach(id => {
        if(!b.block_ids.includes(id)) {
          b.block_ids.push(id);
        }
      });
    };

    const removeAllFelder = (b) => {
      while(b.felder.length > 0) {
        b.felder.pop();
      }
    };

    const removeAllBlockIds = (b) => {
      while(b.block_ids.length > 0) {
        b.block_ids.pop();
      }
    };

    test("isBlockChecked(index)", () => {
      // Untersucht den Startbedarf nach checkedBlock
      const oldChecked = first.checkedBlock;
      first.checkedBlock = [];
      expect(b.isBlockChecked(0)).toBe(false);
      first.checkedBlock = [true, false, true];
      expect(b.isBlockChecked(0)).toBe(true);
      expect(b.isBlockChecked(1)).toBe(false);
      expect(b.isBlockChecked(2)).toBe(true);
      first.checkedBlock = oldChecked
    })

    describe("Setup and teardown", () => {
      const cbTrue = jest.fn((f) => true);
      const cbFalse = jest.fn((f) => false);
      beforeAll(() => {
        addAllFelder(b);
        addAllFelder(first);
        addAllFelder(second);
      });
      afterAll(() => {
        removeAllFelder(b);
        removeAllFelder(first);
        removeAllFelder(second);
      });

      test("eachFeldInBlock(feld, callback)", () => {
        expect(b.eachFeldInBlock(felder[0], cbFalse)).toBe(true);
        expect(cbFalse).toHaveBeenCalledWith(felder[0]);
        expect(cbFalse).toHaveBeenCalledWith(felder[1]);
        expect(cbFalse).toHaveBeenCalledTimes(2);
        expect(b.eachFeldInBlock(felder[1], cbTrue)).toBe(false);
        expect(cbTrue).toHaveBeenCalledTimes(1);
        expect(cbTrue).toHaveBeenCalledWith(felder[0]);
      });
    });

    describe("setup and teardown", () => {
      const firstFeld = felder[0];
      beforeEach(() => {
        felder[0] = firstFeld;
        addAllFelder(b);
        addAllFelder(second);
        addAllFelder(first);
      });
      afterEach(() => {
        removeAllFelder(b);
        removeAllFelder(second);
        removeAllFelder(first);
      });

      test("checkFelderEintraege(feld)", () => {
        expect(b.checkFelderEintraege()).toBe(false);
        expect(b.checkFelderEintraege(firstFeld)).toBe(true);
        // Felder mit index 0 haben nicht den gleichen value
        felder[0] = {value: "blabla"};
        removeAllFelder(second);
        addAllFelder(second);
        expect(b.checkFelderEintraege(firstFeld)).toBe(false);
      });
    });

    describe("setup and teardown", () => {
      beforeEach(() => {
        addAllBlockIds(b);
        addAllFelder(b);
        addAllFelder(second);
        addAllFelder(first);
        first.isBlockChecked = jest.fn(() => true);
        first._update = jest.fn();
      });
      afterEach(() => {
        removeAllBlockIds(b);
        removeAllFelder(b);
        removeAllFelder(second);
        removeAllFelder(first);
        delete first.isBlockChecked;
        delete first._update;
      });

      test("setBlockChecked(index = 0, checked = false)", () => {
        expect(b.setBlockChecked(0, false)).toBe(false);
        expect(b.setBlockChecked(0, true)).toBe(true);
      });
    });

    describe("setupt and teardown", () => {
      let mockSetBlockChecked;
      beforeEach(() => {
        mockSetBlockChecked = jest.spyOn(Bedarfeintrag.prototype, "setBlockChecked");
        mockSetBlockChecked.mockImplementation(() => true);
      });
      afterEach(() => {
        mockSetBlockChecked.mockRestore();
      });

      test("addFeld(feld)", () => {
        expect(b.addFeld(felder[0])).toEqual([felder[0]]);
        expect(b.addFeld(felder[0])).toEqual([felder[0]]);
        expect(mockSetBlockChecked).toHaveBeenCalledWith(0, true);
        expect(mockSetBlockChecked).toHaveBeenCalledTimes(1);
        expect(b.addFeld(felder[1])).toEqual([felder[0], felder[1]]);
        expect(mockSetBlockChecked).toHaveBeenCalledWith(1, true);
        expect(mockSetBlockChecked).toHaveBeenCalledTimes(2);
      });
    });

    describe("setup and teardown", () => {
      beforeEach(() => {
        addAllFelder(b);
      });
      afterEach(() => {
        removeAllFelder(b);
      });
      test("removeFeld(feld)", () => {
        addAllFelder(b);
        expect(b.removeFeld(felder[0])).toEqual([felder[1]]);
        expect(b.removeFeld(felder[1])).toEqual([]);
      });
    });

    test("addToBlock(beId)", () => {
      expect(b.addToBlock(b.id)).toEqual([b.id]);
      expect(b.addToBlock(secondBlockBedarf.id)).toEqual([b.id, secondBlockBedarf.id]);
      // Do not add if already in block
      expect(b.addToBlock(secondBlockBedarf.id)).toEqual([b.id, secondBlockBedarf.id]);
    })

    test("getBlockTage()", () => {
      expect(b.getBlockTage()).toEqual([b.tag, secondBlockBedarf.tag]);
    })

    test("resetAttributes()", () => {
      expect(b.resetAttributes()).toEqual({
        block_ids: [],
        felder: [],
        checkedBlock: [],
      });
    })
  })
});