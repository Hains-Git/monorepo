import { render, fireEvent, screen } from '@testing-library/react';
import Mtable from '../../models/urlaubsliste/Mtable';
import { createTableMock, abwesentheitsliste } from './config';

let mTable;

beforeEach(() => {
  mTable = new Mtable(false, abwesentheitsliste);
  mTable.initHtml(createTableMock());
});

describe('Instances', () => {
  test('Instance of Mtable', () => {
    expect(mTable).toBeInstanceOf(Mtable);
  });
});

describe('Test isolated methods', () => {
  let cellPos;
  let initiScroll;
  beforeEach(() => {
    mTable.setEdgeDaysFromDates();
    cellPos = mTable.createCellPositions();
    mTable.prevDate = '2024-02-20';
    initiScroll = mTable.scrollToInitialDate();
  });

  test('method:getLeftBlockWidth', () => {
    const blockWidth = mTable.getLeftBlockWidth();
    expect(blockWidth).toBe(506);
  });

  test('method:createCellPositions', () => {
    expect(cellPos['2024-01-23']).toBe(0);
    // 30 * 7 days = 210
    expect(cellPos['2024-01-30']).toBe(210);
  });

  test('method:scrollToInitialDate', () => {
    expect(initiScroll).toBe(cellPos[mTable.prevDate]);
  });

  test('method:loadNewAbwesentheiten', () => {
    mTable.prevDate = '2024-02-20';
    expect(initiScroll).toBe(cellPos[mTable.prevDate]);
    mTable._set('cellPositions', {
      '2023-11-11': 350,
      '2023-12-28': 1150
    });
    const loadNewAbwesentheitenInUrlaubsliste = jest
      .spyOn(Mtable.prototype, 'loadNewAbwesentheitenInUrlaubsliste')
      .mockImplementation(() => {});
    mTable.loadNewAbwesentheiten(300, 1745);
    expect(loadNewAbwesentheitenInUrlaubsliste).toHaveBeenCalled();
    loadNewAbwesentheitenInUrlaubsliste.mockRestore();
  });

  describe('method:checkForNewDates', () => {
    const loadNewData = jest
      .spyOn(abwesentheitsliste, 'loadNewData')
      .mockImplementation(() => {});

    test('initial scroll', () => {
      const e = {
        target: {
          scrollLeft: mTable.tableHtml.scrollLeft,
          clientWidth: mTable.tableHtml.clientWidth,
          scrollLeftMax: mTable.tableHtml.scrollLeftMax
        }
      };
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(0);
    });

    test('scroll right', () => {
      const e = {
        target: {
          scrollLeft: mTable.tableHtml.scrollLeft,
          clientWidth: mTable.tableHtml.clientWidth,
          scrollLeftMax: mTable.tableHtml.scrollLeftMax
        }
      };
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(0);

      const initiScrollleft = mTable.tableHtml.scrollLeft;
      e.target.scrollLeft = initiScrollleft + 425;
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(0);

      e.target.scrollLeft = initiScrollleft + 426;
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(1);
    });

    test('scroll left', () => {
      const e = {
        target: {
          scrollLeft: mTable.tableHtml.scrollLeft,
          clientWidth: mTable.tableHtml.clientWidth,
          scrollLeftMax: mTable.tableHtml.scrollLeftMax
        }
      };
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(1);
      e.target.scrollLeft = 0;
      mTable.checkForNewDates(e);
      expect(loadNewData).toHaveBeenCalledTimes(2);
    });
  });
});
