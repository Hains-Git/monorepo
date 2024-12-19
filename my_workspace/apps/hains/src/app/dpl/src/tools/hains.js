import hello from 'hellojs/dist/hello.all';
import { isObject } from './types';
import { gets, posts } from '../../joomla/helper/hains';
import { development } from './flags';

function formatUser(o) {
  if (o.id) {
    o.name = o.login;
  }
}

const formatO = (o) => {
  if (typeof o !== 'object') {
    return { data: o };
  }
  return o;
};

// Hains init for OAuth
export const hains = () => {
  const namespace = 'dienstplaner/';
  const host = 'http://localhost';

  function formatError(o, headers) {
    const code = headers ? headers.statusCode : o && 'meta' in o && 'status' in o.meta && o.meta.status;
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

  // const host = "https://hains.info";
  // Hains login
  hello.init(
    {
      hains: {
        name: 'HAINS',
        // base/auth/grant: 'https://hains.info/api/',
        oauth: {
          version: 2,
          auth: `${host}/api/oauth/authorize`,
          // grant: `${host}/api/oauth/token`,
          // grant: 'http://hains_api:3000/api/oauth/token',
          // response_type: 'code'
          response_type: 'token'
        },
        // oauth_proxy: `${host}/oauthproxy/`,
        scope: {
          email: 'user:email'
        },
        base: `${host}/api/`,
        get: {
          ...gets,
          me: `${namespace}me`,
          monatsplanung(p, callback) {
            callback(`${namespace}monatsplanung/${p.query.anfang}`);
            // callback(`http://localhost:3020/api/dienstplanung`);
          },
          get_dienstplaene: `${namespace}get_dienstplaene`,
          app_data: `${namespace}api_models`,
          // app_data: `http://localhost:3020/api/apidata`,
          einteilungshistory: `${namespace}einteilungshistory`,
          dienstplan_screenshot: `${namespace}dienstplan_screenshot`,
          einteilungshistory_intervall: `${namespace}einteilungshistory_intervall`,
          vk_team_overview(p, callback) {
            callback(`${namespace}vk_team_overview/${p.query.anfang}/${p.query.ende}`);
          }
        },
        // Routes to post Data
        post: {
          ...posts,
          update_vorlagen: `${namespace}updatevorlagen`,
          delete_vorlagen: `${namespace}destroyvorlagen`,
          update_standard: `${namespace}updatestandard`,
          update_position: `${namespace}updateposition`,
          einteilen: `${namespace}einteilen`,
          update_feld: `${namespace}updatedienstplancustomfeld`,
          destroy_feld: `${namespace}destroydienstplancustomfeld`,
          update_counter: `${namespace}updatedienstplancustomcounter`,
          destroy_counter: `${namespace}destroydienstplancustomcounter`,
          rotationen: `${namespace}rotations_interval`,
          update_rotation: `${namespace}update_rotation`,
          delete_rotation: `${namespace}delete_rotation`,
          check_rotation: `${namespace}check_rotation`,
          update_verteiler: `${namespace}update_verteiler`,
          update_tagesverteiler_layout: `${namespace}update_tagesverteiler_layout`,
          update_einteilung: `${namespace}update_einteilung`,
          einteilung_aufheben: `${namespace}einteilung_aufheben`,
          room_changed: `${namespace}room_changed`,
          update_einteilungsstatus_id: `${namespace}update_einteilungsstatus_id`,
          save_comment: `${namespace}save_comment`,
          update_user_settings_tv: `${namespace}update_user_settings_tv`,
          publish: `${namespace}publish`,
          save_user_settings: `${namespace}update_user_settings`,
          get_antraege: `${namespace}get_all_antraege`,
          get_antraege_by_date: `${namespace}get_antraege_by_date`,
          get_antraege_by_myedits: `${namespace}get_antraege_by_myedits`,
          get_antraege_by_completed: `${namespace}get_antraege_by_completed`,
          add_antrag: `${namespace}add_antrag`,
          add_antrag_in_history: `${namespace}add_antrag_in_history`,
          delete_antraege_by_ids: `${namespace}delete_antraege_by_ids`,
          update_einteilungen_status: `${namespace}update_einteilungen_status`,
          publish_verteiler: `${namespace}publish_verteiler`,
          get_saldi: `${namespace}get_saldi`,
          update_verteiler_vorlagen: `${namespace}update_verteiler_vorlagen`,
          remove_verteiler_vorlagen: `${namespace}remove_verteiler_vorlagen`,
          get_einteilungen_ohne_bedarf: `${namespace}get_einteilungen_ohne_bedarf`,
          save_abwesentheiten_settings: `${namespace}save_abwesentheiten_settings`,
          create_counter_abwesentheiten: `${namespace}create_counter_abwesentheiten`,
          remove_counter_abwesentheiten: `${namespace}remove_counter_abwesentheiten`,
          load_abwesentheiten: `${namespace}load_abwesentheiten`,
          auto_einteilen: `${namespace}auto_einteilen`,
          get_einteilungen_for_antraege: `${namespace}get_einteilungen_for_antraege.json`,
          set_wunsch: `${namespace}wunsch_master.json`
        },
        wrap: {
          me(o, headers) {
            const formatedO = formatO(o);
            formatUser(formatedO);
            return formatError(formatedO, headers);
          },
          default(o, headers) {
            return formatError(formatO(o), headers);
          }
        },
        xhr(p) {
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
      // force: true // remove if something goes wrong
      force: false
    }
  );

  hello.init(
    {
      hains: '73d6c8d376673bfb1456b09f93b0caf317c3739dd6f853baf3f95a8ade012476'
    },
    {
      // redirect_uri : 'https://hains.info/dpl',
      display: 'page',
      // display: "popup",
      // force: true,
      oauth_proxy: ''
      // oauth_proxy: `${host}/oauthproxy/`
    }
  );
};

export const returnError = (reason) => {
  development && console.log('returnError', reason);
  if (isObject(reason) && reason.error) {
    if (reason.error.logout) {
      alert(`Ihre Sitzung ist abgelaufen!\n(${reason.error.code})\nBitte neu anmelden.`);
      hello('hains').logout();
    } else {
      alert(reason.error.code);
    }
  } else {
    alert('Es gab ein Problem!');
  }
};
