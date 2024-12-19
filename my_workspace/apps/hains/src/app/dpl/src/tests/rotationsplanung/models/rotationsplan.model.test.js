import Rotationsplan from '../../../models/pages/rotationsplan.model';
import Basic from '../../../models/basic';

import {
  clearAppModelFromBasic,
  initAppModelRotationsplanToBasic,
  appModelRotationsplan,
  createInitialYears
} from '../../mockdata/rotationsplan/appModel';

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});

describe('Whitebox testing', () => {
  let rotationsplan = null;
  beforeAll(() => {
    const initialYears = createInitialYears();
    const props = {
      curMonth: new Date().getMonth(),
      curYear: new Date().getFullYear(),
      initialColumnWidth: 250,
      rangeMonths: 4,
      rangeWidth: [250, 600],
      years: initialYears,
      zoomVal: 50
    };
    rotationsplan = new Rotationsplan(appModelRotationsplan.page.data, props);
    rotationsplan.timeline.fillContingentIds();
    rotationsplan.timeline.fillEmployeeIds();
  });

  describe('Instances', () => {
    test('instance of rotationsplan', () => {
      expect(rotationsplan).toBeInstanceOf(Rotationsplan);
      expect(rotationsplan).toBeInstanceOf(Basic);
    });
  });

  describe('Methods', () => {
    describe('eachKontingent: ', () => {
      test('fill and sort arr asc by position', () => {
        // Selbe wie unten nur, dass geschaut wird ob im array das object vorhanden ist,
        // Rheinfolge wird nicht beachtet.

        // expect(rotationsplan.eachKontingent()).toEqual(
        //   expect.arrayContaining([
        //     expect.objectContaining({id: 18}),
        //     expect.objectContaining({id: 21})
        //   ])
        // );

        // schaut exact ob im Array die Rheinfolge stimmt,
        // objectContaining partial matching on id, bedeutet das nicht alle properties vom object aufgeschrieben werden muessen.
        const sortedKontingents = rotationsplan.eachKontingent();
        expect(sortedKontingents).toEqual([
          expect.objectContaining({ id: 21 }),
          expect.objectContaining({ id: 18 })
        ]);
      });
    });

    describe('eachEmployee', () => {
      test('fill and sort arr asc by funktion_id', () => {
        expect(rotationsplan.eachEmployee()).toEqual([
          expect.objectContaining({ id: 472 }),
          expect.objectContaining({ id: 419 }),
          expect.objectContaining({ id: 585 }),
          expect.objectContaining({ id: 506 })
        ]);
        expect(rotationsplan.eachEmployee()).toHaveLength(4);
        rotationsplan.timeline.onlyActiveEmployees = false;
        expect(rotationsplan.eachEmployee()).toHaveLength(5);
      });
    });

    describe('connectRotationenToEmployee', () => {
      let rotationen = null;
      let employees = null;

      beforeAll(() => {
        employees = rotationsplan.data.mitarbeiter;
        rotationen = rotationsplan.data.rotationen;

        for (const id in rotationen) {
          rotationen[id].addToEmployee = jest.fn();
        }
        for (const id in employees) {
          employees[id].sortAndSetPos = jest.fn();
        }
      });

      afterAll(() => {
        for (const id in rotationen) {
          rotationen[id].addToEmployee.mockRestore();
        }
        for (const id in employees) {
          employees[id].sortAndSetPos.mockRestore();
        }
      });

      test('should call addToEmployee and sortAndSetPos in rotation model', () => {
        rotationsplan.connectRotationenToEmployee();

        for (const id in rotationen) {
          expect(rotationen[id].addToEmployee).toHaveBeenCalled();
        }
        for (const id in employees) {
          expect(employees[id].sortAndSetPos).toHaveBeenCalled();
        }
      });
    });

    describe('connectRotationenToContingent', () => {
      let rotationen = null;
      let contigents = null;

      beforeAll(() => {
        contigents = rotationsplan.data.kontingente;
        rotationen = rotationsplan.data.rotationen;

        for (const id in rotationen) {
          rotationen[id].addToContingent = jest.fn();
        }
        for (const id in contigents) {
          contigents[id].sortAndSetPos = jest.fn();
        }
      });

      afterAll(() => {
        for (const id in rotationen) {
          rotationen[id].addToContingent.mockRestore();
        }
        for (const id in contigents) {
          contigents[id].sortAndSetPos.mockRestore();
        }
      });

      test('should call addToContingent and sortAndSetPos in rotation model', () => {
        rotationsplan.connectRotationenToContingent();

        for (const id in rotationen) {
          expect(rotationen[id].addToContingent).toHaveBeenCalled();
        }
        for (const id in contigents) {
          expect(contigents[id].sortAndSetPos).toHaveBeenCalled();
        }
      });
    });

    describe('disconnectRotationenFromEmployee & disconnectRotationenFromContingent', () => {
      let contigents = null;
      let employees = null;

      beforeAll(() => {
        employees = rotationsplan.data.mitarbeiter;
        contigents = rotationsplan.data.kontingente;

        for (const id in contigents) {
          contigents[id].resetIds = jest.fn();
        }

        for (const id in employees) {
          employees[id].resetIds = jest.fn();
        }
      });

      afterAll(() => {
        for (const id in contigents) {
          contigents[id].resetIds.mockRestore();
        }

        for (const id in employees) {
          employees[id].resetIds.mockRestore();
        }
      });

      test('disconnect rotationen from emplyoee', () => {
        rotationsplan.disconnectRotationenFromEmployee();
        for (const id in employees) {
          expect(employees[id].resetIds).toHaveBeenCalled();
        }
      });

      test('disconnect rotationen from contigents', () => {
        rotationsplan.disconnectRotationenFromContingent();
        for (const id in contigents) {
          expect(contigents[id].resetIds).toHaveBeenCalled();
        }
      });
    });
  });
});
