import Rotationsplan from '../../../models/pages/rotationsplan.model'
import Data from '../../../models/rotationsplanung/data/data';
import Basic from '../../../models/basic'

import {
  clearAppModelFromBasic, 
  initAppModelRotationsplanToBasic, 
  appModelRotationsplan,
  createInitialYears
} from "../../mockdata/rotationsplan/appModel"

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});

describe("Whitebox testing", () => {

  describe("Instances", () => {
    test("instance of Data", () => {
      const data = new Data({});
      expect(data).toBeInstanceOf(Data);
      expect(data).toBeInstanceOf(Basic);
    })
  });

  describe("Methods", () => {
    let data = null;

    beforeAll(() => {
      data = new Data(appModelRotationsplan.page.data);
      for(let id in data.rotationen) {
        // add dynamicly function to appmodel basicmethods get kontingent
        // weil in rotation.js mit this.kontingent.pushRotationId zugegriffen wird
        data.rotationen[id].kontingent["pushRotationId"] = () => {};
        data.rotationen[id].mitarbeiter["pushRotationId"] = () => {};
      }
    });

    describe("test for data in constructor", () => {
      test("should have kontingente", () => {
        expect(data.kontingente).toHaveProperty("18");
        expect(data.kontingente).toHaveProperty("21");
      });
      test("should have rotationen", () => {
        expect(data.rotationen).toHaveProperty("2814");
        expect(data.rotationen).toHaveProperty("2850");
        expect(data.rotationen).toHaveProperty("9999");
      });
      test("should have mitarbeiter", () => {
        expect(data.mitarbeiter).toHaveProperty("472");
        expect(data.mitarbeiter).toHaveProperty("585");
        expect(data.mitarbeiter).toHaveProperty("999");
      });
    });

    describe("isCurrentEmployeeActive", () => {
      test("should return false or true", () => {
        expect(data.isCurrentEmployeeActive(data.rotationen[2814])).toBeTruthy();
        expect(data.isCurrentEmployeeActive(data.rotationen[9999])).toBeFalsy();
      });
    });

    describe("addNewRotationenToContingent", () => {
      const newRotation = {
        2892: {
          id:2892,
          mitarbeiter_id:506,
          kontingent_id:18,
          von:"2022-07-31",
          vonZahl:20220731,
          bis:"2022-10-31",
          bisZahl:20221031,
          prioritaet:null,
        }
      };
      test("should add new rotation to Kontingente", () => {
        data.addNewRotationenToContingent(newRotation);
        expect(data.rotationen).toHaveProperty("2814");
        expect(data.rotationen).toHaveProperty("2892");
      });

      test("should add new rotation and remove old once from Kontigent", () => {
        data.addNewRotationenToContingent(newRotation, "new");
        expect(data.rotationen).toHaveProperty("2892");
        expect(data.rotationen).not.toHaveProperty("2814");
      });
    });

    describe("addNewRotationenToEmployee", () => {
      const newRotation = {
        2827: {
          id:2827,
          mitarbeiter_id:472,
          kontingent_id:18,
          von:"2022-02-28",
          vonZahl:20220228,
          bis:"2022-06-30",
          bisZahl:20220630,
          prioritaet:null,
        }
      };
      test("should add new rotation to Mitarbeiter", () => {
        data.addNewRotationenToEmployee(newRotation);
        expect(data.rotationen).toHaveProperty("2827");
        expect(data.rotationen).toHaveProperty("2892");
      });

      test("should add new rotation and remove old once from Mitarbeiter", () => {
        data.addNewRotationenToEmployee(newRotation, "new");
        expect(data.rotationen).toHaveProperty("2827");
        expect(data.rotationen).not.toHaveProperty("2892");
      });

    });

    describe("removeRotationFromContingent", () => {
      test("should remove rotation from kontingent", () => {
        const rotationToRemove = data.rotationen[2827];
        data.removeRotationFromContingent(rotationToRemove);
        expect(data.rotationen).toEqual({});
      });

    });

    describe("removeRotationFromEmployee", () => {
      test("should remove rotation from employee", () => {
        const initRotationen = {
          2814: {
            id:2814,
            mitarbeiter_id:472,
            kontingent_id:18,
            von:"2022-06-30",
            vonZahl:20220630,
            bis:"2022-09-30",
            bisZahl:20220930,
            prioritaet:null,
          },
          2850: {
            id:2850,
            mitarbeiter_id:585,
            kontingent_id:21,
            von:"2022-05-01",
            vonZahl:20220501,
            bis:"2022-08-31",
            bisZahl:20220831,
            prioritaet:null,
          },
          9999: {
            id:9999,
            mitarbeiter_id:999,
            kontingent_id:18,
            von:"2022-06-01",
            vonZahl:20220601,
            bis:"2022-06-30",
            bisZahl:20220630,
            prioritaet:null,
          },
        }
        data.addNewRotationenToEmployee(initRotationen);
        const rotationToRemove = data.rotationen[9999];
        data.removeRotationFromEmployee(rotationToRemove);
        expect(data.rotationen).toHaveProperty("2814");
        expect(data.rotationen).toHaveProperty("2850");
        expect(data.rotationen).not.toHaveProperty("9999");
      });
    });

  });

});
