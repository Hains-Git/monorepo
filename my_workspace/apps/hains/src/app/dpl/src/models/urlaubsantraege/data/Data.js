import Basic from '../../basic';
/* import MyAntrag from './Antrag'; */

class Data extends Basic {
  constructor(data, appModel = false) {
    super(appModel);
    this.antraege = data.antraege;
    this.initialData = this.initAntraege(data.antraege);
    this.antragsstatus = data.status;
    this.antragstyp = data.typ;
    this.logger = false;
  }

  set antraege(data) {
    this._antraege = this.initAntraege(data);
  }

  get antraege() {
    return this._antraege;
  }

  initAntraege(data) {
    const obj = {};
    for (const antrag of data) {
      obj[antrag.id] = antrag;
    }
    return obj;
  }

  addNewData(data) {
    this.antraege = data;
  }

  async deleteAntrage(ids) {
    const params = {
      antraege_ids: ids
    };

    const res = await this._hains.api('delete_antraege_by_ids', 'post', params);

    if (res.msg === '' && res.data.length) {
      const urlaubsantraegeTableData = this?._page?.urlaubs_antraege_table?.data;
      res.data.forEach((antrag) => {
        if (!params.antraege_ids.includes(antrag.id)) return;
        delete this.antraege[antrag.id];
        delete this.initialData[antrag.id];
        if(urlaubsantraegeTableData?.[antrag.id]) {
          delete urlaubsantraegeTableData[antrag.id];
        }
      });
    }

    return res;
  }

  async addNewAntrag(url, params) {
    const antrag = await this._hains.api(url, 'post', params);
    if (antrag.data) {
      const urlaubsantraegeTableData = this?._page?.urlaubs_antraege_table?.data;
      this.antraege[antrag.data.id] = antrag.data;
      this.initialData[antrag.data.id] = antrag.data;
      if(urlaubsantraegeTableData) {
        urlaubsantraegeTableData[antrag.data.id] = antrag.data;
      }
    }
    return antrag;
  }

  async getAntraegeByDate(url, params) {
    const antraege = await this._hains.api(url, 'post', params);
    return antraege;
  }
}

export default Data;
