import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Spinner from '../components/utils/spinner/Spinner';
import Home from '../pages/home/Home';
import { getAllowedPaths } from '../pages/navigation/Navigation';
import { hainsOAuth } from '../tools/helper';
import useDocumentTitle from '../hooks/use-document-title';

// Lazy Loading the Pages

const JoomlaWrapper = React.lazy(
  () => import('../pages/joomla-wrapper/JoomlaWrapper')
);
const Freigaben = React.lazy(() => import('../../joomla/freigaben/App'));
const Datenbank = React.lazy(() => import('../../joomla/datenbank/App'));
const Pep = React.lazy(() => import('../../joomla/pep_einsatzplan/App'));
const VkUebersicht = React.lazy(() => import('../../joomla/vkoverview/App'));
const PDFLayoutView = React.lazy(
  () => import('../../joomla/publish_pdf_view/App')
);
const MitarbeiterInfo = React.lazy(
  () => import('../../joomla/mitarbeiterinfo/App')
);
const DbMail = React.lazy(() => import('../../joomla/db_mail/App'));

const Rotationsplanung = React.lazy(
  () => import('../pages/rotationsplanung/Rotationsplanung')
);
const Tagesverteiler = React.lazy(
  () => import('../pages/tagesverteiler/Tagesverteiler')
);
const Wochenverteiler = React.lazy(
  () => import('../pages/wochenverteiler/Wochenverteiler')
);
const Urlaubsantraege = React.lazy(
  () => import('../pages/urlaubsantraege/Urlaubsantraege')
);
const Urlaubsliste = React.lazy(
  () => import('../pages/urlaubsliste/Urlaubsliste')
);
const Dienstplaner = React.lazy(
  () => import('../pages/dienstplaner/Dienstplaner')
);
const FAQ = React.lazy(() => import('../pages/faq/FAQ'));

const loader = () => <Spinner showText text="Seite wird geladen..." />;

function AllowWrapper({ children, allowedPaths, allow, path }) {
  const location = useLocation();

  const getTitle = () => {
    const locationPath = location.pathname;
    const allowedPath = allowedPaths[locationPath];
    let title = '';
    if (allowedPath) {
      title =
        typeof allowedPath?.label === 'string'
          ? allowedPath.label
          : allowedPath.title;
    }
    switch (path) {
      case '/mitarbeiterinfo': {
        const searchParams = new URLSearchParams(location.search);
        const view = searchParams.get('view');
        if (view === 'edit') title = 'Benutzerformular';
        else if (view === 'detail') title = 'Mitarbeiterdetails';
        else if (view === 'vertrag') title = 'Mitarbeiterverträge';
        break;
      }
      case '/datenbank': {
        const searchParams = new URLSearchParams(location.search);
        const model = searchParams.get('model');
        if (model) title += ` - ${model[0].toUpperCase()}${model.slice(1)}`;
      }
    }
    return title || 'Dienstplaner';
  };

  useDocumentTitle(getTitle());

  return (
    allowedPaths[allow] && (
      <Route path={path}>
        <Suspense fallback={loader()}>{children}</Suspense>
      </Route>
    )
  );
}

function Routes({ user, appModel, withAppModelData, history }) {
  const allowedPaths = getAllowedPaths(user);

  return (
    <Switch>
      <AllowWrapper
        allow="/rotationsplanung"
        path="/rotationsplanung"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Rotationsplanung)}
      </AllowWrapper>

      <AllowWrapper
        allow="/tagesverteiler"
        path="/tagesverteiler"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Tagesverteiler)}
      </AllowWrapper>

      <AllowWrapper
        allow="/wochenverteiler"
        path="/wochenverteiler"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Wochenverteiler)}
      </AllowWrapper>

      <AllowWrapper
        allow="/antraege"
        path="/antraege"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Urlaubsantraege)}
      </AllowWrapper>

      <AllowWrapper
        allow="/abwesentheitsliste"
        path="/abwesentheitsliste"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Urlaubsliste)}
      </AllowWrapper>

      <AllowWrapper
        allow="/dienstplaner/monatsplanung"
        path="/dienstplaner/:name"
        allowedPaths={allowedPaths}
      >
        {withAppModelData(Dienstplaner)}
      </AllowWrapper>

      <AllowWrapper
        allow="/freigaben"
        path="/freigaben"
        allowedPaths={allowedPaths}
      >
        <JoomlaWrapper user={user}>
          <Freigaben user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper
        allow="/mitarbeiterinfo"
        path="/mitarbeiterinfo"
        allowedPaths={allowedPaths}
      >
        <JoomlaWrapper user={user}>
          <MitarbeiterInfo user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper
        allow="/datenbank"
        path="/datenbank"
        allowedPaths={allowedPaths}
      >
        <JoomlaWrapper user={user}>
          <Datenbank user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper
        allow="/pdf_layout_view"
        path="/pdf_layout_view"
        allowedPaths={allowedPaths}
      >
        <JoomlaWrapper user={user}>
          <PDFLayoutView user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper allow="/pep" path="/pep" allowedPaths={allowedPaths}>
        <JoomlaWrapper user={user}>
          <Pep user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper allow="/mailer" path="/mailer" allowedPaths={allowedPaths}>
        <JoomlaWrapper user={user}>
          <DbMail user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper allow="/vks" path="/vks" allowedPaths={allowedPaths}>
        <JoomlaWrapper user={user}>
          <VkUebersicht user={user} hainsOAuth={hainsOAuth} />
        </JoomlaWrapper>
      </AllowWrapper>

      <AllowWrapper allow="/faq" path="/faq" allowedPaths={allowedPaths}>
        {withAppModelData(FAQ)}
      </AllowWrapper>

      <AllowWrapper allow="/" path="/" allowedPaths={allowedPaths}>
        <Home user={user} history={history} appModel={appModel} />
      </AllowWrapper>
    </Switch>
  );
}

export default Routes;
