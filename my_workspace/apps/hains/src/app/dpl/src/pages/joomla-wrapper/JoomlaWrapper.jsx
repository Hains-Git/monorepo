import React, { Suspense } from 'react';
import Spinner from '../../components/utils/spinner/Spinner';
import Panel from '../../components/utils/panel/Panel';
import styles from '../../../joomla/index.module.css';

function JoomlaWrapper({ user, children }) {
  const loader = (text) => <Spinner showText text={text} />;
  const getPage = () => {
    if (!user) return loader('Session wird geprüft...');
    return <Suspense fallback={loader('Seite wird geladen...')}>{children}</Suspense>;
  };

  return <Panel className={styles.react_root}>{getPage()}</Panel>;
}

export default JoomlaWrapper;
