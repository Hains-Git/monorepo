import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import VerteilerData from '../verteiler/VerteilerData';
import InfoTable from '../verteiler/InfoTable';
import FeldV from '../verteiler/FeldV';
import VerteilerChannel from '../verteiler/VerteilerChannel';
import VerteilerEinteilungsstatusAuswahl from '../verteiler/VerteilerEinteilungsstatusAuswahl';

import {
  getGermanDate,
  formatDate,
  getVerteilerDates,
  today,
  addDays
} from '../../tools/dates';
import {
  autoEinteilen,
  numericLocaleCompare,
  sortByRoom,
  sortEinteilungenByPlanname
} from '../../tools/helper';
import DienstplanCalendar from '../helper/dienstplancalendar';
import InfoTab from '../helper/info-tab';
import { returnError } from '../../tools/hains';
import { downloadCSV } from '../../util_func/util';
import MitarbeiterVorschlaege from '../verteiler/MitarbeiterVorschlaege';
import VerteilerVorlagen from '../verteiler/Vorlagen';
import KonflikteFilter from '../dienstplaner/konfliktefilter/konfliktefilter';
import Wunsch from '../apimodels/wunsch';

const defaultEmptyField = { arbeitsplatz: { name: '' } };

class Verteiler extends InfoTab {
  constructor(data, props, appModel = false) {
    super(appModel);
    this.init(props, data);
    this.logger = false;
    this.today = formatDate(today());
    this.noRelatedData = this.data.getNoRelatedData();
    this.keepEinteilungsFeld = false;
    this.infoTableModel = false;
    this.channel = new VerteilerChannel(this, this._appModel);
    this.calendar = new DienstplanCalendar(
      this.pageName,
      appModel,
      this.pageName === 'tagesverteiler' ? 'day' : 'week'
    );
    this.dateChangedNonce = {};
    this.filteredTeamIds = [];
    this.vorlagen = new VerteilerVorlagen(this, this._appModel);
    this.mitarbeiterVorschlaege = new MitarbeiterVorschlaege(
      this,
      this._appModel
    );
    this.konflikteFilter = new KonflikteFilter(this._appModel);
    this.emptyWorkSpots = [];
    this.showEmptyWorkSpots = false;
    // wird verwendet um im popup weitere componenten darzustellen, 
    // am besten in dem object ein array mit Komponenten fuellen, 
    // und in Popup.jsx rendern
    this.popupExtras = false;
  }

  get vorlage() {
    const vorlage = this?.vorlagen?.vorlage;
    return vorlage?.id > 0 ? vorlage : false;
  }

  get vorlageTeamIds() {
    return this.vorlage?.team_ids || [];
  }

  get hasDienstplaene() {
    return !!this?.data?.dienstplaene?.length;
  }

  get dienstplan_ids() {
    return this?.data?.dienstplan_ids || [];
  }

  get mitarbeiters() {
    return this._mitarbeiters._each(false, (m) => !!m.aktiv)?.arr || [];
  }

  get filename() {
    const { dateDe } = getGermanDate(new Date());
    return `verteiler-${dateDe}`;
  }

  /**
   * Liefert die Struktur der Daten für die API,
   * bei einer Einteilung.
   */
  get tmpEinteilung() {
    const tag = formatDate(new Date());
    return {
      einteilungs_id: 0,
      einteilungskontext_id: 5,
      context_comment: '',
      dienstplan_id: this.data.getDienstplanIdByTag(tag),
      mitarbeiter_id: 0,
      po_dienst_id: 0,
      bereich_id: 0,
      von: tag,
      bis: tag,
      tag,
      prevIds: [],
      skipDay: [],
      einteilungsstatus_id: this.einteilungsstatusAuswahl.einteilungsstatus_id
    };
  }

  /**
   * Liefert die gefilterten Teams
   */
  get filteredTeams() {
    return this._getIdsObject('_teams', 'filteredTeamIds', false);
  }

  updateWunsch(data) {
    const wunsch = new Wunsch(data, this._appModel);
    const date = wunsch?.date;
    if (data?.remove_wunsch) {
      date?.removeWunsch?.(wunsch);
    } else {
      date?.addWunsch?.(wunsch);
    }
    wunsch?.mitarbeiter?._update?.();
    this.uiUpdate();
  }

  /**
   * Setzt die Team-Ids anhand des Parameters oder anhand der Vorlage
   * @param {Array} teamIds
   */
  setFilteredTeamIds(teamIds = []) {
    this.filteredTeamIds = this._isArray(teamIds)
      ? teamIds
      : this.vorlageTeamIds;
    this.mitarbeiterVorschlaege?._update?.();
  }

  setData(data = {}) {
    this._set('data', data);
  }

  reset() {
    this.setData();
  }

  initInfoTableModel(noRelatedData) {
    const dataObj =
      noRelatedData?.reduce?.((acc, item, i) => {
        acc[i] = item;
        return acc;
      }, {}) || {};
    this.infoTableModel = new InfoTable(dataObj, this._appModel);
  }

  germanDate(dateStr) {
    return getGermanDate(dateStr);
  }

  isDateVonSmaller(von, bis) {
    return this._dateZahl(von) <= this._dateZahl(bis);
  }

  refreshBedarfe(callback) {
    let refresh = false;
    if (!this.calendar.refresh) {
      this.calendar.toggleRefresh();
      refresh = true;
    }
    this.dateChanged(callback);
    if (refresh) this.calendar.toggleRefresh();
  }

  /**
   * Lädt die Monatspläne entweder aus dem Cache des APP-Models oder von der API.
   * Bei aufeinanderfolgenden Aufrufen wird nur der letze Aufruf verarbeitet.
   * @param {Function} cb
   */
  dateChanged(cb) {
    // Hiermit wird dafür gesorgt, dass nur der letzte Aufruf verarbeitet wird
    const localNonce = {};
    // Globales Nonce wird durch das lokale ersetzt
    this.dateChangedNonce = localNonce;
    // Holt die Verteiler-Dates und die Anfänge der Pläne
    const dates = getVerteilerDates(this.calendar.tag, this.pageName);
    const lastCall = () => {
      this.calendar.removeLoader();
      this.uiUpdate();
      this.einteilungsstatusAuswahl._update();
      this._isFunction(cb) && cb();
    };
    // Prüft, ob die Plänne bereits initialisiert sind
    const checkDateInMonatsplaenen =
      this.calendar?.hasDienstplan &&
      dates.anfaenge.every((anfang) => {
        return this.data.dienstplaene.find(
          (dp) =>
            dp.plantime_anfang === anfang &&
            this.calendar.hasDienstplan(anfang, dp.id)
        );
      });
    // Wenn die Pläne schon initialisiert sind, soll nur die UI aktualisiert werden
    if (
      !this.calendar.refresh &&
      this.calendar.cache &&
      checkDateInMonatsplaenen
    ) {
      this.data.resetDay(dates.tage);
      this.data.setNichtVerteilte(false);
      lastCall();
      return;
    }
    const l = dates.anfaenge.length;
    let finished = l;
    // Führt ein reset der VerteilerData durch
    this.data.initData(dates.tage);
    const bedarfeMap = {};
    // Monatspläne laden (aus Cache oder API)
    dates.anfaenge.forEach(async (anfang, i) => {
      if (!this?.calendar?.getMonatsplan) return;
      const response = this.calendar.getMonatsplan(anfang);
      const dienstplan = await response?.dienstplan;
      // Aufruf verwerfen, wenn nicht der letzte Aufruf oder appModel ist unmounted
      if (
        this?._mounted &&
        localNonce === this.dateChangedNonce &&
        this._isObject(dienstplan)
      ) {
        // Monatspläne initialisieren
        this.data.initMonatsplan(
          dienstplan,
          anfang,
          finished < l,
          i === 0,
          i === l - 1,
          bedarfeMap
        );
      }
      finished--;
      // Wenn der letzte Aufruf, dann UI aktualisieren
      if (finished < 1) {
        this.data.updateAfterFinishedLoading();
        lastCall();
      }
    });
    // Wenn kein Plan geladen werden konnte, warum auch immer, dann UI aktualisieren
    if (!l) {
      lastCall();
    }
  }

  uiUpdate(sort = false) {
    if (sort) this.update('roomSort');
    this.mitarbeiterVorschlaege._update();
    this.update('fullUpdate');
  }

  getNichtVerteilte(date) {
    const arr = this?.data?.nichtVerteilte?.[date];
    return (
      arr?.sort?.((a, b) => numericLocaleCompare(a.planname, b.planname)) || []
    );
  }

  getPoDienste(bereich_id, po_dienst_id) {
    const po_dienste = [];
    if (bereich_id) {
      const po_dienst_ids = this.data.getPoDienstIdsTroughBedarf(bereich_id);
      po_dienst_ids.forEach((id) => {
        po_dienste.push(this.data.dienste[id]);
      });
    }
    if (po_dienst_id) {
      po_dienste.push(this.data.dienste[po_dienst_id]);
    }
    return po_dienste.sort((a, b) => a.order - b.order);
  }

  getPoDienstEinteilungen(_po_dienst_id, dayCol, sort = false) {
    return this.data.getPoDienstEinteilungen(_po_dienst_id, dayCol, sort);
  }

  getPoDiensteDienstfrei(dayCol) {
    return this?.data?.getPoDiensteDienstfrei?.(dayCol) || [];
  }

  /**
   * Führt eine Einteilung der angeklickten Mitarbeiterin aus den
   * Mitarbeitervorschlägen durch. Sollten alle Bedarfe gedeckt sein,
   * erscheint eine Abfrage, ob man die letzte Einteilung des Bedarfes überschreiben
   * möchte.
   * @param {Object} mitarbeiter
   * @param {Object} feld
   */
  setEinteilungThroughMitarbeiterVorschlag(mitarbeiter, feld) {
    const einteilen = (lastEinteilungId = 0) => {
      const data = {
        ...this.tmpEinteilung,
        einteilungs_id: lastEinteilungId,
        mitarbeiter_id: mitarbeiter.id,
        bereich_id: feld.bereichId,
        po_dienst_id: feld.dienstId,
        tag: feld.tag,
        von: feld.tag,
        bis: feld.tag
      };
      if (lastEinteilungId) data.prevIds.push(lastEinteilungId);
      this.createNewEinteilung(data);
    };
    if (feld?.bedarf?.isFull) {
      const felder = feld?.bedarf?.felder || [];
      const lastFeld = felder.sort(sortByRoom).pop();
      if (
        window.confirm(`Soll die letzte Einteilung überschrieben werden?
        Mitarbeiter: ${lastFeld?.mitarbeiter?.planname || lastFeld?.value}
        Dienst: ${lastFeld?.dienst?.planname || lastFeld?.dienstId}
        Tag: ${lastFeld?.date?.label || lastFeld?.tag}
      `)
      ) {
        einteilen(lastFeld?.einteilung?.id || 0);
      }
    } else {
      einteilen(0);
    }
  }

  async removeEinteilung(einteilung, be_id) {
    const isDeleted = await this.data.einteilungAufheben(einteilung?.id, be_id);
    this.uiUpdate(true);
    return isDeleted;
  }

  async createNewEinteilung(changedEinteilung) {
    if (!changedEinteilung) return;
    const res = await this.data.createNewEinteilung(changedEinteilung);
    if (changedEinteilung.prevIds.length) {
      changedEinteilung.prevIds.forEach((id) => {
        const einteilung = this.data.einteilungen[id];
        if (einteilung) {
          this.data.removeEinteilung(einteilung);
        }
      });
    }
    this.resetEmptyWorkSpots();
    this.uiUpdate();
    return res;
  }

  async roomChanged(einteilungsId, roomId) {
    const msg = await this.data.roomChanged(einteilungsId, roomId);
    this.update('roomSort');
    return msg;
  }

  getStatus(id) {
    const statuseObj = this._einteilungsstatuse;
    if (!statuseObj[id]) return;
    const status = statuseObj[id];
    return status;
  }

  async updateEinteilungsStatusId(eId) {
    const statuseObj = this._einteilungsstatuse;
    // Liefert leider einen anderen Status als gueltig, da ausgefallen ebenfalls public und counts true beinhaltet.
    const statusId = statuseObj?._each?.(false, (_status) => _status.isGueltig)
      ?.arr?.[0]?.id;
    if (statusId) {
      const result = await this.data.updateEinteilungsStatusId(eId, statusId);
      if (!result?.status?.err) {
        return result.status.err;
      }
      this.uiUpdate();
    } else {
      console.error(
        'Kein Status mit public, counts und waehlbar = true und vorschlag = false gefunden.',
        statusId,
        statuseObj
      );
      return 'Einteilungsstatus konnte nicht aktualisiert werden.';
    }
  }

  getComClassName(...props) {
    const filtered = props.filter((prop) => prop);
    return filtered.join(' ');
  }

  getConflict(
    tag,
    be_id,
    bereich_id,
    po_dienst_id,
    mitarbeiter_id,
    einteilung_id
  ) {
    return this.calculateConflict(
      tag,
      be_id,
      bereich_id,
      po_dienst_id,
      mitarbeiter_id,
      einteilung_id
    );
  }

  calculateConflict(
    tag,
    be_id,
    bereich_id,
    po_dienst_id,
    mitarbeiter_id,
    einteilung_id
  ) {
    const einteilung = this._einteilungen[einteilung_id];

    const tmpfeld = new FeldV(
      {
        tag,
        bereichId: bereich_id,
        dienstId: po_dienst_id,
        value: mitarbeiter_id,
        arbeitsplatzId: einteilung?.arbeitsplatz_id || 0,
        einteilungId: einteilung?.id || 0,
        schichtnr: einteilung?.schichten || '0',
        bedarfeintragId: be_id
      },
      this._appModel
    );
    return tmpfeld.getStyle('mitarbeiter', this._mitarbeiters[mitarbeiter_id]);
  }

  getFelderFromEmployee(mId, tag = this.calendar.tag) {
    if (!mId) return;
    const felder = this._mitarbeiters[mId]?.getEinteilungenNachTag(tag);
    return felder;
  }

  /**
   * Testet, ob die Mitarbeiter im Team-Filter sind.
   * @param {Number} mitarbeiterId
   * @returns True, wenn ein Team, die Mitarbeiter enthält.
   */
  isMitarbeiterInTeamFilter(mitarbeiterId, tag = false) {
    const teamFilter = this.filteredTeams || [];
    return !!teamFilter?.find?.((team) =>
      tag
        ? team?.hasMitarbeiterTag(mitarbeiterId, tag)
        : team?.hasMitarbeiter(mitarbeiterId)
    );
  }

  /**
   * Filtern die Dienste anhand der ausgwählten Vorlage
   * @param {String} day
   * @returns Array
   */
  createOptionsDienste(day) {
    const dienste = [];
    this.data?.collections?.eachByVorlage?.((collection) => {
      collection?.eachBereichTVByVorlage?.((item) => {
        const obj = {
          bereich_id: item.bereich_id,
          label: item.name
        };
        const options = this.getPoDienste(
          item.bereich_id,
          item.po_dienst_id,
          day
        );
        if (!options.length) return;
        obj.options = options;
        dienste.push(obj);
      });
    });
    return dienste;
  }

  /**
   * Funktion um die aktiven Mitarbeiter nach den gewählten Teams zu filtern
   * @param {String} day
   * @returns Array
   */
  createOptionsMitarbeiter(day) {
    const mitarbeiter = [];
    this._mitarbeiters?._each?.((m) => {
      if (!m.aktivAm?.(day) || !this.isMitarbeiterInTeamFilter(m.id, day)) return;
      mitarbeiter.push(m);
    });
    return mitarbeiter;
  }

  setVerteilerData(data) {
    const verteilerData = new VerteilerData(data, this._appModel);
    this.setData(verteilerData);
  }

  init(props = {}, data = {}) {
    this.pageName = props.pageName;
    this.setVerteilerData(data);
    this.setEinteilungsstatusAuswahl(
      new VerteilerEinteilungsstatusAuswahl(this._appModel)
    );
  }

  /**
   * Setzt das Attribut einteilungsstatusAuswahl
   * @param {Object} p
   */
  setEinteilungsstatusAuswahl(p = false) {
    this._set('einteilungsstatusAuswahl', p);
  }

  setSectionDienstInfo(section, evt) {
    const dienst = this?.data?.dienste[section?.po_dienst_id];
    dienst?.setInfo?.(evt);
  }

  setEinteilungFeldInfo(einteilung, be_id, evt) {
    if (einteilung?.feld?.setInfo) {
      einteilung.feld.setInfo(evt);
    } else if (this?.data?.bedarfseintraege[be_id]) {
      const bedarf = this.data.bedarfseintraege[be_id];
      const feld = new FeldV(
        {
          tag: bedarf.tag,
          bereichId: bedarf.bereich_id,
          dienstId: bedarf.po_dienst_id,
          bedarfeintragId: be_id
        },
        this._appModel
      );
      feld?.setInfo?.(evt);
    }
  }

  /**
   * Liefert den Content einer Einteilung für die PDF
   * @param {String} content_layout
   * @param {Object} einteilung
   * @param {Object} po_dienst
   * @returns String
   */
  getPDFEinteilung(content_layout, einteilung, po_dienst) {
    const employee = einteilung?.mitarbeiter;
    const telNr = employee?.accountInfo?.dienstTelefon;
    const comment = einteilung?.info_comment;
    const saal =
      po_dienst.oberarzt === false ? einteilung?.arbeitsplatz?.name : false;
    if (!employee) return '';
    switch (content_layout) {
      case 'one_col':
        return `${employee.planname}${telNr ? ` tel: ${telNr}` : ''}${
          comment ? `\nKommentar: ${comment}` : ''
        }`;
      case 'one_col_list':
        return employee.planname;
      case 'two_col_saal':
        return `${saal ? `${saal}: ` : ''}${employee.planname}${
          telNr ? ` tel: ${telNr}` : ''
        }${comment ? `\n(${comment})` : ''}`;
      default:
        return '';
    }
  }

  scaleHTMLImageToCanvas(doc, canvas) {
    const { width, height } = canvas;
    const pageWidth = Math.floor(doc.internal.pageSize.getWidth() - 20);
    const pageHeight = Math.floor(doc.internal.pageSize.getHeight() - 20);
    const wScale = width / pageWidth;
    const hScale = height / pageHeight;
    const factor = Math.floor(width / hScale) > pageWidth ? wScale : hScale;
    const imageW = Math.floor(width / factor);
    const imageH = Math.floor(height / factor);
    const xpos = Math.floor((doc.internal.pageSize.getWidth() - imageW) / 2);
    const ypos = Math.floor((doc.internal.pageSize.getHeight() - imageH) / 2);
    return {
      xpos,
      ypos,
      imageW,
      imageH
    };
  }

  /**
   * Erstellt eine PDF aus dem HTML des Verteilers
   */
  createPdf(save = false, callback = false) {
    const tvWrapper = document.querySelector('div.verteiler-wrapper');
    tvWrapper.classList.add('print');
    // this.setHeightInDom();
    html2canvas(document.querySelector('div.daycol-wrapper'))
      .then((canvas) => {
        const img = canvas.toDataURL('image/jpeg', 1);
        const doc = new jsPDF({
          orientation: 'p',
          unit: 'px',
          format: 'a4',
          hotfixes: ['px_scaling'],
          compress: true
        });
        const { xpos, ypos, imageW, imageH } = this.scaleHTMLImageToCanvas(
          doc,
          canvas
        );
        doc.addImage(img, 'PNG', xpos, ypos, imageW, imageH);
        save && doc.save(`${this.filename}.pdf`);
        this._isFunction(callback) && callback(doc);
        tvWrapper.classList.remove('print');
        // this.setHeightInDom();
      })
      .catch(() => {
        tvWrapper.classList.remove('print');
        // this.setHeightInDom();
      });
  }

  getBereichRowsLength(bereich) {
    const lengths = [0];
    let _isOneColList = !!bereich?.isOneColList;
    this.data?.eachVerteilerDate?.((dayCol) => {
      let i = 0;
      let addDienste = true;
      let addDienstfrei = true;
      this.getContent(
        bereich,
        dayCol,
        false,
        ({ be, einteilungen, allDienste, allDienstfrei }) => {
          const isOneColList = !!bereich?.isOneColList;
          if (!_isOneColList) _isOneColList = isOneColList;
          const length = be?.felder
            ? be.felder?.length || 0
            : einteilungen?.length || 0;
          // One-Col-List rendert 2 Einteilungen in einer Spalte
          i += isOneColList ? Math.ceil(length / 2) : length;
          // One-Col-List rendert keine Subheadline
          if (!isOneColList) {
            if (allDienste?.length && addDienste) {
              i += allDienste.length;
              addDienste = false;
            }
            if (allDienstfrei?.length && addDienstfrei) {
              i += allDienstfrei.length;
              addDienstfrei = false;
            }
          }
        }
      );
      lengths.push(i);
    });
    return {
      length: Math.max(...lengths),
      isOneColList: _isOneColList
    };
  }

  resetEmptyWorkSpots() {
    this.emptyWorkSpots = [];
  }

  toggleEmptyWorkSpots(isActive) {
    this.resetEmptyWorkSpots();
    this.showEmptyWorkSpots = isActive;
    this.uiUpdate();
  }

  renderEmptyWorkSpots() {
    this.update('emptyWorkSpots');
  }

  sortByRoomAndPlanname(a, b) {
    const roomCompare = numericLocaleCompare(
      a?.arbeitsplatz?.name || 'zzz',
      b?.arbeitsplatz?.name || 'zzz'
    );

    if (roomCompare === 0) {
      return numericLocaleCompare(
        a?.mitarbeiter?.planname || '',
        b?.mitarbeiter?.planname || ''
      );
    }

    return roomCompare;
  }

  createAllEinteilungen(be, dayCol, shouldCountEmptySpots, po_dienst) {
    const allCurrentEinteilungen = be.felder
      .map((f) => f.einteilung)
      .sort(this.sortByRoomAndPlanname);

    const einteilungen = [];
    const optEinteilungen = [];
    const emptyFields = [];

    allCurrentEinteilungen.forEach((e) => {
      if (e.is_optional) optEinteilungen.push(e);
      else einteilungen.push(e);
    });
    const optLength = be.opt - optEinteilungen.length;
    if (!be?.isFull) {
      for (let i = einteilungen?.length; i < be.min + optLength; i++) {
        emptyFields.push(defaultEmptyField);
        if (shouldCountEmptySpots && i < be.min) {
          const fieldId = `${dayCol}_${be.dienst.id}_${i}`;
          if (!this.emptyWorkSpots.includes(fieldId)) {
            this.emptyWorkSpots.push(fieldId);
          }
        }
      }
    }
    return [...einteilungen, ...emptyFields, ...optEinteilungen];
  }

  getContent(
    bereich,
    dayCol,
    sortOneColList = false,
    callback = false,
    shouldCountEmptySpots = false
  ) {
    const result = [];
    const { bereich_id, po_dienst_id, isOneColList, isOneCol, isDienstfrei } =
      bereich;
    const callBackFunc = this._isFunction(callback) ? callback : (x) => x;
    if (isDienstfrei) {
      const allDienstfrei = this.getPoDiensteDienstfrei(dayCol);
      allDienstfrei
        .sort((a, b) => (a.po_dienst?.order || 0) - (b.po_dienst?.order || 0))
        .forEach((dienstfrei, index) => {
          const { po_dienst, einteilungen } = dienstfrei;
          const params = {
            po_dienst,
            einteilungen,
            dienstfrei,
            allDienstfrei,
            index,
            label: po_dienst?.planname || ''
          };
          result.push(callBackFunc(params));
        });
    } else {
      const allDienste = this.getPoDienste(bereich_id, po_dienst_id);
      const bedarfseintraege = this._bedarfseintraege;
      allDienste.forEach((po_dienst, index) => {
        const params = {
          po_dienst,
          einteilungen: [],
          be: null,
          gesamtBedarf: -1,
          allDienste,
          index,
          label: po_dienst?.planname || ''
        };
        const bedarf = this.data.getBedarf(dayCol, bereich_id, po_dienst.id);
        let hasNoBedarf = true;
        let bedarfIdsHash = {0: [bedarf?.id]};
        if(!bereich_id && bedarf?.id) {
          bedarfIdsHash = this.data.getBedarfsBereiche(dayCol, po_dienst.id);
        }
        if (this._isObject(bedarfIdsHash)) {
          Object.values(bedarfIdsHash).forEach((beArr) => {
            beArr.forEach((beId) => {
              const be = bedarfseintraege?.[beId];
              if(!be?.id) return;
              params._bereich = !bereich_id && be?.bereich;
              params.label = params._bereich?.planname || po_dienst?.planname || '';
              hasNoBedarf = false;
              params.einteilungen = this.createAllEinteilungen(
                be,
                dayCol,
                shouldCountEmptySpots,
                po_dienst
              );
              params.gesamtBedarf = be.gesamtBedarf;
              params.be = be;
              result.push(callBackFunc(params));
            });
          });
        }
        if(hasNoBedarf) {
          params.einteilungen = this.getPoDienstEinteilungen(
            po_dienst.id,
            dayCol,
            true
          );
          if ((isOneColList || isOneCol) && sortOneColList) {
            params.einteilungen.sort(sortEinteilungenByPlanname);
          }
          result.push(callBackFunc(params));
        }
      });
    }
    return result;
  }

  getEinteilungenIds() {
    const einteilungen_ids = [];
    this.data?.eachVerteilerDate?.((dayCol) => {
      if (!this._isObject(this.data?.felder?.[dayCol])) return;
      Object.keys(this.data.felder[dayCol]).forEach((po_dienst_id) => {
        this.data.felder[dayCol][po_dienst_id].forEach((feld) => {
          if (!feld?.einteilung_id) return;
          einteilungen_ids.push(feld.einteilung_id);
        });
      });
    });
    return einteilungen_ids;
  }

  publish(cb) {
    const formData = new FormData();
    formData.append('dienstplan_ids', this.dienstplan_ids.join(', '));
    formData.append('dates', this.data.verteiler_dates.join(', '));
    if (!this?._hains?.api) {
      cb?.(false);
      return;
    }
    this._hains.api('publish_verteiler', 'post', formData).then(
      (response) => {
        let msg = '';
        if (!response?.uploaded) {
          msg += response?.info || 'Fehler beim Hochladen';
        }
        if (!response?.einteilungen?.einteilungen) {
          msg +=
            `\n${response?.einteilungen?.info}` ||
            '\nKeine Einteilungen gefunden';
        }
        msg && alert(msg);
        cb?.(response);
      },
      (e) => {
        returnError(e);
        cb?.(e);
      }
    );
  }

  /** Setxt die maximale min-height für jeden Spalte einer Zeile */
  setHeightInDom() {
    const dwccs = document.querySelectorAll(
      'div.daycol-wrapper div.day-col div.content-container'
    );
    const ccSize = dwccs.length / 7;
    const verteilerWrapper = document.querySelector('div.verteiler-wrapper');

    for (let i = 1; i <= ccSize; i++) {
      let maxHeight = 0;
      const dayCols = document.querySelectorAll(
        `div.daycol-wrapper div.day-col div.content-container:nth-child(${i})`
      );

      dayCols.forEach((daycol) => {
        const height = parseInt(daycol.getBoundingClientRect().height, 10);
        if (height > maxHeight) {
          maxHeight = height;
        }
      });

      dayCols.forEach((daycol) => {
        daycol.style.minHeight = `${maxHeight}px`;
        if (verteilerWrapper.classList.contains('print')) {
          daycol.style.removeProperty('min-height');
        }
      });
    }
  }

  /**
   * erstellt die Wochenverteiler-Tabelle als CSV-Datei
   * @returns {Object} data
   */
  downloadCSV() {
    const data = this.prepareData(true);
    const table = data?.table;
    if (!table) return;
    let csvData = '';
    const add = (columns) => {
      if (!columns.reduce) return;
      csvData += `${columns
        .reduce((arr, obj) => {
          const span = parseInt(obj?.colSpan, 10);
          if (!span) return arr;
          let content = obj?.content || '';
          for (let i = 1; i < span; i++) {
            content += ';""';
          }
          arr.push(content);
          return arr;
        }, [])
        .join(';')}\n`;
    };
    table.head.forEach(add);
    table.body.forEach(add);
    table.foot.forEach(add);
    return downloadCSV(csvData, this.filename);
  }

  /**
   * Diese Methode iteriert über die Bereich-Wochenverteiler bzw. Bereich-Tagesverteiler.
   * Sie muss in dem entsprechenden Verteiler implementiert werden.s
   * @param {Function} callback
   */
  eachBereichOrDienst(callback) {}

  /**
   * Führt automatische Einteilungen in der API durch
   * @param {Function} setLoading
   */
  autoEinteilen(setLoading) {
    const first = this.data.verteiler_dates[0];
    const l = this.data.verteiler_dates.length;
    const last =
      l > 1 ? this.data.verteiler_dates[l - 1] : formatDate(addDays(first, 1));
    autoEinteilen(first, last, setLoading);
  }

  showBereich(bereich) {
    const userBereiche = this.data.user_settings.bereiche;
    return (
      (bereich.bereich_id &&
        userBereiche?.find?.((b) => b.bereich_id === bereich.bereich_id)) ||
      (bereich.po_dienst_id &&
        userBereiche?.find?.((b) => b.po_dienst_id === bereich.po_dienst_id)) ||
      userBereiche === undefined
    );
  }

  cleanupPopupExtras() {
    this.popupExtras = false;
  }
}
export default Verteiler;
