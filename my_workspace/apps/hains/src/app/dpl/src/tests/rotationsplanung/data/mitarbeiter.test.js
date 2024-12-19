import RotationsplanMitarbeiter from '../../../models/rotationsplanung/data/mitarbeiter'
import Mitarbeiter from '../../../models/apimodels/mitarbeiter'
import Basic from '../../../models/basic'

import {
  clearAppModelFromBasic, 
  initAppModelRotationsplanToBasic, 
  appModelRotationsplan,
} from "../../mockdata/rotationsplan/appModel"

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});

describe("Whitebox testing", () => {
  
  describe("Instances", () => {
    test("instance of mitarbeiter", () => {
      const mitarbeiter = new RotationsplanMitarbeiter({});
      expect(mitarbeiter).toBeInstanceOf(RotationsplanMitarbeiter);
      expect(mitarbeiter).toBeInstanceOf(Mitarbeiter);
      expect(mitarbeiter).toBeInstanceOf(Basic);
    })
  });

  describe("Methods", () => {

    let mitarbeiter = null;
    beforeAll(() => {
      mitarbeiter = new RotationsplanMitarbeiter({});
      mitarbeiter.pushRotationId(appModelRotationsplan.page.data.rotationen[2850])
      mitarbeiter.pushRotationId(appModelRotationsplan.page.data.rotationen[2814])
      mitarbeiter.pushRotationId(appModelRotationsplan.page.data.rotationen[9999])
    });

    describe("pushRotationId", () => {
      test("push 3 rotationen", () => {
        expect(mitarbeiter.rotations_id).toHaveLength(3);
        expect(mitarbeiter.rotations_id).toEqual([2850,2814,9999]);
      })
    });

    describe("isEmployeeActive", () => {
      test("get aktiv val from employee", () => {
        expect(mitarbeiter.isEmployeeActive(585)).toBeTruthy();
        expect(mitarbeiter.isEmployeeActive(999)).toBeFalsy();
      })
    });

    
    describe("eachRotation", () => {
      test("contains rotation only active employees", () => {
        expect(mitarbeiter.eachRotation((rotation) => rotation)).toHaveLength(2)
      });

      test("contains rotations all employees", () => {
        appModelRotationsplan.page.timeline.onlyActiveEmployees = false;
        expect(mitarbeiter.eachRotation((rotation) => rotation)).toHaveLength(3);
      });
    });

    describe("sortAndSetPos", () => {
      test("set ui pos [left, right, top]", () => {
        expect(mitarbeiter.sortAndSetPos()).toStrictEqual({
          2814: {
            id:2814,
            left:1741.57,
            right:499.1,
            top:0,
          },
          2850: {
            id:2850,
            left:1250,
            right:749.14,
            top:1,
          },
          9999: {
            id:9999,
            left:1500,
            right:1249.1,
            top:0,
          },
        });
      })

    });

    describe("getHeight", () => {
      test("get kontingent height", () => {
        expect(mitarbeiter.getHeight()).toBe(2);
      });
    });


  });

});
