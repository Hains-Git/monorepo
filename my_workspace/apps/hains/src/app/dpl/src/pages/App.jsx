import React from 'react';
import { MdContactMail, MdLogin, MdLogout } from 'react-icons/md';
import { IconContext } from 'react-icons';
import Routes from '../routes/Index';
import Panel from '../components/utils/panel/Panel';
import Navigation from './navigation/Navigation';
import CustomButton from '../components/utils/custom_buttons/CustomButton';
import { UseApp } from '../hooks/use-app';
import Tooltip from '../components/utils/tooltip/Tooltip';
import HainsLink from '../assets/hains_link.svg';
import Channel from '../components/utils/channel/Channel';
import styles from './app.module.css';
import LogoutTimer from '../components/utils/logouttimer/LogoutTimer';
// import SizeAdjustWrapper from '../components/utils/size-adjust-wrapper/SizeAdjustWrapper';

const iconStyle = { style: { transform: 'scale(-1, 1)' } };

export default function App() {
  const [user, history, loginOnClick, logoutOnClick, appModel, withAppModelData] = UseApp();
  const iconSize = '1.3em';

  return (
    <div className={styles['my-app']}>
      <Tooltip appModel={appModel} />
      <Panel>
        <div className={styles['my-nav-container']}>
          <div className={`${styles['my-nav-col-1']} col`}>
            <Navigation user={user} />
          </div>

          <div className={`${styles['my-nav-col-2']} col`}>
            <CustomButton className="as_icon">
              <a
                target="_blank"
                href={`${document.location.origin}/hains/`}
                className="my-btn as-icon-button nav-btn"
                title="Link zu HAINS.info"
                rel="noreferrer"
              >
                <img
                  style={{
                    width: '1em',
                    height: '1em'
                  }}
                  src={HainsLink}
                  alt="Link zu HAINS"
                />
              </a>
            </CustomButton>
            <CustomButton className="as_icon">
              <a
                href="mailto:hains.anae@med.uni-heidelberg.de"
                title="Sende eine Nachricht an das HAINS-Team: hains.anae@med.uni-heidelberg.de"
                aria-label="Sende eine Nachricht an das HAINS-Team: hains.anae@med.uni-heidelberg.de"
              >
                <MdContactMail size={iconSize} />
              </a>
            </CustomButton>
            {user ? (
              <CustomButton className="as_icon primary" clickHandler={logoutOnClick} title="Logout">
                <MdLogout size={iconSize} />
              </CustomButton>
            ) : (
              <CustomButton className="as_icon primary" clickHandler={loginOnClick} title="Login">
                <IconContext.Provider value={iconStyle}>
                  <MdLogin size={iconSize} />
                </IconContext.Provider>
              </CustomButton>
            )}
            {user ? <LogoutTimer channel={appModel?.channel} /> : null}
          </div>
        </div>

        <div className={styles['my-app-page']}>
          <Routes user={user} history={history} appModel={appModel} withAppModelData={withAppModelData} />
          {appModel?.channel && <Channel channel={appModel?.channel} user={user} />}
        </div>
      </Panel>
    </div>
  );
}
