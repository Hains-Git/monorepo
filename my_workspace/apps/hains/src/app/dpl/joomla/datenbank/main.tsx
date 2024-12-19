import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ErrorBoundary from '../components/utils/error-boundarie/ErrorBoundarie';
import styles from '../index.module.css';
import App from './App';
import LoginLogout from '../components/utils/login/LoginLogout';
import { development } from '../helper/flags';
import { UseLogin } from '../hooks/use-login';

const rootElement = document.getElementById('react-root');
function ReactApp() {
  const { hainsOAuth, user, loginOnClick, logoutOnClick } = UseLogin();
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          {development && (
            <LoginLogout
              user={user}
              loginOnClick={loginOnClick}
              logoutOnClick={logoutOnClick}
            />
          )}
          <h1>Datenbank</h1>
          <App user={user} hainsOAuth={hainsOAuth} />
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

if (rootElement) {
  rootElement.className = styles.react_root;
  ReactDOM.createRoot(rootElement).render(<ReactApp />);
}
