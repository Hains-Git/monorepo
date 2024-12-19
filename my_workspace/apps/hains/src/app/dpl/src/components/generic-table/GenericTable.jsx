import React from 'react';

import styles from './generic-table.module.css';

import GenericTableRow from './GenericTableRow';
import GenericTableRowHead from './GenericTableRowHead';
import Filters from './Filters';
import Loader from './Loader';

import { UseRegisterKey } from '../../hooks/use-register';
import './generic-table.css';

/* let count = 0 */

function GenericTable({ pageTableModel, header = null }) {
  /* count += 1; */
  /* console.log("main:GenericTableCom", count) */
  const sizes = pageTableModel.sizes;
  const curSize = pageTableModel.curSize;
  const order = pageTableModel.order;
  const curPage = pageTableModel.curPage;
  const visiblePages =
    pageTableModel.getVisiblePages().length > pageTableModel.visiblePages.length
      ? pageTableModel.visiblePages
      : pageTableModel.getVisiblePages();
  const filters = pageTableModel.filters;
  const append_child = pageTableModel.append_child;
  const columns = pageTableModel.columns;
  const exports = pageTableModel.exports;
  const antraege = pageTableModel.antraegeView;

  UseRegisterKey('updateTable', pageTableModel.push, pageTableModel.pull);

  const changeSize = (e) => {
    const val = parseInt(e.target.value, 10);
    pageTableModel.evSizeChanged(val);
  };

  const changePage = (e) => {
    const val = parseInt(e.target.closest('button').value, 10);
    pageTableModel.evPageChanged(val);
  };

  const filterItemCb = (props) => {
    pageTableModel.evChangeFilterVal(props.filter, props.val);
  };

  const exportData = (e) => {
    const txt = e.target.textContent;
    if (txt.toLowerCase().trim() === 'pdf') {
      pageTableModel.createPDF();
    }
    if (txt.toLowerCase().trim() === 'csv') {
      pageTableModel.createCSV('generic-table');
    }
  };

  return (
    <div className="generic-table-wrapper">
      {header}
      <div className="column2">
        <div className={`col filter ${styles.filter}`}>
          <Filters filters={filters} filterItemCb={filterItemCb} />
        </div>
        <div className="col exports">
          {exports.map((type) => (
            <button type="button" key={type} onClick={exportData}>
              {type}
            </button>
          ))}
        </div>
      </div>
      <div className="generic-table">
        <table id="generic-table" className={`${styles['gen-table']}`}>
          <thead>
            <tr>
              {append_child?.position === 'first' && <th aria-label="first" />}
              {columns.map((column, ix) => {
                if (column?.hidden) return null;
                return (
                  <GenericTableRowHead
                    key={`col-h-${column.key}-${ix}`}
                    column={column}
                    order={order}
                    pageTableModel={pageTableModel}
                  />
                );
              })}
              {append_child?.position === 'last' && <th aria-label="last" />}
            </tr>
          </thead>
          <tbody>
            {antraege.map((dataRow, rowId) => (
              <GenericTableRow
                pageTableModel={pageTableModel}
                key={rowId}
                dataRow={dataRow}
                rowId={rowId}
                columns={columns}
                convertStringToAccessor={
                  pageTableModel?.convertStringToAccessor
                }
                opts={append_child}
              />
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          <div className={`page-options ${styles.page_options}`}>
            <select value={curSize} onChange={changeSize}>
              {sizes.map((_size, ix) => (
                <option value={_size} key={`page-size-${ix}`}>
                  {_size === 0 ? 'Alle' : _size}
                </option>
              ))}
            </select>
            <div className={`pages-wrapper ${styles.pages_wrapper}`}>
              {pageTableModel?.shouldDisplayFirstPage() && (
                <>
                  <button
                    type="button"
                    className={`page-button first ${styles.page_first}`}
                    value={1}
                    onClick={changePage}
                  >
                    <span>1</span>
                  </button>
                  <button
                    type="button"
                    className={`page-button prev ${styles.page_prev}`}
                  >
                    <span>...</span>
                  </button>
                </>
              )}
              {visiblePages.map((num, ix) => {
                const act = curPage === num ? 'active' : '';
                return (
                  <button
                    type="button"
                    key={`page-${ix}`}
                    className={`page-btn page-btn-${num} ${act}`}
                    value={num}
                    onClick={changePage}
                  >
                    <span>{num}</span>
                  </button>
                );
              })}
              {pageTableModel?.shouldDisplayLastPage() && (
                <>
                  <button
                    type="button"
                    className={`page-button next ${styles.page_next}`}
                  >
                    <span>...</span>
                  </button>
                  <button
                    type="button"
                    className={`page-button last ${styles.page_last}`}
                    value={pageTableModel?.getPagesTotal()}
                    onClick={changePage}
                  >
                    {pageTableModel?.getPagesTotal()}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="table-loader">
        <Loader pageTableModel={pageTableModel} />
      </div>
    </div>
  );
}

export default GenericTable;
