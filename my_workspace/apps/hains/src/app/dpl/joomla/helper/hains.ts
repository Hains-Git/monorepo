import hello from 'hellojs/dist/hello.all';
import { isObject } from './types';
import { Reason } from './ts_types';

const namespace = 'dienstplaner/';

/**
 * Formatiert die Userdaten.
 * @param {any} o
 * @returns {any} Formatierte Userdaten
 */
function formatUser(o: any): any {
  if (o.id) {
    o.name = o.login;
  }
  return o;
}

/**
 * Formatiert die Daten.
 * @param {any} o
 * @returns {any} Formatierte Daten
 */
const formatO = (o: any): any => {
  if (typeof o !== 'object') {
    return { data: o };
  }
  return o;
};

/**
 * Formatiert die Fehler.
 * @param {any} o
 * @param {any} headers
 * @returns {any} Formatierte Daten
 */
function formatError(o: any, headers: any): any {
  const code = headers ? headers.statusCode : o?.meta?.status;
  let msg = 'Es gab Probleme mit dem Client';
  let logout = false;
  let codeTxt = 'client_failed';

  if (code >= 400) {
    if (code === 401 || code === 403) {
      codeTxt = 'access_denied';
      logout = true;
    } else if (code >= 500) {
      o = {};
      codeTxt = 'server_failed';
      msg = 'Es gab Probleme mit dem Server';
      logout = code >= 503;
    }

    if (isObject(o)) {
      o.error = {
        code: codeTxt,
        message: o.message || (o.data ? o.data.message : msg),
        logout
      };
      delete o.message;
    }
  }

  return o;
}

export const gets = {
  me: `${namespace}me`,
  monatskonflikte: `${namespace}monatskonflikte.json`,
  vk_overview(p: any, callback: any) {
    callback(`${namespace}vk_overview/${p.query.anfang}/${p.query.ende}`);
  },
  rotation_in_month: `${namespace}rotation_in_month.json`,
  list_freigabetypen: `${namespace}getfreigabetypslist.json`,
  list_aktive_arzte: `${namespace}getmitarbeiterlist_aktiv_ohne.json`,
  list_funktionen: `${namespace}get_funktionen.json`,
  list_freigabestatus: `${namespace}freigabestatuslist.json`,
  freigaben: `${namespace}dienstfreigabes.json`,
  get_all_user_data: `${namespace}get_all_user_data.json`,
  get_list_mailer_context: `${namespace}get_list_mailer_context.json`,
  get_merkmale(p: any, callback: any) {
    callback(`${namespace}get_merkmale/${p.query.id}`);
  },
  toggle_abwesend(p: any, callback: any) {
    callback(`${namespace}mitarbeiter/toggle_abwesend/${p.query.id}`);
  },
  db_list(p: any, callback: any) {
    callback(`${namespace}get${p.query.routeBase}list`);
  },
  get_team_vks(p: any, callback: any) {
    callback(`${namespace}get_team_vks/${p.query.tag}`);
  },
  db_getter(p: any, callback: any) {
    callback(`${namespace}${p.query.routeBase}`);
  },
  bedarfs_preview(p: any, callback: any) {
    callback(`${namespace}bedarfs_preview/${p.query.year}`);
  },
  zeitraumkategorien_preview(p: any, callback: any) {
    callback(`${namespace}zeitraumkategorien_preview/${p.query.year}`);
  },
  geteinteilungen_by_m(p: any, callback: any) {
    callback(`${namespace}mitarbeiter/einteilungen/${p.query.mitarbeiter_id}`);
  },
  get_mitarbeiter_details(p: any, callback: any) {
    callback(`${namespace}mitarbeiterdetails/${p.query.mitarbeiter_id}`);
  },
  get_notes_for_detail_page(p: any, callback: any) {
    callback(`${namespace}get_notes_for_detail_page/${p.query.mitarbeiter_id}`);
  },
  get_dateien(p: any, callback: any) {
    callback(`${namespace}v1.04/dateien/${p.query.mitarbeiter_id}`);
  },
  getVertrags(p: any, callback: any) {
    callback(`${namespace}vertrags/${p.query.id}`);
  },
  preview_mailer_context(p: any, callback: any) {
    callback(`${namespace}preview_mailer_context/${p.query.id}`);
  },
  list_pdf_layouts: `${namespace}list_pdf_layouts`
};

export const posts = {
  update_freigabe: `${namespace}freigabenupdate.json`,
  create_new_user: `${namespace}create_new_user.json`,
  delete_datei: `${namespace}delete_datei.json`,
  set_employee_active: `${namespace}set_employee_active.json`,
  set_employee_inactive: `${namespace}set_employee_inactive.json`,
  get_employee_ids_by_teamid: `${namespace}get_employee_ids_by_teamid.json`,
  pep_einsatzplan: `${namespace}pep_einsatzplan.json`,
  db_update(p: any, callback: any) {
    callback(`${namespace}update${p.data.routeBase}`);
  },
  db_delete(p: any, callback: any) {
    callback(`${namespace}destroy${p.data.routeBase}/${p.data.id}`);
  },
  rotationsupdate: `${namespace}rotationsupdate.json`,
  removerotation: `${namespace}removerotation.json`,
  freigabenupdate: `${namespace}freigabenupdate.json`,
  updaterating: `${namespace}updaterating.json`,
  update_note: `${namespace}update_note.json`,
  add_new_note_category: `${namespace}add_new_note_category.json`,
  wunsch_master: `${namespace}wunsch_master.json`,
  vertragsupdate: `${namespace}vertragsupdate.json`,
  phasenupdate: `${namespace}phasenupdate.json`,
  vertrag_arbeitszeitupdate: `${namespace}vertrag_arbeitszeitupdate.json`,
  password_reset: `${namespace}password_reset.json`,
  welcome_new_user: `${namespace}welcome_new_user.json`,
  edit_mailer_addresse: `${namespace}edit_mailer_addresse.json`,
  edit_mailer_context: `${namespace}edit_mailer_context.json`,
  delete_mailer_context(p: any, callback: any) {
    callback(`${namespace}delete_mailer_context/${p.data.id}`);
  }
};

// Hains init for OAuth
/**
 * Initialisiert die Hains-Verbindung.
 */
export const hains = () => {
  const host = 'http://localhost';
  // const host = "https://hains.info";

  /**
   * Initialisiert die Hains-Oauth-Verbindung.
   */
  hello.init(
    {
      hains: {
        name: 'HAINS',
        // base/auth/grant: 'https://hains.info/api/',
        oauth: {
          version: 2,
          auth: `${host}/api/oauth/authorize`,
          grant: `${host}/api/oauth/access_token`,
          response_type: 'token'
        },
        scope: {
          email: 'user:email'
        },
        base: `${host}/api/`,
        get: gets,
        post: posts,
        wrap: {
          me(o: any, headers: any) {
            const formatedO = formatO(o);
            formatUser(formatedO);
            return formatError(formatedO, headers);
          },
          default(o: any, headers: any) {
            return formatError(formatO(o), headers);
          }
        },
        xhr(p: any) {
          if (p.method !== 'get' && p.data) {
            p.headers = p.headers || {};
            if (p.data instanceof FormData) {
              // p.headers['Content-Type'] = 'multipart/form-data';
            } else {
              p.headers['Content-Type'] = 'application/json';
              if (typeof p.data === 'object') {
                p.data = JSON.stringify(p.data);
              }
            }
          }
          return true;
        }
      }
    },
    {
      // display: 'page'
      display: 'none', // IF something does not work, remove this code
      force: false // remove if something goes wrong
    }
  );

  /**
   * Initialisiert die Hello-Oauth-Verbindung zu HAINS.
   */
  hello.init(
    {
      hains: '9640f80109b13ee02ae221a844b9782b6585689bf1ae0809b35a6adefd3540b8'
    },
    {
      // redirect_uri : 'https://hains.info/dpl',
      display: 'page',
      // display: "popup",
      oauth_proxy: ''
    }
  );
};

/**
 * Gibt die Fehlermeldung aus.
 * @param {Reason} reason
 * @returns {Reason} Fehlerursache
 */
export const returnError = (reason: Reason): Reason => {
  if (reason.error?.logout) {
    alert(
      `Ihre Sitzung ist abgelaufen!\n(${reason.error?.code})\nBitte neu anmelden.`
    );
    hello('hains').logout();
  } else {
    let msg = 'Es gab ein Problem!';
    if (typeof reason?.error?.code === 'string') {
      msg += `\n${reason.error.code}`;
    } else if (typeof reason?.error === 'string') {
      msg += `\n${reason.error}`;
    }
    alert(msg);
  }
  return reason;
};
