import { development, showConsole } from '../tools/flags';
import Channel from './helper/channel';

/**
 * Erstellt ein neues Channel-Objekt für den Dienstplan
 */
class AppChannel extends Channel {
  constructor(appModel = false) {
    super('app', appModel, appModel, false);
    this.setUserNames();
    this._setArray('queue', []);
    this._set('intervalId', null);
    this._set('timeout', true);
    this.setTime();
    this.setChatMessages();
    this._preventExtension();
    if (showConsole) this._whoAmI();
  }

  /**
   * True, wenn usernames existieren
   */
  get hasChatPartner() {
    return !!this.userNames?.length;
  }

  /**
   * Gibt die Usernamen zurück
   */
  get _userInfo() {
    const info = {
      value: {
        usernames: { value: {}, label: 'Eingeloggt' }
      },
      label: 'Channel',
      ignore: !this.usernames?.length
    };
    this.userNames?.forEach?.((obj, i) => {
      info.value.usernames.value[i] = { value: '', label: obj.name };
    });
    return info;
  }

  get show() {
    return (
      this.online &&
      this.time &&
      (this.timeout || parseInt(this.time.split(':').join(''), 10) < 100)
    );
  }

  get expiresDiff() {
    const auth = this?._hains?.getAuthResponse?.();
    let time = 0;
    if(auth) {
      const currentTime = (new Date()).getTime() / 1000;
      if(auth?.expires) {
        time = Math.round(auth.expires - currentTime);
      }
    }
    return time;
  }

  /**
   * Setzt das online Attribut
   * @param {Boolean} bool
   */
  setOnline(bool = false) {
    super.setOnline(bool);
    this.update('timer', {});
  }

  setTime() {
    const diffInSeconds = this.expiresDiff;
    let minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds - minutes * 60;
    if(minutes > 59) {
      minutes = 59;
    }
    this._set('time', diffInSeconds > 0 ? `${this.getTimeString(minutes)}:${this.getTimeString(seconds)}` : '00:00');
    this._set('timeout', diffInSeconds <= 0);
    this.update('timer', {});
  }

  startInterval() {
    if (this.online && this?._hains?.api) {
      this.stopInterval();
      this.setTime();
      const id = setInterval(() => {
        if (!this.time) return;
        this.setTime();
      }, 1000);
      this._set('intervalId', id);
    }
  }

  stopInterval() {
    if (this.inverfalId !== null) {
      clearInterval(this.intervalId);
      this._set('intervalId', null);
      this._set('timeout', true);
      this.setTime();
    }
  }

  /**
   * Setzt die Nutzernamen der eingeloggten Nutzer
   * @param {Object} userNames
   */
  setUserNames(userNames = []) {
    this._setArray('userNames', userNames);
    this.resetChatPartner();
  }

  localReceive(data = {}) {
    if (data?.usernames) {
      this.setUserNames(data.usernames);
    }
    if (data?.chat) {
      this.setChatMessages(data.chat);
    }
  }

  /**
   * Cache und Usernamen aktualisieren
   * @param {Object} data
   */
  receive(data = false) {
    if (development) console.log('AppChannel received:', data);
    this.localReceive(data);
    this?.parent?.updateAllCachedDienstplaeneThroughChannel?.(data);
    this.queue?.push?.(data);
    this.receivePageChannel();
  }

  /**
   * Sendet die Daten aus dem Queue an den seitenspezifischen Channel
   */
  receivePageChannel() {
    const page = this?.parent?.page;
    while (page && this.queue?.length) {
      const firstData = this.queue?.shift?.();
      page?.channel?.receive?.(firstData);
    }
  }

  /**
   * Set the Attribute chatMessages
   * @param {Array} messages
   */
  setChatMessages(messages = []) {
    this._set('newMessages', !!(messages?.length || 0));
    this._setArray('chatMessages', messages?.map?.((obj, index) => {
      const old = this?.chatMessages?.[index];
      obj.read = old?.read || false;
      if(!obj.read) this._set('newMessages', true);
      return obj;
    }));
    this.update('chat', {});
    this._update();
  }

  /**
   * Setzt den Index des Chatpartners
   * @param {Object} user
   */
  setChatPartnerStart(user = { id: 0, name: '', index: 0 }) {
    this._set('chatPartnerStart', user?.index || 0);
    this._set('chatPartner', user);
    this.update('chat', {});
  }

  /**
   * Sendet eine Chatnachricht
   * @param {String} message
   */
  sendChatMessage(message = '') {
    if (message) {
      this.channel?.perform?.('send_message', {
        message,
        to: this.chatPartner?.id || 0
      });
    }
  }

  /**
   * Erstell ein Array mit den Chatnachrichten
   * @param {Function} callback
   * @returns {Array}
   */
  getChatMessages(callback) {
    this._set('newMessages', false);
    this._update();
    return (
      this.chatMessages?.map?.((obj, i) =>{
        obj.read = true;
        return callback?.(
          obj?.message,
          `${obj?.name} (${obj?.time})`,
          obj?.id === this?._user?.id,
          i
        ) || obj;
      }
      ) || []
    );
  }

  /**
   * Erstellt ein Array mit den möglichen Chatpartnern
   */
  getChatPartner() {
    return this.userNames?.map?.((obj, i) => ({ ...obj, index: i })) || [];
  }

  /**
   * Führt ein reset des Chatpartners durch
   */
  resetChatPartner() {
    const current = this.userNames?.find?.(
      (obj) => obj.id === this.chatPartner?.id
    );
    if (current) this.setChatPartnerStart(current);
    else if (this.hasChatPartner)
      this.setChatPartnerStart({
        ...this.userNames[0],
        index: 0
      });
    else this.setChatPartnerStart();
  }

  getTimeString(nr) {
    const zeroStr = '00';
    const str = nr?.toString?.()?.padStart?.(2, '0') || zeroStr;
    if (/^([0-5][0-9]|60)$/.test(str)) return str;
    return zeroStr;
  }
}

export default AppChannel;

