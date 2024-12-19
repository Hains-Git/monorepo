import Basic from '../../../models/basic'
import Data from '../../../models/rotationsplanung/data/data'
import Timeline from '../../../models/rotationsplanung/timeline';
import {apiData} from '../../mockdata/rotationsplan/data';

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
  let timeline = null;

  beforeEach(() => {
    timeline = new Timeline({
      curMonth:6,
      curYear:2022,
      initialColumnWidth:250,
      rangeMonths:4,
      rangeWidth:[250,600],
      years:{
        2022:{
          months:[2,3,4,5,6,7,8,9,10]
        }
      },
      zoomVal:50
    });
    const mockMethod = jest.fn()
      .mockResolvedValue({rotationen:[]})
    timeline.hainsApi.api = mockMethod;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Instances", () => {
    test("instance of timeline", () => {
      expect(timeline).toBeInstanceOf(Timeline);
      expect(timeline).toBeInstanceOf(Basic);
    });

    test("initial props on timeline", () => {
      expect(timeline.countMonth).toBe(3);
      expect(timeline.fullWidth).toBe(2250);
      expect(timeline.todayMonth).toBe(6);
      expect(timeline.todayYear).toBe(2022);
      expect(timeline).toHaveProperty("renderYears");
      expect(timeline.renderYears).not.toHaveProperty("2021");
      expect(timeline.renderYears[2022].months).toContain(2,3,4,5,6,7,8,9,10);
    });
  });


  const getMonthByMonthPos = key => {
    return timeline.monthsPositions.find(monthPos => monthPos.month.key === key);
  }

  describe("General tests", () => {
    beforeEach(() => {
      timeline.cctScroll = {
        clientWidth:2212,
        offsetWidth:2212,
        scrollLeft:0,
        scrollLeftMax:0,
        scrollWidth:3001
      };
      // const data = new Data(appModelRotationsplan.page.data);
      // appModelRotationsplan.page.data = data;
    });
    test("fillContingentIds", () => {
      timeline.fillContingentIds();
      expect(timeline.contingentIds).toEqual([18,21]);
    });
    test("fillEmployeeIds", () => {
      timeline.fillEmployeeIds();
      expect(timeline.employeeIds).toEqual([419,472,506,585,999]);
    });
    describe("addRotationToTimeline", () => {
      const rotation = apiData.rotationen[2555];
      const rotationen = { 2555: rotation }
      
      test("add rotation to contingent view", () => {
        timeline._pageData.addNewRotationenToContingent = jest.fn();
        timeline.addRotationToTimeline(rotation);
        expect(timeline._pageData.addNewRotationenToContingent)
          .toHaveBeenCalledWith(rotationen);
      });
      test("add rotation to employee view", () => {
        timeline._pageData.addNewRotationenToContingent = jest.fn();
        timeline._pageData.addNewRotationenToEmployee = jest.fn();
        timeline.view = "mitarbeiter";
        timeline.addRotationToTimeline(rotation);
        expect(timeline._pageData.addNewRotationenToEmployee).toHaveBeenCalledWith(rotationen);
        expect(timeline._pageData.addNewRotationenToContingent).not.toHaveBeenCalled();
      });
    });
    describe("removeRotationFromTimeline", () => {
      const rotation = apiData.rotationen[2555];

      test("remove rotation from contingent view", () => {
        timeline._pageData.removeRotationFromContingent = jest.fn();
        timeline.removeRotationFromTimeline(rotation);
        expect(timeline._pageData.removeRotationFromContingent).toHaveBeenCalledWith(rotation);
      });
      test("remove rotation from employee view", () => {
        timeline.view = "mitarbeiter";
        timeline._pageData.removeRotationFromEmployee = jest.fn();
        timeline._pageData.removeRotationFromContingent = jest.fn();
        timeline.removeRotationFromTimeline(rotation);
        expect(timeline._pageData.removeRotationFromContingent).not.toHaveBeenCalled();
        expect(timeline._pageData.removeRotationFromEmployee).toHaveBeenCalledWith(rotation);
      });
    });
    describe("filter employees where no rotation found", () => {
      test("should get all employees where no rotation found in the next 2 months", () => {
        const rotationen = {
          1:{id:1, vonZahl:20220501, bisZahl:20221031, mitarbeiter_id:1},
          2:{id:2, vonZahl:20220501, bisZahl:20220731, mitarbeiter_id:2},
          3:{id:3, vonZahl:20220701, bisZahl:20220931, mitarbeiter_id:3},
          4:{id:4, vonZahl:20220901, bisZahl:20221031, mitarbeiter_id:4},
          5:{id:5, vonZahl:20220801, bisZahl:20221031, mitarbeiter_id:5},
          6:{id:6, vonZahl:20220201, bisZahl:20221031, mitarbeiter_id:6},
          7:{id:7, vonZahl:20220501, bisZahl:20221131, mitarbeiter_id:7},
          8:{id:8, vonZahl:20220101, bisZahl:20221231, mitarbeiter_id:8}
        };
        const mitarbeiter = {
          1:{id:1, aktiv:true},
          2:{id:2, aktiv:true},
          3:{id:3, aktiv:true},
          4:{id:4, aktiv:true},
          5:{id:5, aktiv:true},
          6:{id:6, aktiv:true},
          7:{id:7, aktiv:true},
          8:{id:8, aktiv:true}
        };

        expect(timeline.getEmployeeIDsOFNoRotation(rotationen, mitarbeiter)).toEqual(
          expect.arrayContaining([2,3])
        );

      });
    });
  });

  describe("Test for smaller displays", () => {
    beforeEach(() => {
      timeline.cctScroll = {
        clientWidth:1444,
        offsetWidth:1444,
        scrollLeft:0,
        scrollLeftMax:0,
        scrollWidth:2251
      };
    });

    describe("getScrollAmount", () => {
      test("should return amount of scrolling to center current month", () => {
        expect(timeline.getScrollAmount()).toBe(403);
      });
    });
    describe("isCurTimelineWSmallerThanDisplay", () => {
      test("should return false", () => {
        expect(timeline.isCurTimelineWSmallerThanDisplay()).toBeFalsy();
      });
    });
    describe("renderMonthsOnDisplayWidth", () => {
      test("should not render months on display width", () => {
        timeline.renderMonthsOnDisplayWidth();
        expect(timeline.fullWidth).toBe(2250);
        expect(timeline.monthsPositions).toHaveLength(9);
      });
    });
    describe("renderMonths", () => {
      test("should render prev months", () => {
        let month = getMonthByMonthPos("2022-april");
        expect(timeline.renderMonths(month, "prev")).toBeTruthy();
        expect(timeline.monthsPositions).toHaveLength(12);
      });
      test("should render next months", () => {
        let month = getMonthByMonthPos("2022-october");
        expect(timeline.renderMonths(month, "next")).toBeTruthy();
        expect(timeline.monthsPositions).toHaveLength(12);
        expect(getMonthByMonthPos("2023-january")).toBeTruthy(),
        expect(getMonthByMonthPos("2023-february")).toBeTruthy();

        month = getMonthByMonthPos("2023-january");
        expect(timeline.renderMonths(month, "next")).toBeTruthy();
        expect(timeline.monthsPositions).toHaveLength(15);
      });
    });
    describe("renderMonthsOnDisplayWidth",() => {
      test("should not render months", () => {
        timeline.renderMonthsOnDisplayWidth();
        expect(timeline.monthsPositions).toHaveLength(9);
      });
    });
  });

  describe("Test for larger displays", () => {
    beforeEach(() => {
      timeline.cctScroll = {
        clientWidth:2212,
        offsetWidth:2212,
        scrollLeft:0,
        scrollLeftMax:0,
        scrollWidth:3001
      };
    });

    describe("getScrollAmount", () => {
      test("should return amount of scrolling to center current month", () => {
        expect(timeline.getScrollAmount()).toBe(19);
        timeline.renderMonthsOnDisplayWidth();
        expect(timeline.getScrollAmount()).toBe(769);
      });
    });

    describe("isCurTimelineWSmallerThanDisplay", () => {
      test("should return false", () => {
        expect(timeline.isCurTimelineWSmallerThanDisplay()).toBeFalsy();
      });
      test("should return true", () => {
        const timeline2 = new Timeline({
          curMonth:6,
          curYear:2022,
          initialColumnWidth:150,
          rangeMonths:4,
          rangeWidth:[250,600],
            years:{
              2022:{
                months:[2,3,4,5,6,7,8,9,10]
              }
            },
            zoomVal:50
        });
        timeline2.cctScroll = { offsetWidth:2212 };
      });
    });

    describe("renderMonthsOnDisplayWidth", () => {
      test("should render months on display width", () => {
        timeline.renderMonthsOnDisplayWidth();
        expect(timeline.fullWidth).toBe(3750);
        expect(timeline.monthsPositions).toHaveLength(15);
        expect(timeline.renderYears[2021].months).toEqual([11]);
        expect(timeline.renderYears[2022].months).toEqual([0,1,2,3,4,5,6,7,8,9,10,11]);
        expect(timeline.renderYears[2023].months).toEqual([0,1]);
      });
    });

  });

});
