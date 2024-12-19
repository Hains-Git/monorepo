import RotationsplanKontingent from '../../../models/rotationsplanung/data/kontingent'
import Kontigent from '../../../models/apimodels/kontingent'
import Basic from '../../../models/basic'

import {
  clearAppModelFromBasic, 
  initAppModelRotationsplanToBasic, 
  appModelRotationsplan
} from "../../mockdata/rotationsplan/appModel"

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("instance of kontingent", () => {
      const kontingent = new RotationsplanKontingent({});
      expect(kontingent).toBeInstanceOf(RotationsplanKontingent);
      expect(kontingent).toBeInstanceOf(Kontigent);
      expect(kontingent).toBeInstanceOf(Basic);
    })
  });

  describe("Methods", () => {
    let kontingent = null;
    beforeAll(() => {
      kontingent = new RotationsplanKontingent({});
      kontingent.pushRotationId(appModelRotationsplan.page.data.rotationen[2850])
      kontingent.pushRotationId(appModelRotationsplan.page.data.rotationen[2814])
      kontingent.pushRotationId(appModelRotationsplan.page.data.rotationen[9999])
    });

    describe("pushRotationId", () => {
      test("push 3 rotationen", () => {
        expect(kontingent.rotations_id).toHaveLength(3);
        expect(kontingent.rotations_id).toEqual([2850,2814,9999]);
      })
    });

    describe("isEmployeeActive", () => {
      test("get aktiv val from employee", () => {
        expect(kontingent.isEmployeeActive(585)).toBeTruthy();
        expect(kontingent.isEmployeeActive(999)).toBeFalsy();
      })
    });

    describe("eachRotation", () => {

      test("contains rotation only active employees", () => {
        expect(kontingent.eachRotation((rotation) => rotation)).toHaveLength(2)
      });

      test("contains rotations all employees", () => {
        appModelRotationsplan.page.timeline.onlyActiveEmployees = false;
        expect(kontingent.eachRotation((rotation) => rotation)).toHaveLength(3);
      });

    });

    describe("sortAndSetPos", () => {
      test("set ui pos [left, right, top]", () => {
        expect(kontingent.sortAndSetPos()).toStrictEqual({
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
        expect(kontingent.getHeight()).toBe(2);
      });
    })

  });

});
