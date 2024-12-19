import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from '../components/utils/error-boundarie/ErrorBoundarie';
import styles from '../index.module.css';
import App from './App';
import { UseLogin } from '../hooks/use-login';
import LoginLogout from '../components/utils/login/LoginLogout';
import { development } from '../helper/flags';

const rootElement = document.getElementById('react-root');
function ReactApp() {
  const { hainsOAuth, user, loginOnClick, logoutOnClick } = UseLogin();
  return (
    <React.StrictMode>
      <ErrorBoundary>
        {development && (
          <LoginLogout
            user={user}
            loginOnClick={loginOnClick}
            logoutOnClick={logoutOnClick}
          />
        )}
        <h1>Konflikte Liste</h1>
        <App user={user} hainsOAuth={hainsOAuth} />
      </ErrorBoundary>
    </React.StrictMode>
  );
}

if (rootElement) {
  rootElement.className = styles.react_root;
  ReactDOM.createRoot(rootElement).render(<ReactApp />);
}
