import React, { useEffect, useState } from 'react';
import { TbDatabaseExport, TbDatabaseExclamation } from 'react-icons/tb';
import { UseMounted } from '../../../../../hooks/use-mounted';
import { UseTooltip } from '../../../../../hooks/use-tooltip';
import { checkmark } from '../../../../../tools/htmlentities';
import CustomButton from '../../../../utils/custom_buttons/CustomButton';
import Loader from '../../../../utils/loader/Loader';
import FreitextAbfrage from './Freitext';
import { UseRegister, UseRegisterKey } from '../../../../../hooks/use-register';
import styles from '../toolbar.module.css';

function Publish({ table, title = '' }) {
  UseRegister(table?._push, table?._pull, table);
  UseRegisterKey('everythingPublished', table?.push, table?.pull, table);
  const [feedback, setFeedback] = useState(0);
  const [freitextAbfrage, setFreitextAbfrage] = useState(null);
  const [checkMarkTitle, setCheckMarkTitle] = useState('');
  const mounted = UseMounted();
  const [onOver, onOut] = UseTooltip(checkMarkTitle);
  const allEinteilungenPublic = table?.allEinteilungenPublic;

  useEffect(() => {
    if (feedback > 1) {
      setTimeout(() => {
        if (mounted && feedback > 1) {
          setFeedback(() => 0);
        }
      }, 180000);
    }
  }, [feedback, mounted]);

  const abbrechen = (evt, setLoading) => {
    setFreitextAbfrage(() => null);
    setLoading?.(() => false);
  };

  const publish = (freitext, setLoading) => {
    abbrechen();
    table?.publish?.(freitext.trim(), (value, newTitle) => {
      if (mounted) {
        setFeedback(() => value);
        setCheckMarkTitle(() => newTitle);
        setLoading?.(() => false);
      }
    });
  };

  useEffect(() => {
    if (freitextAbfrage) {
      document.body.addEventListener('click', abbrechen);
    }

    return () => {
      document.body.removeEventListener('click', abbrechen);
    };
  }, [freitextAbfrage]);

  const getFeedBack = () => {
    if (feedback === 1) {
      return <Loader />;
    }

    if (feedback > 1) {
      return (
        <p className={styles.checkmark} onMouseOut={onOut} onMouseOver={onOver}>
          {feedback === 2 ? checkmark : 'X'}
        </p>
      );
    }

    return null;
  };

  const setFreitext = (evt, setLoading) => {
    evt?.stopPropagation?.();
    setFreitextAbfrage(() => (
      <FreitextAbfrage table={table} publish={publish} abbrechen={abbrechen} />
    ));
    setLoading?.(() => false);
  };

  if (!table?.publishable) return null;
  return (
    <div className={`publish-container ${styles.publish_container}`}>
      <CustomButton
        className={`as_icon ${allEinteilungenPublic ? styles.all_einteilungen_public : ''}`}
        clickHandler={setFreitext}
        title={`${title}${allEinteilungenPublic ? '\nAlle Einteilungen sind öffentlich.' : ''}`}
        spinner={{ show: true }}
        disable={feedback === 1}
      >
        {allEinteilungenPublic ? (
          <TbDatabaseExclamation />
        ) : (
          <TbDatabaseExport />
        )}
      </CustomButton>
      {freitextAbfrage}
      {getFeedBack()}
    </div>
  );
}

export default Publish;
