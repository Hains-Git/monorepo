import {apiData} from '../../mockdata/rotationsplan/data';
import Helper from '../../../models/rotationsplanung/helper';
import RotationsplanRotation from '../../../models/rotationsplanung/data/rotation';

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
  describe("Methods", () => {
    const testApiRotationen = {
      2751 : apiData.rotationen[2751],
      2752 : apiData.rotationen[2752],
      2864 : apiData.rotationen[2864],
      2677 : apiData.rotationen[2677],
      2859 : apiData.rotationen[2859],
      2669 : apiData.rotationen[2669]
    }
    
    const testRotationen = {};
    for(const id in testApiRotationen){
      testRotationen[id] = new RotationsplanRotation(testApiRotationen[id], {});
    }

    let helper = null;
    beforeEach(() => {
      helper = new Helper([2669,2751,2752,2677,2859,2864], appModelRotationsplan.page.timeline);
    });

    describe("sortObj", () => {
      test("sort rotationen by bis date :[]", () => {
        expect(helper.sortObj(testRotationen)).toEqual([2751,2752,2677,2669,2859,2864]);
      });
    });

    describe("createFirstItemInTmp", () => {
      test("create first rotation in tmp helper", () => {
        expect(helper.tmp).toEqual([]);
        helper.createFirstItemInTmp(testRotationen);
        expect(helper.tmp).toHaveLength(1);
      });
    });


    // describe("sortByPrio", () => {
    //   test("sort rotationen by prio :[]", () => {
    //     console.log(helper.rotations_id)
    //     const test = {
    //       2677: {
    //         id:2677,
    //         prioritaet:0,
    //         bisZahl:20220417
    //       },
    //       2751: {
    //         id:2751,
    //         prioritaet:0,
    //         bisZahl:20220403
    //       },
    //       2752: {
    //         id:2752,
    //         prioritaet:0,
    //         bisZahl:20220417
    //       },
    //       2669: {
    //         id:2669,
    //         prioritaet:0,
    //         bisZahl:20220419
    //       },
    //       2859: {
    //         id:2859,
    //         prioritaet:0,
    //         bisZahl:20220508
    //       },
    //       2864: {
    //         id:2864,
    //         prioritaet:1,
    //         bisZahl:20220508
    //       },
    //     }
    //     helper.sortByPrio(test);
    //     console.log(helper.rotations_id)
    //   });
    // });

    describe("isNewDiffSmaller", () => {
      test("is new difference smaller than cur difference", () => {
        expect(helper.isNewDiffSmaller(200,200)).toBeFalsy();
        expect(helper.isNewDiffSmaller(200,100)).toBeFalsy();
        expect(helper.isNewDiffSmaller(100,200)).toBeTruthy();
        expect(helper.isNewDiffSmaller(-10,20)).toBeTruthy();
        expect(helper.isNewDiffSmaller(-10,-20)).toBeTruthy();
        expect(helper.isNewDiffSmaller(-20,-10)).toBeFalsy();
      });
    });

    describe("calculateUiTopPos", () => {
      test("should return number from 0 to ...", () => {
        helper.sortObj(testRotationen);
        helper.createFirstItemInTmp(testRotationen);
        expect(helper.calculateUiTopPos(testRotationen[2751])).toBe(0);
        expect(helper.calculateUiTopPos(testRotationen[2752])).toBe(1);
        expect(helper.calculateUiTopPos(testRotationen[2677])).toBe(2);
        expect(helper.calculateUiTopPos(testRotationen[2669])).toBe(3);
        expect(helper.calculateUiTopPos(testRotationen[2859])).toBe(1);
        expect(helper.calculateUiTopPos(testRotationen[2864])).toBe(2);
      });
    });

    describe("getLeftPosition", () => {
      test("should give left position of rotation", () => {
        expect(helper.getLeftPosition(2022, "may", 1, true)).toBe(1250);
        expect(helper.getLeftPosition(2022, "may", 1, false)).toBe(1258.06);
        expect(helper.getLeftPosition(2022, "may", 4, true)).toBe(1274.18);
      });
    });

    describe("getRightPosition", () => {
      test("should give right position of rotation", () => {
        expect(helper.getRightPosition(["2022", "05", "31"], "may")).toBe(1499.14);
        expect(helper.getRightPosition(["2022", "05", "18"], "may")).toBe(1603.92);
      });
    });

    describe("getUiPositions", () => {
      test("should give the positions of rotation [left, right, top]", () => {
        helper.sortObj(testRotationen);
        helper.createFirstItemInTmp(testRotationen);
        const [left, right] = helper.getUiPositions(testRotationen[2677]);
        expect([left, right]).toEqual([959.56, 1857.39]);
      });
    });

  }); 
});
