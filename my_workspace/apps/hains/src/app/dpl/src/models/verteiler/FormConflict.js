import Basic from '../basic';

class FormConflict extends Basic {
  constructor(newEinteilung, verteiler) {
    super(verteiler._appModel);
    this.verteiler = verteiler;
    this.newEinteilung = newEinteilung.einteilung;
    this.einteilung = {
      tag: newEinteilung.tag,
      id: newEinteilung.einteilung?.id,
      bedarf: newEinteilung?.bedarf
    };
    this.von = newEinteilung.tag;
    this.bis = newEinteilung.tag;
    this.be_id = newEinteilung?.be_id; // be_id, vom dropped element
    this.po_dienst_id = newEinteilung.po_dienst.id;
    this.bereich_id = newEinteilung.bereich_id;
    this.employee = verteiler._mitarbeiters[newEinteilung.mitarbeiter.id];
    this.prevIds = newEinteilung.einteilung
      ? [newEinteilung?.einteilung?.id]
      : [];
    this.tmpFelder = {};
    this.conflicts = {};
    this.otherEinteilungen = [];
    this.skipDay = [];
    this.init();
  }

  uiUpdate() {
    this.update('form-conflict');
  }

  init() {
    this.tmpFelder = {};
    this.conflicts = {};
    this.otherEinteilungen = [];
    this.skipDay = [];
    const mId = this.employee?.id && parseInt(this.employee.id, 10);
    const von = new Date(this.von);
    const bis = new Date(this.bis);
    for (const tag = von; von <= bis; tag.setDate(tag.getDate() + 1)) {
      const tagStr = tag.toLocaleDateString('en-CA').toString();
      if (!this.tmpFelder[mId]) {
        this.tmpFelder[mId] = {};
      }
      if (!this.tmpFelder[mId][tagStr]) {
        this.tmpFelder[mId][tagStr] = [];
      }
      const felder = this.getFelder(tagStr);
      if (this._isArray(felder)) {
        felder.forEach((f) => {
          if (!this.otherEinteilungen.includes(f?.einteilung)) {
            this.otherEinteilungen.push(f?.einteilung);
          }
        });
        this.tmpFelder[mId][tagStr] = [...felder];
      }
    }
    this.generateConflict();
  }

  renderConflict(tag, cb) {
    const conflictsObj = this.conflicts[tag].konflikte.konflikte;
    const components = [];
    Object.keys(conflictsObj).forEach((key) => {
      const message = {
        typ: key,
        txt: conflictsObj[key].msg,
        className: conflictsObj[key].className
      };
      components.push(cb(message));
    });
    return components;
  }

  setBedarfConflict(tagStr, label, msg) {
    this.conflicts[tagStr] = {
      konflikte: {
        konflikte: {
          [label]: {
            className: 'conflict-bedarf',
            msg
          }
        }
      },
      className: 'conflict-bedarf',
      wuensche: { msg: [], className: '' }
    };
  }

  generateConflict() {
    const von = new Date(this.von);
    const bis = new Date(this.bis);
    for (const tag = von; von <= bis; tag.setDate(tag.getDate() + 1)) {
      const tagStr = tag.toLocaleDateString('en-CA').toString();
      const felder = this.getFelder(tagStr);
      felder?.forEach?.((feld) => {
        if (this.prevIds.includes(feld?.einteilung?.id)) {
          this.employee?.removeEinteilung(feld);
        }
      });

      if (!this.conflicts[tagStr]) {
        this.conflicts[tagStr] = {};
      }

      const dienst = this.verteiler.data.dienste[this.po_dienst_id];
      let conflicts = null;
      const bedarf = this.getBedarf(tagStr) || { id: 0, bereich_id: 0 };
      if ((bedarf.id === 0 || bedarf.gesamtBedarf === 0) && dienst?.hasBedarf) {
        this.setBedarfConflict(
          tagStr,
          'Kein Bedarf',
          `Kein Bedarf für den Dienst: ${dienst.planname} am ${tagStr}. Einteilungen die keinen Bedarf haben werden nicht erstellt.`
        );
        if (!this.skipDay.includes(tagStr)) this.skipDay.push(tagStr);
        continue;
      } else if (bedarf.isFull) {
        this.setBedarfConflict(
          tagStr,
          'Bedarf gedeckt',
          `Bedarf ist gedeckt Einteilungen werden nicht erstellt`
        );
        if (!this.skipDay.includes(tagStr)) this.skipDay.push(tagStr);
        continue;
      }

      conflicts = this.getConflicts({
        ...this.einteilung,
        id: 0,
        bedarf,
        tag: tagStr
      });
      this.conflicts[tagStr] = conflicts;
    }
  }

  getBedarf(tagStr) {
    const bedarfsEintraege = this.verteiler.data.bedarfseintraege;
    const bedarfsEintraegeHash = this.verteiler.data.bedarfseintraege_hash;
    const bedarf = bedarfsEintraege?.[this.be_id];
    if(bedarf) return bedarf;
    const bereich =bedarfsEintraegeHash?.[tagStr]?.nachDienst?.[
        this.po_dienst_id
      ];
    const bedarf_id = bereich?.[this.bereich_id]?.[0];
    return bedarfsEintraege?.[bedarf_id];
  }

  getConflicts(einteilung) {
    const conflicts = this.verteiler.calculateConflict(
      einteilung.tag,
      einteilung?.bedarf?.id,
      einteilung?.bedarf?.bereich_id,
      this.po_dienst_id,
      this.employee?.id,
      einteilung.id || 0
    );
    return conflicts;
  }

  addEinteilungToFeld(id) {
    const einteilung = this.verteiler.data.einteilungen?.[id];
    if (!einteilung) return;
    const feld = einteilung?.feld;
    this.employee?.addEinteilung(feld);
  }

  addToPrevIds(id) {
    if (!this.prevIds.includes(id)) {
      this.prevIds.push(id);
    }
    this.generateConflict();
    this.uiUpdate();
  }

  removeFromPrevIds(id) {
    this.addEinteilungToFeld(id);
    this.prevIds = this.prevIds.filter((_id) => _id !== id);
    this.generateConflict();
    this.uiUpdate();
  }

  employeeChanged(employee) {
    this.resetFelder();
    this.employee = employee;
    this.prevIds = [];
    this.init();
    this.uiUpdate();
  }

  dienstChanged(val) {
    const ids = val.split('_');
    this.po_dienst_id = ids[1];
    this.bereich_id = ids[0];
    this.resetFelder();
    this.init();
    this.uiUpdate();
  }

  resetFelder() {
    Object.keys(this.tmpFelder).forEach((m_id) => {
      Object.keys(this.tmpFelder[m_id]).forEach((tag) => {
        const mId = parseInt(m_id, 10);
        const felder = this.tmpFelder?.[mId]?.[tag];
        this?.employee?.addEinteilung?.(felder || []);
      });
    });
  }

  vonChanged(val) {
    this.von = val;
    this.resetFelder();
    this.init();
    this.uiUpdate();
  }

  bisChanged(val) {
    this.bis = val;
    this.resetFelder();
    this.init();
    this.uiUpdate();
  }

  getFelder(_tag) {
    return this.employee?.getEinteilungenNachTag(_tag);
  }
}

export default FormConflict;
