import GenericTable from '../helper/GenericTable';

class InfoTable extends GenericTable {
  constructor(data, appModel) {
    super(appModel, data, {
      columns: [
        { title: 'Id', key: 'id', type: 'numeric' },
        { title: 'Dienst Id', key: 'po_dienst_id', type: 'numeric' },
        { title: 'Dienst Name', key: 'dienst.planname', type: 'string' },
        { title: 'Tag', key: 'tag', type: 'date' }
      ],
      order: {
        key: 'id',
        sort: 'asc',
        type: 'numeric' // date, numeric, string
      },
      pages: {
        cur_size: 0
      },
      filter: [
        {
          type: 'text',
          key: 'search-table',
          search_in: {
            key: 'all'
          },
          initial_val: ''
        }
      ]
    });
  }

  changedOrder(newOrder, newData) {
    this.update('updateTable');
  }

  filterChanged(newData, curFilter, filters) {
    this.update('updateTable');
    super.hideLoader();
  }
}

export default InfoTable;
