import GenericTable from '../helper/GenericTable';

class AntragHistoryTable extends GenericTable {
  constructor(data, appModel) {
    super(appModel, data, {
      columns: [
        { title: 'Name', key: 'mitarbeiter.name', type: 'string' },
        { title: 'Weitere Änderungen', key: 'weiteres', type: 'string' },
        { title: 'Kommentar', key: 'kommentar', type: 'string' },
        {
          title: 'Geändert am',
          key: 'created_at',
          type: 'date',
          formatDate: {
            lang: 'de-De',
            props: {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            }
          }
        },
        {
          title: 'Status', key: 'antragsstatus.name', bg_color: 'antragsstatus.color', type: 'string'
        }
      ],
      order: {
        key: 'mitarbeiter.name',
        sort: 'asc',
        type: 'string' // date, numeric, string
      }
    });
  }

  changedOrder(order, antraege) {
    this.update("updateTable");
  }

  setData(data) {
    let obj = data;
    if(this._isArray(data)) {
      obj = {};
      data.forEach((item, i) => {
        obj[i] = item;
      });
    }
    super.setNewData(obj);
    this.update("updateTable");
  }
}

export default AntragHistoryTable;
