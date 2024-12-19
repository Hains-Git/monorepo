import Spinner from '../../components/utils/spinner/Spinner';
import CustomButton from '../../components/utils/custom_buttons/CustomButton';
import {
  addDays,
  addMonths,
  addWeeks,
  formatDate,
  today
} from '../../tools/dates';
import Info from '../../components/utils/info/Info';
import styles from './home.module.css';

const pushRoutes = [
  {
    route: '/tagesverteiler?date=',
    text: 'Aktueller Tag',
    getParams: () => formatDate(today()),
    check: (user) => user?.showTV
  },
  {
    route: '/tagesverteiler?date=',
    text: 'Aktueller Tag + 1',
    getParams: () => formatDate(addDays(today(), 1)),
    check: (user) => user?.showTV
  },
  {
    route: '/wochenverteiler?date=',
    text: 'Aktuelle Woche',
    getParams: () => formatDate(today()),
    check: (user) => user?.showWV
  },
  {
    route: '/wochenverteiler?date=',
    text: 'Aktuelle Woche + 1',
    getParams: () => formatDate(addWeeks(today(), 1)),
    check: (user) => user?.showWV
  },
  {
    route: '/dienstplaner/monatsplanung?date=',
    text: 'Aktueller Monat',
    getParams: () => formatDate(addMonths(today(), 0)),
    check: (user) => user?.showDienstplaner
  },
  {
    route: '/dienstplaner/monatsplanung?date=',
    text: 'Aktueller Monat + 1',
    getParams: () => formatDate(addMonths(today(), 1)),
    check: (user) => user?.showDienstplaner
  },
  {
    route: '/dienstplaner/monatsplanung?date=',
    text: 'Aktueller Monat + 2',
    getParams: () => formatDate(addMonths(today(), 2)),
    check: (user) => user?.showDienstplaner
  },
  {
    route: '/dienstplaner/monatsplanung?date=',
    text: 'Aktueller Monat + 3',
    getParams: () => formatDate(addMonths(today(), 3)),
    check: (user) => user?.showDienstplaner
  },
  {
    route: 'rotationsplanung',
    text: 'Rotationen',
    check: (user) => user?.isRotationsplaner
  },
  {
    route: '/antraege',
    text: 'Abwesenheitsanträge',
    check: (user) => user?.showDienstplaner
  },
  {
    route: '/abwesentheitsliste',
    text: 'Abwesenheitsliste',
    check: (user) => user?.showDienstplaner
  },
  {
    route: '/freigaben',
    text: 'Freigaben',
    check: (user) => user?.isDienstplaner
  },
  {
    route: '/mitarbeiterinfo',
    text: 'Mitarbeiter Informationen',
    check: (user) => user?.isDienstplaner
  },
  {
    route: '/datenbank',
    text: 'Einstellungen',
    check: (user) => user?.isAdmin
  },
  {
    route: '/pep',
    text: 'PEP Einsatzplan',
    check: (user) => user?.isDienstplaner
  }
];

function Home({ user, history, appModel }) {
  const getPage = () => {
    if (!user) return null;
    if (!appModel)
      return <Spinner showText text="Modell wird initialisiert..." />;
    return (
      <div className={styles.lead_container}>
        <div className={styles.lead_container_buttons}>
          {pushRoutes.map((obj) => {
            return !obj?.check || obj?.check?.(user) ? (
              <CustomButton
                key={obj.text}
                className={styles.lead}
                clickHandler={() =>
                  history.push(
                    `${obj.route}${obj.getParams ? obj.getParams() : ''}`
                  )
                }
              >
                {obj.text}
              </CustomButton>
            ) : null;
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.home_container}>
      {appModel && <Info parent={appModel} />}
      <h1>Willkommen im Planer</h1>
      {user?.name && <h2>{user.name}</h2>}
      <br />
      {getPage()}
    </div>
  );
}

export default Home;
