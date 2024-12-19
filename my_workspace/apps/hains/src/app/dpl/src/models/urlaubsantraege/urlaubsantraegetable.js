import { today } from '../../tools/dates';
import GenericTable from '../helper/GenericTable';

import AntragHistoryTable from './AntragHistoryTable';

class UrlaubsantraegeTable extends GenericTable {
  constructor(data, appModel) {
    super(appModel, data.antraege, {
      columns: [
        { title: 'ID', key: 'id', type: 'numeric' },
        { title: 'Art', key: 'antragstyp.name', type: 'string' },
        { title: 'Planname', key: 'mitarbeiter.planname', type: 'string' },
        {
          title: 'Name',
          key: 'mitarbeiter.name',
          type: 'string',
          hidden: true
        },
        {
          title: 'Eingereicht',
          key: 'created_at',
          type: 'date',
          formatDate: {
            lang: 'de-De',
            props: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }
          }
        },
        // {
        //   title: 'Aktualisiert am',
        //   key: 'updated_at',
        //   type: 'date',
        //   formatDate: {
        //     lang: 'de-De',
        //     props: {
        //       year: 'numeric',
        //       month: '2-digit',
        //       day: '2-digit',
        //       hour: '2-digit',
        //       minute: '2-digit',
        //       second: '2-digit'
        //     }
        //   }
        // },
        { title: 'Beginn', key: 'start', type: 'date', formatDate: {
            lang: 'de-De'
        } },
        { title: 'Ende', key: 'ende', type: 'date', formatDate: {
            lang: 'de-De'
        } },
        {
          title: 'Status',
          key: 'antragsstatus.name',
          bg_color: 'antragsstatus.color',
          type: 'string'
        }
      ],
      pages: {
        sizes: [25, 50, 100, 150, 200, 0],
        cur_size: 50,
        visible: [1, 2, 3, 4, 5]
      },
      order: {
        key: 'id',
        sort: 'asc',
        type: 'numeric' // date, numeric, string
      },
      append_child: {
        position: 'first',
        childs: [
          {
            type: 'checkbox',
            name: 'bin',
            className: 'bin-checkbox'
          }
        ]
      },
      exports: ['csv', 'pdf'],
      filter: [
        {
          type: 'text',
          key: 'search',
          search_in: {
            key: 'all'
          },
          initial_val: ''
        },
        {
          type: 'select',
          key: 'status',
          search_in: {
            key: 'antragsstatus.id'
          },
          options: [
            { id: 1, name: 'In Bearbeitung' },
            { id: 2, name: 'Genehmigt' },
            { id: 3, name: 'Nicht Genehmigt' },
            { id: '1|2|3|4|5', name: 'Von mir bearbeitet' },
            { id: 4, name: 'In Klärung' },
            { id: 5, name: 'In Rücksprache' },
            { id: '2|3', name: 'Abgeschlossen' },
            { id: 0, name: 'Alle' }
          ],
          initial_val: 1,
          skip: false
        },
        {
          type: 'select',
          key: 'years',
          search_in: {
            key: 'start'
          },
          options: [
            { id: 1, name: 'Default Jahre' },
            { id: today().getFullYear() + 1, 
              name: today().getFullYear() + 1 
            },
            { id: today().getFullYear(), 
              name: today().getFullYear() 
            },
            {
              id: today().getFullYear() - 1,
              name: today().getFullYear() - 1
            },
            {
              id: today().getFullYear() - 2,
              name: today().getFullYear() - 2
            },
            {
              id: today().getFullYear() - 3,
              name: today().getFullYear() - 3
            },
            {
              id: today().getFullYear() - 4,
              name: today().getFullYear() - 4
            }
          ],
          initial_val: 1,
          skip: true,
          visible_on: {
            key: 'status',
            ids: [1, 2, 3, '1|2|3|4|5', '2|3', 4, 5, 0]
          },
          filterCallback: true
        },
        {
          type: 'date',
          key: 'begin',
          search_in: {
            key: 'start'
          },
          visible_on: {
            key: 'status',
            ids: [2, 3, '1|2|3|4|5', '2|3', 0]
          },
          date_is: 'start',
          skip: true,
          initial_val: '',
          label: 'Begin:'
        },
        {
          type: 'date',
          key: 'ende',
          search_in: {
            key: 'ende'
          },
          visible_on: {
            key: 'status',
            ids: [2, 3, '1|2|3|4|5', '2|3', 0]
          },
          date_is: 'end',
          skip: true,
          initial_val: '',
          label: 'Ende:'
        }
      ]
    });
    this.historyTableModel = new AntragHistoryTable({}, this._appModel);
    this.antragstyp = data.antragstyp;
    this.antragsstatus = data.antragsstatus;
    this.view = 'overview';
    this.dataRow = {};
    this.deleteAntraegeIds = [];
  }

  set dataRow(data) {
    this._dataRow = data;
    if (Object.keys(data).length) {
      this.historyTableModel.setData(data.antraege_history);
    }
  }

  get dataRow() {
    return this._dataRow;
  }

  renderByURL(location) {
    const antragId = new URLSearchParams(location.search).get('antrag_id');
    const dataRow = this.data?.[antragId];
    if(dataRow) this.evEditRow(dataRow);
  }

  changeView(view) {
    if (typeof view !== 'string') {
      throw new Error('Only strings allowed');
    }
    this.view = view;
    this.update('updateView');
  }

  sizeChanged(size, antraege) {
    this.update('updateTable');
  }

  pageChanged(page, antraege) {
    this.update('updateTable');
  }

  changedOrder(order, antraege) {
    this.update('updateTable');
  }

  checkboxChecked(dataRow) {
    if (this.deleteAntraegeIds.includes(dataRow.id)) {
      this.deleteAntraegeIds = this.deleteAntraegeIds.filter(
        (id) => id !== dataRow.id
      );
    } else {
      this.deleteAntraegeIds.push(dataRow.id);
    }
  }

  editRow(dataRow, history) {
    this.dataRow = dataRow;
    this.changeView('edit');
    if(history) history.push(`${history.location.pathname}?antrag_id=${dataRow.id}`);
  }

  async deleteAntraege() {
    if (this.deleteAntraegeIds.length === 0) return;
    const res = await this._pageData.deleteAntrage(this.deleteAntraegeIds);
    if (!res.data) {
      return res.msg || 'something went wrong!!!';
    }
    this.deleteAntraegeIds = [];
    super.updateData();
    this.update('updateTable');
    return 'OK';
  }

  shouldResetFilters(filters, filtersToResetKeys) {
    const result = [];
    filters.forEach((filter) => {
      const found = filtersToResetKeys.find((f) => f.key === filter.key);
      if (found) {
        if (filter.initial_val) {
          result.push({
            key: found.key,
            val: found.val
          });
        }
      }
    });
    return result;
  }

  areBothDateStartEndFilled(filters) {
    const datesF = filters.filter((f) => {
      if (f.type === 'date') {
        if (f.key === 'begin' || f.key === 'ende') {
          return !!f.initial_val;
        }
      }
      return false;
    });
    if (datesF.length === 2) {
      const statusId = filters.find((f) => f.key === 'status').initial_val;
      const minDate = datesF.find((f) => f.key === 'begin').initial_val;
      const maxDate = datesF.find((f) => f.key === 'ende').initial_val;
      const params = {
        statusId,
        minDate,
        maxDate
      };
      return [true, params];
    }
    return [false, {}];
  }

  async filterChanged(antraege, filter, filters) {
    if (filter.key === 'status') {
      const filtersToReset = [
        { key: 'begin', val: '' },
        { key: 'ende', val: '' },
        { key: 'years', val: 1 }
      ];
      const resetFilters = this.shouldResetFilters(filters, filtersToReset);
      super.setNewFilterVal(resetFilters);
      super.restoreInitailData();

      if (filter.initial_val === '1|2|3|4|5') {
        const editByMe = Object.values(this.initialData).filter((f) => {
          if (f.antraege_history.length > 0) {
            const found = f.antraege_history.find(
              (h) => h.mitarbeiter.id === this._user.mitarbeiterId
            );
            return !!found;
          }
          return false;
        });
        super.setNewData(editByMe);
      }
    }

    if (filter.type === 'date') {
      const statusVal = filters.find((f) => f.key === 'status').initial_val;
      const skip = [1, 5, 6];
      if (!skip.includes(statusVal)) {
        const [isFilled, params] = this.areBothDateStartEndFilled(filters);
        if (!isFilled) {
          super.hideLoader();
          this.update('updateTable');
          return;
        }

        let url = null;
        switch (statusVal) {
          case '1|2|3|4|5':
            url = 'get_antraege_by_myedits';
            break;
          case '2|3':
            url = 'get_antraege_by_completed';
            break;
          default:
            url = 'get_antraege_by_date';
        }

        const newData = await this.getNewApiData(url, params);

        if (!newData) {
          return null;
        }

        super.setNewData(newData);
      }
    }
    super.hideLoader();
    this.update('updateTable');
  }

  async filterCallback(antraege, filter, filters) {
    if (filter.key !== 'years') {
      return null;
    }

    const params = this.prepareYearParams(filters);
    super.setNewFilterVal([
      { key: 'begin', val: params?.minDate },
      { key: 'ende', val: params?.maxDate }
    ]);

    const newData = await this.getNewApiData('get_antraege_by_date', params);
    if (!newData) {
      return null;
    }

    super.setNewData(newData);
    super.hideLoader();
    this.update('updateTable');
  }

  async addNewAntrag(url, formatData) {
    const antrag = await this._pageData.addNewAntrag(url, formatData);
    if (!antrag.data) {
      return antrag;
    } 
    super.updateData();
    this.update('updateTable');
    return antrag;
  }

  async getNewApiData(url, params) {
    if (!params) {
      super.hideLoader();
      return null;
    }

    let newAntraege = await this._pageData.getAntraegeByDate(url, params);

    if (!newAntraege) {
      newAntraege = {};
      console.log('something went wrong');
    }

    return newAntraege;
  }

  prepareYearParams(filters) {
    const statusF = filters.find((f) => f.key === 'status');
    const yearF = filters.find((f) => f.key === 'years');
    let minDate = `${yearF.initial_val}-01-01`;
    let maxDate = `${yearF.initial_val}-12-31`;
    if (yearF.initial_val === 1) {
      minDate = '';
      maxDate = '';
    }

    if (!this.isDate(minDate) && !this.isDate(maxDate) && yearF.initial_val !== 1) {
      return null;
    }

    const params = {
      statusId: statusF.initial_val,
      minDate,
      maxDate
    };
    return params;
  }
}

export default UrlaubsantraegeTable;
