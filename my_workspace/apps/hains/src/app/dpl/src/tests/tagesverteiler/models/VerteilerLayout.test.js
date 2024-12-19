import Basic from '../../../models/basic'
import VerteilerLayout from '../../../models/verteiler/VerteilerLayout'

import {
  clearAppModelFromBasic, 
  initAppModelRotationsplanToBasic, 
  appModelRotationsplan,
} from "../../mockdata/rotationsplan/appModel"

beforeAll(() => {
  clearAppModelFromBasic();
  initAppModelRotationsplanToBasic();
});

describe('whitebox', () => {
  const createInitialTableStruc = (rows, cols) => {
    const grid = {};
    for(let i = 0; i < rows; i++) {
      let str = '. '
      if(cols === 1) {
        str = '.';
      }
      grid[i] = str.repeat(cols).trim();
    }

    const gridTemplateLayout = new VerteilerLayout({
      device:'desktop',
      rows:rows,
      cols:cols,
      grid: grid
    });
    return gridTemplateLayout;
  }

  describe("Instances", () => {
    const gridTemplateLayout = createInitialTableStruc(1,1);
    test("Instance of GridTemplateLayout", () => {
      expect(gridTemplateLayout).toBeInstanceOf(VerteilerLayout);
      expect(gridTemplateLayout).toBeInstanceOf(Basic);
    });
  });
  
  describe('change single row or columns',() => {
    let tableGrid = null;
    beforeEach(() =>{
      tableGrid = createInitialTableStruc(1,1);
    });
    describe('change grid columns', () =>{
      test('add column on 1x1', () => {
        expect(tableGrid.addColumn(0, '.')).toBe('. .');
        expect(tableGrid.addColumn(1, '.')).toBe('. .');
      });
      test('add column left', () => {
        expect(tableGrid.addColumn(0, 'hl')).toBe('. hl');
      });
      test('add column right', () => {
        expect(tableGrid.addColumn(1, 'hl')).toBe('hl .');
      });
      test('add column between', () => {
        expect(tableGrid.addColumn(1, 'hl ch dl')).toBe('hl . ch dl');
        expect(tableGrid.addColumn(2, 'hl ch dl')).toBe('hl ch . dl');
      });
      test('remove current column', () => {
        expect(tableGrid.removeColumn(0, '.')).toBe('.');
        expect(tableGrid.removeColumn(0, '. .')).toBe('.');
        expect(tableGrid.removeColumn(0, 'hl .')).toBe('.');
        expect(tableGrid.removeColumn(0, '. hl')).toBe('hl');
        expect(tableGrid.removeColumn(1, 'hl ch dl')).toBe('hl dl');
        expect(tableGrid.removeColumn(2, 'hl ch dl')).toBe('hl ch');
      });
    });

    describe('change grid rows', () => {
      test('add row', () => {
        const colSize = 2;
        expect(tableGrid.addRow(colSize)).toBe('. .');
        expect(tableGrid.addRow(5)).toStrictEqual('. . . . .');
      });

      test('add row at pos', () => {
        const obj = { 0: 'hl dl ch'}
        const colSize = 3;
        const pos = 0;
        expect(tableGrid.addRowAtPos(pos, colSize, obj)).toStrictEqual({
          0:'. . .',
          1:'hl dl ch'
        });
        expect(tableGrid.addRowAtPos(1, colSize, obj)).toStrictEqual({
          0:'hl dl ch',
          1:'. . .',
        });
        const obj2 = {
          0: 'hl-dienste hl-chir hl-kopf hl-ortho',
          1: 'ct-dienste ct-chir ct-kopf ct-ortho',
          2: 'ct-dienste2 ct-chir2 ct-kopf2 ct-ortho2',
        }
        expect(tableGrid.addRowAtPos(1, 4, obj2)).toStrictEqual({
          0: 'hl-dienste hl-chir hl-kopf hl-ortho',
          1: '. . . .',
          2: 'ct-dienste ct-chir ct-kopf ct-ortho',
          3: 'ct-dienste2 ct-chir2 ct-kopf2 ct-ortho2',
        });
      });

      test("remove current row", () => {
        const obj = { 0: 'hl dl ch'}
        const pos = 0;
        expect(tableGrid.removeRow(pos, obj)).toStrictEqual({0: 'hl dl ch'});

        const obj2 = {
          0: 'hl-dienste hl-chir hl-kopf hl-ortho',
          1: 'ct-dienste ct-chir ct-kopf ct-ortho',
          2: 'ct-dienste2 ct-chir2 ct-kopf2 ct-ortho2',
        }
        expect(tableGrid.removeRow(pos, obj2)).toStrictEqual({
          0: 'ct-dienste ct-chir ct-kopf ct-ortho',
          1: 'ct-dienste2 ct-chir2 ct-kopf2 ct-ortho2',
        });
        expect(tableGrid.removeRow(1, obj2)).toStrictEqual({
          0: 'hl-dienste hl-chir hl-kopf hl-ortho',
          1: 'ct-dienste2 ct-chir2 ct-kopf2 ct-ortho2',
        });
        expect(tableGrid.removeRow(2, obj2)).toStrictEqual({
          0: 'hl-dienste hl-chir hl-kopf hl-ortho',
          1: 'ct-dienste ct-chir ct-kopf ct-ortho',
        });

      });
    });

  })

  describe('change table struct', () => {
    let tableGrid = null;
    beforeEach(() => {
      const grid = {
        0:'hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
        1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
        2:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        3:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
      }
      tableGrid = new VerteilerLayout({
        device:'desktop',
        rows:4,
        cols:7,
        grid: grid
      });
    });
  
    describe('add new row and get grid back', () => {
      test('add column left at column 2', () =>{
        let pos = 1;
        expect(tableGrid.addColumnInAllRows(pos, tableGrid.grid)).toStrictEqual({
          0:'hl-dienste . hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir . ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf . ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'ct-dienste-kopf . ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        });
        pos = 0;
        expect(tableGrid.addColumnInAllRows(pos, tableGrid.grid)).toStrictEqual({
          0:'. hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'. ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'. ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'. ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        });
      });
      
      test('remove column in all rows', () =>{
        let pos = 1;
        expect(tableGrid.removeColumnInAllRows(pos, tableGrid.grid)).toStrictEqual({
          0:'hl-dienste hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'ct-dienste-kopf ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        });
        pos = 3
        expect(tableGrid.removeColumnInAllRows(pos, tableGrid.grid)).toStrictEqual({
          0:'hl-dienste hl-chir hl-chir hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        });
      });
    });

    describe('get new table config', () => {
      let tableGrid = null;
      beforeEach(() => {
        const grid = {
          0:'hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        }
        tableGrid = new VerteilerLayout({
          device:'desktop',
          rows:4,
          cols:7,
          grid: grid
        });
      });

      const checkConfig = (tableGrid, rows, cols, grid) => {
        expect(tableGrid.rows).toBe(rows);
        expect(tableGrid.cols).toBe(cols);
        expect(tableGrid.grid).toStrictEqual(grid);
      };

      describe('add new row clicked row 3', () => {
        test('add row top', () => {
          const clicked = {rowIx:2, colIx:2, key:'add_row_top'}
          tableGrid.updateColsAndRows(clicked);
          checkConfig(tableGrid, 5, 7, {
            0:'hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
            1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
            2:'. . . . . . .',
            3:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
            4:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          });
        });

        test('add row bottom', () => {
          const clicked = {rowIx:2, colIx:2, key:'add_row_bottom'}
          tableGrid.updateColsAndRows(clicked);
          checkConfig(tableGrid, 5, 7, {
            0:'hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
            1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
            2:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
            3:'. . . . . . .',
            4:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          });
        });
      });

      test('remove row clicked on 3 row', () => {
        const clicked = {rowIx:2, colIx:2, key:'remove_row'}
        tableGrid.updateColsAndRows(clicked);
        checkConfig(tableGrid, 3, 7, {
          0:'hl-dienste hl-chir hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza'
        });
      });

      describe('add column click on col 3', () => {
        test('add column left', () => {
          const clicked = {rowIx:2, colIx:2, key:'add_col_left'}
          tableGrid.updateColsAndRows(clicked);
          checkConfig(tableGrid, 4, 8, {
            0:'hl-dienste hl-chir . hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
            1:'ct-dienste-chir ct-chir-gang1 . ct-chir-gang3 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
            2:'ct-dienste-kopf ct-chir-gang2 . ct-chir-tagesklinik ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
            3:'ct-dienste-kopf ct-chir-gang2 . ct-chir-iez ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          });
        });
        test('add column right', () => {
          const clicked = {rowIx:2, colIx:2, key:'add_col_right'}
          tableGrid.updateColsAndRows(clicked);
          checkConfig(tableGrid, 4, 8, {
            0:'hl-dienste hl-chir hl-chir . hl-kopf hl-ortho hl-ufhk hl-abwesende',
            1:'ct-dienste-chir ct-chir-gang1 ct-chir-gang3 . ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
            2:'ct-dienste-kopf ct-chir-gang2 ct-chir-tagesklinik . ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
            3:'ct-dienste-kopf ct-chir-gang2 ct-chir-iez . ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          });
        });
      });

      test('remove col 3 in all rows', () => {
        const clicked = {rowIx:2, colIx:2, key:'remove_col'}
        tableGrid.updateColsAndRows(clicked);
        checkConfig(tableGrid, 4, 6, {
          0:'hl-dienste hl-chir hl-kopf hl-ortho hl-ufhk hl-abwesende',
          1:'ct-dienste-chir ct-chir-gang1 ct-kopf-op ct-ortho-op ct-ufhk-op ct-abwesende-urlaub',
          2:'ct-dienste-kopf ct-chir-gang2 ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
          3:'ct-dienste-kopf ct-chir-gang2 ct-kopf-op ct-ortho-op ct-ufhk-aussenbereiche ct-abwesende-fza',
        });
      });

    });

  });

});
