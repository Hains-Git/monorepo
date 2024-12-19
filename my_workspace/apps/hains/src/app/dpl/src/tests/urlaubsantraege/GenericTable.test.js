/* import {createAppModel} from "../mockdata/appmodel" */

import GenericTable from '../../models/helper/GenericTable';
import { dataObj, createConf } from './GenericTableConfig';

/* const appModel = createAppModel(); */

let gt = null;
let antraege = null;
let config = null;

beforeEach(() => {
  config = createConf();
  gt = new GenericTable(false, dataObj, config);
  antraege = Object.values(gt.data);
});

describe('Instances', () => {
  test('Instance of GenericTable', () => {
    expect(gt).toBeInstanceOf(GenericTable);
  });
});

describe('Unit Tests:', () => {
  describe('Sort Antraege', () => {
    test('sort id asc', () => {
      const unsorted = antraege.slice(0, 5);
      const sorted = gt.getSortedAntraege(unsorted);
      expect(sorted).toEqual([
        expect.objectContaining({ id: 8023 }),
        expect.objectContaining({ id: 8159 }),
        expect.objectContaining({ id: 8168 }),
        expect.objectContaining({ id: 8169 }),
        expect.objectContaining({ id: 8176 })
      ]);
    });
    test('sort id desc', () => {
      const unsorted = antraege.slice(0, 5);
      gt.order = { key: 'id', sort: 'desc', type: 'numeric' };
      const sorted = gt.getSortedAntraege(unsorted);
      expect(sorted).toEqual([
        expect.objectContaining({ id: 8176 }),
        expect.objectContaining({ id: 8169 }),
        expect.objectContaining({ id: 8168 }),
        expect.objectContaining({ id: 8159 }),
        expect.objectContaining({ id: 8023 })
      ]);
    });
    test('sort start asc', () => {
      const unsorted = antraege.slice(0, 5);
      gt.order = { key: 'start', sort: 'asc', type: 'date' };
      const sorted = gt.getSortedAntraege(unsorted);
      expect(sorted).toEqual([
        expect.objectContaining({ id: 8169 }),
        expect.objectContaining({ id: 8176 }),
        expect.objectContaining({ id: 8168 }),
        expect.objectContaining({ id: 8023 }),
        expect.objectContaining({ id: 8159 })
      ]);
    });
    test('sort start desc', () => {
      const unsorted = antraege.slice(0, 5);
      gt.order = { key: 'start', sort: 'desc', type: 'date' };
      const sorted = gt.getSortedAntraege(unsorted);
      expect(sorted).toEqual([
        expect.objectContaining({ id: 8159 }),
        expect.objectContaining({ id: 8023 }),
        expect.objectContaining({ id: 8168 }),
        expect.objectContaining({ id: 8176 }),
        expect.objectContaining({ id: 8169 })
      ]);
    });
    test('sort STRING asc not implemented', () => {
      // daten die in Antraege drin sind muessen aufgeplitten werden
      // includes von mitarbeiter, histroy, status, in rails entfernen und dann testen
    });
  });

  describe('Get Antraege by size and page', () => {
    test('Get 3 Antraege from page 1', () => {
      const curPage = 1;
      const curSize = 3;
      const sliced = gt.getSlicedAntraege(antraege, curPage, curSize);
      expect(sliced).toHaveLength(3);
      expect(sliced).toEqual([
        expect.objectContaining({ id: 8023 }),
        expect.objectContaining({ id: 8159 }),
        expect.objectContaining({ id: 8168 })
      ]);
    });
    test('Get 3 Antraege from page 3', () => {
      const curPage = 3;
      const curSize = 3;
      const sliced = gt.getSlicedAntraege(antraege, curPage, curSize);
      expect(sliced).toHaveLength(3);
      expect(sliced).toEqual([
        expect.objectContaining({ id: 8209 }),
        expect.objectContaining({ id: 8210 }),
        expect.objectContaining({ id: 8211 })
      ]);
    });
  });

  describe('Test pages', () => {
    test('get total pages', () => {
      const curSize = 3;
      const tmp = antraege.slice(0, 12);
      const total = gt.getPagesTotal(tmp, curSize);
      expect(total).toBe(4);
    });
    test('lastpage is visible', () => {
      const curSize = 3;
      const curPage = 6;
      const isLastPageVisible = gt.shouldDisplayLastPage(
        antraege,
        curPage,
        curSize
      );
      expect(isLastPageVisible).toBe(true);
    });
    test('lastpage is not visible', () => {
      const curSize = 3;
      const curPage = 7;
      const isLastPageVisible = gt.shouldDisplayLastPage(
        antraege,
        curPage,
        curSize
      );
      expect(isLastPageVisible).toBe(false);
    });
    test('get last pages', () => {
      const curSize = 3;
      const lastpages = gt.getLastPages(antraege, curSize);
      expect(lastpages).toEqual([6, 7, 8, 9, 10]);
    });
  });

  describe('Get visible pages', () => {
    test('get first 3 pages', () => {
      const curPage = 4;
      const curSize = 10;
      const visiblePages = gt.getVisiblePages(antraege, curPage, curSize);
      expect(visiblePages).toEqual([1, 2, 3]);
    });
    test('get 4 pages', () => {
      const curPage = 1;
      const curSize = 8;
      const visiblePages = gt.getVisiblePages(antraege, curPage, curSize);
      expect(visiblePages).toEqual([1, 2, 3, 4]);
    });
    test('get prev, cur, next page', () => {
      const curPage = 5;
      const curSize = 3;
      const visiblePages = gt.getVisiblePages(antraege, curPage, curSize);
      expect(visiblePages).toEqual([4, 5, 6]);
    });
    test('get last 5 pages', () => {
      const curPage = 7;
      const curSize = 3;
      const visiblePages = gt.getVisiblePages(antraege, curPage, curSize);
      expect(visiblePages).toEqual([6, 7, 8, 9, 10]);
    });
    test('should display only one page when page size is 0', () => {
      const curSize = 0;
      const curPage = 1;
      const sdlp = gt.shouldDisplayLastPage(antraege, curPage, curSize);
      const total = gt.getPagesTotal(antraege, curSize);
      const visiblePages = gt.getVisiblePages(antraege, curPage, curSize);
      expect(visiblePages).toEqual([1]);
      expect(sdlp).toBe(false);
      expect(total).toBe(1);
    });
  });

  describe('Get Antraege by filter', () => {
    test('get 5 antraege genehmigt', () => {
      const sliced = antraege.slice(0, 5);
      let approved = gt.getAntraegeByFilterText(sliced, 'Genehmigt', {
        key: 'antragsstatus.name'
      });
      expect(approved).toHaveLength(5);
      approved = gt.getAntraegeByFilterText(sliced, '2', {
        key: 'antragsstatus.id'
      });
      expect(approved).toHaveLength(5);
      approved = gt.getAntraegeByFilterText(sliced, 2, {
        key: 'antragsstatus.id'
      });
      expect(approved).toHaveLength(5);
    });
    test('get 4 antraege in bearbeitung', () => {
      const inProgress = gt.getAntraegeByFilterText(antraege, 'In Bearbeitung', {
        key: 'antragsstatus.name'
      });
      expect(inProgress).toHaveLength(4);
    });
    test('get 4 antraege in bearbeitung from filter obj', () => {
      const inProgress = gt.getFilteredAntraege(antraege);
      expect(inProgress).toHaveLength(4);
    });
    test('filter by two given ids', () => {
      const editAndNotApproved = gt.getAntraegeByFilterText(antraege, '1|3', {
        key: 'antragsstatus.id'
      });
      expect(editAndNotApproved).toHaveLength(6);
    });
  });

  describe('Search in Object with given key', () => {
    test('search in Obj on key antragsstatus.name', () => {
      const found = gt.searchInObj(antraege, 'In Bearbeitung', {
        key: 'antragsstatus.name'
      });
      expect(found).toHaveLength(4);
    });
    test('search in Obj on key mitarbeiter.planname', () => {
      const found = gt.searchInObj(antraege, 'Lenz M', {
        key: 'mitarbeiter.planname'
      });
      expect(found).toHaveLength(1);
    });
    test('search in Obj on key mitarbeiter.name with planname', () => {
      const found = gt.searchInObj(antraege, 'Lenz M', {
        key: 'mitarbeiter.name'
      });
      expect(found).toHaveLength(0);
    });
    test('search in Obj on key mitarbeiter.name', () => {
      const found = gt.searchInObj(antraege, 'Lenz', { key: 'mitarbeiter.name' });
      expect(found).toHaveLength(2);
    });
  });

  describe('Search in all keys from object', () => {
    test('search in Obj in all keys', () => {
      const found = gt.searchInObj(antraege, 'In Bearbeitung', { key: 'all' });
      expect(found).toHaveLength(4);
    });
    test('search in Obj in all keys by id', () => {
      const found = gt.searchInObj(antraege, '8023', { key: 'all' });
      expect(found).toHaveLength(1);
    });
    test('search in Obj in all keys by start', () => {
      const found = gt.searchInObj(antraege, '2023-08-14', { key: 'all' });
      expect(found).toHaveLength(2);
    });
    test('search in Obj in all keys by start german date', () => {
      const found = gt.searchInObj(antraege, '14.08.2023', { key: 'all' });
      expect(found).toHaveLength(2);
    });
    test('search in Obj in all keys by mitarbeiter planname', () => {
      const found = gt.searchInObj(antraege, 'Decker S', { key: 'all' });
      expect(found).toHaveLength(2);
    });
  });

  describe('Helper functions', () => {
    test('Is date selection valid', () => {
      const startF = gt.filters.find((filter) => filter.key === 'begin');
      const valid = gt.isDateInvalid(startF, '2023-08-14');
      expect(valid).toBe(false);

      const endF = gt.filters.find((filter) => filter.key === 'ende');
      const valid2 = gt.isDateInvalid(endF, '2023-08-23');
      expect(valid2).toBe(false);

      const invalid = gt.isDateInvalid(endF, '2023-08-13');
      expect(invalid).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  describe('Initial Loading Antrage', () => {
    test('get first antraege with filters', () => {
      const filtered = gt.getFilteredAntraege();
      const visiblePages = gt.getVisiblePages(filtered);
      expect(filtered).toHaveLength(4);
      expect(visiblePages).toEqual([1]);
    });
  });

  describe('Filter Select Status', () => {
    test('select in bearbeitung', () => {
      let status = 1;
      const filterStatus = gt.filters.find((filter) => filter.key === 'status');
      let filtered = gt.evChangeFilterVal(filterStatus, status);
      let visiblePages = gt.getVisiblePages(filtered);

      expect(filtered).toHaveLength(4);
      expect(visiblePages).toEqual([1]);

      status = 0;
      filtered = gt.evChangeFilterVal(filterStatus, status);
      visiblePages = gt.getVisiblePages(filtered);

      expect(filtered).toHaveLength(30);
      expect(visiblePages).toEqual([1, 2, 3]);
    });
  });

  describe('Combined filters', () => {
    test('filter status and search combined', () => {
      const filterStatus = gt.filters.find((filter) => filter.key === 'status');
      const filterSearch = gt.filters.find((filter) => filter.key === 'search');

      const status = 1;
      const antraege_a = gt.evChangeFilterVal(filterStatus, status);
      expect(antraege_a).toHaveLength(4);

      const search = 'Fischer';
      const antraege_b = gt.evChangeFilterVal(filterSearch, search);
      expect(antraege_b).toHaveLength(1);
    });

    test('get antraege from start date', () => {
      const startF = gt.filters.find((filter) => filter.key === 'begin');
      const startA = gt.evChangeFilterVal(startF, '2023-08-28');
      expect(startA).toHaveLength(2);
    });

    test('get antraege between start and end date', () => {
      const filterStatus = gt.filters.find((filter) => filter.key === 'status');
      const antraegeStatus = gt.evChangeFilterVal(filterStatus, 0);
      expect(antraegeStatus).toHaveLength(30);

      const startFilter = gt.filters.find((filter) => filter.key === 'begin');
      const antraegeStart = gt.evChangeFilterVal(startFilter, '2023-08-28');
      expect(antraegeStart).toHaveLength(8);

      const endFilter = gt.filters.find((filter) => filter.key === 'ende');
      const antraegeEnde = gt.evChangeFilterVal(endFilter, '2023-10-23');
      expect(antraegeEnde).toHaveLength(5);
    });
  });
});
