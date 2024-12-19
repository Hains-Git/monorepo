import RotationsplanRotation from '../../../models/rotationsplanung/data/rotation'
import Rotationsplan from '../../../models/pages/rotationsplan.model'
import Rotation from '../../../models/apimodels/rotation'
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
    test("instance of rotation", () => {
      const rotation = new RotationsplanRotation({}, {});
      expect(rotation).toBeInstanceOf(RotationsplanRotation);
      expect(rotation).toBeInstanceOf(Rotation);
      expect(rotation).toBeInstanceOf(Basic);
    })
  });

  describe("Methods", () => {
    const page = appModelRotationsplan.page;
    let rotationsplan = null;
    beforeAll(() => {
      const initialYears = createInitialYears();
      const props = {
        curMonth:new Date().getMonth(),
        curYear: new Date().getFullYear(),
        initialColumnWidth:250,
        rangeMonths:4,
        rangeWidth: [250, 600],
        years:initialYears,
        zoomVal:50
      }
      rotationsplan = new Rotationsplan(appModelRotationsplan.page.data, props);
      // damit appmodel Object Klassen beinhaltet
      // wie z.B. RotationsplanKontigent
      appModelRotationsplan.page = rotationsplan;
    });

    afterAll(() => {
      appModelRotationsplan.page = page;
    })

    describe("addToContingent", () => {
      test("adds rotation to Contingent", () => {
        expect(rotationsplan.data.kontingente[18].rotations_id).toEqual([]);
        rotationsplan.data.rotationen[2814].addToContingent();
        expect(rotationsplan.data.kontingente[18].rotations_id).toEqual([2814]);
        rotationsplan.data.rotationen[9999].addToContingent();
        expect(rotationsplan.data.kontingente[18].rotations_id).toEqual([2814, 9999]);
      });
    });

    describe("addToEmployee", () => {
      test("adds rotation to employee", () => {
        expect(rotationsplan.data.mitarbeiter[472].rotations_id).toEqual([]);
        rotationsplan.data.rotationen[2814].addToEmployee();
        expect(rotationsplan.data.mitarbeiter[472].rotations_id).toEqual([2814]);
      });
    });
    
  });

});
