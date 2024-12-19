import Basic from '../../../models/basic'
import ColumnYear from '../../../models/rotationsplanung/columnYear';

import {
  clearAppModelFromBasic, 
  initAppModelRotationsplanToBasic, 
  appModelRotationsplan,
} from "../../mockdata/rotationsplan/appModel"

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});
const appModel = {};

describe("Whitebox testing", () => {

  // let columnYear = null;
  // beforeEach(() => {
  //   columnYear = new ColumnYear(2021, 250, 0, 50, [11], 0, [250, 650], appModel);
  // });

  describe("Instances", () => {
    const columnYear = new ColumnYear(2021, 250, 0, 50, [11], 0, [250, 650], appModel);
    test("instance of columnYear", () => {
      expect(columnYear).toBeInstanceOf(ColumnYear);
      expect(columnYear).toBeInstanceOf(Basic);
    });
  });

  describe("Methods", () => {
    
    describe("getMonth", () => {
      const columnYear = new ColumnYear(2021, 250, 0, 50, [11], 0, [250, 650], appModel);
      test("should return only month december of year 2021", () => {
        expect(columnYear.getMonth(11, 0)).toEqual(
          expect.objectContaining({
            left:0,
            columnIndex:0,
            columnWidth:250,
            columnKey:"2021-11",
            key:"2021-december"
          })
        );
      });
    });

    describe("column year with more than on month", () => {
      const columnYear = new ColumnYear(2022, 250, 0, 50, [0,1,2,3,4,5,6,7,8,9,10], 1, [250, 650], appModel);

      describe("getMonth", () => {
        test("should return month april from year 2022", () => {
          expect(columnYear.getMonth(3,3)).toEqual(
            expect.objectContaining({
              left:1000,
              columnIndex:4,
              columnWidth:250,
              columnKey:"2022-3",
              key:"2022-april"
            })
          );
        });
      });

      describe("calculateNewDayWidth", () => {
        test("should return day width by given month", () => {
          const april = columnYear.getMonth(3,3);
          const may = columnYear.getMonth(4,4);
          expect(columnYear.calculateNewDayWidth(april)).toBe(8.33);
          expect(columnYear.calculateNewDayWidth(may)).toBe(8.06);
        });
      });

      describe("calculateMonthProps", () => {
        test("should calculate new props [monthWidth, yearwidth, columnLeft]", () => {
          const cctScroll = {scrollLeft: 769 }
          columnYear.calculateMonthProps(5, "zoom-in", cctScroll);
          expect(columnYear.yearWidth).toEqual(3300);
          expect(columnYear.months["april"].columnWidth).toBe(300);
          expect(columnYear.months["april"].left).toBe(1200);
        });
      });

    })

  });
  
});
