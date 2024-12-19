import React, { useState, useEffect, useContext } from 'react';

import LayoutIcon from './LayoutIcon';
import HeightAdjustWrapper from '../../utils/height-adjust-wrapper/HeightAdjustWrapper';
import CustomButton from '../../utils/custom_buttons/CustomButton';

import styles from './user-settings.module.css';
import { numericLocaleCompare } from '../../../tools/helper';
import KonfliktFilter from '../../dienstplaner/konflikt-filter/KonfliktFilter';
import { VerteilerFastContext } from '../../../contexts/VerteilerFastProvider';
import { UseRegister } from '../../../hooks/use-register';

function UserSettingsView() {
  const { useVerteilerFastContextFields, verteiler } =
    useContext(VerteilerFastContext);
  const { showUserSettings } = useVerteilerFastContextFields([
    'showUserSettings'
  ]);
  const vorlagen = verteiler?.vorlagen;
  UseRegister(vorlagen?._push, vorlagen?._pull, vorlagen);

  const funktionen = verteiler._funktionen._each(
    false,
    (funktion) => funktion
  ).arr;

  const bereiches = verteiler._bereiche._each(false, (bereich) => bereich).obj;
  const po_dienste = verteiler._po_dienste._each(
    false,
    (po_dienst) => po_dienst
  ).obj;

  const layouts = ['top', 'left', 'right', 'bottom'];
  const zoom = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5];

  const bereiche = [];
  verteiler?.data?.bereiche?.eachByVorlage?.((section) => {
    if (section.bereich_id) {
      bereiche.push(bereiches[section.bereich_id]);
    } else if (section.po_dienst_id) {
      bereiche.push(po_dienste[section.po_dienst_id]);
    }
  });

  const [userSettings, setUserSettings] = useState(
    verteiler.data.user_settings
  );
  const [zoomVal, setZoomVal] = useState(userSettings.zoom || 1);

  useEffect(() => {
    verteiler.data.updateUserSettings(userSettings);
  }, [userSettings]);

  const changeBereich = (evt) => {
    const val = parseInt(evt.target.value, 10);
    const name = evt.target.name[0];
    if (!['b', 'd'].includes(name)) return;
    if (evt.target.checked) {
      setUserSettings((obj) => ({
        ...obj,
        bereiche: [
          ...userSettings.bereiche,
          {
            bereich_id: name === 'b' ? val : null,
            po_dienst_id: name === 'd' ? val : null
          }
        ]
      }));
    } else {
      let filterFkt = (section) => section.bereich_id !== val;
      if (name === 'd') filterFkt = (section) => section.po_dienst_id !== val;
      setUserSettings((obj) => ({
        ...obj,
        bereiche: obj.bereiche?.filter(filterFkt)
      }));
    }
  };

  const checkAll = (evt, setLoading) => {
    const newBereiche =
      verteiler?.data?.bereiche?.eachByVorlage?.((section) => {
        return {
          bereich_id: section.bereich_id,
          po_dienst_id: section.po_dienst_id
        };
      }) || [];
    setUserSettings((obj) => ({
      ...obj,
      bereiche: [...(obj?.bereiche || []), ...newBereiche]
    }));
    setLoading?.(() => false);
  };

  const uncheckAll = (evt, setLoading) => {
    const newBereiche =
      verteiler?.data?.bereiche?.eachByVorlage?.((section) => {
        return {
          bereich_id: section.bereich_id,
          po_dienst_id: section.po_dienst_id
        };
      }) || [];
    setUserSettings((obj) => ({
      ...obj,
      bereiche: (obj?.bereiche || []).filter((bereich) => {
        const checked = !newBereiche.find(
          (newBereich) =>
            newBereich.bereich_id === bereich.bereich_id &&
            newBereich.po_dienst_id === bereich.po_dienst_id
        );
        return checked;
      })
    }));
    setLoading?.(() => false);
  };

  const changeFunktion = (evt) => {
    const val = parseInt(evt.target.value, 10);
    if (evt.target.checked) {
      setUserSettings((obj) => ({
        ...obj,
        funktion_ids: [...userSettings.funktion_ids, val]
      }));
    } else {
      setUserSettings((obj) => ({
        ...obj,
        funktion_ids: obj.funktion_ids.filter((id) => id !== val)
      }));
    }
  };

  const changeLayout = (layout) => {
    setUserSettings((obj) => ({ ...obj, funktion_box: layout }));
  };

  const onSaveLayout = (evt, setLoading) => {
    verteiler.data.updateUserSettings(userSettings, true, (done) => {
      done === 'done' && setLoading?.(() => false);
    });
  };

  const changeZoom = (e) => {
    const val = parseFloat(e.target.value);
    setZoomVal(() => val);
    setUserSettings((obj) => ({ ...obj, zoom: val }));
    document.documentElement.style.setProperty('--mult-size', val);
  };

  const checkedCheckbox = (section) => {
    if (section.converted_planname[0] === 'b') {
      const found = userSettings?.bereiche?.find(
        (userB) => userB.bereich_id === section.id
      );
      return !!found;
    }
    if (section.converted_planname[0] === 'd') {
      const found = userSettings?.bereiche?.find(
        (userB) => userB.po_dienst_id === section.id
      );
      return !!found;
    }
    return false;
  };

  if (!showUserSettings.get) return null;

  return (
    <HeightAdjustWrapper>
      <div>
        <div
          className={`user-settings-container ${
            showUserSettings.get ? 'open' : ''
          }`}
        >
          <div className="user settings-content">
            <div className={styles.header}>
              <h3>User Einstellungen</h3>
              <div className={styles.right}>
                <CustomButton
                  spinner={{ show: true }}
                  clickHandler={onSaveLayout}
                  className="primary"
                >
                  Speichern
                </CustomButton>
                <CustomButton
                  spinner={{ show: true }}
                  addStyles={styles.close}
                  clickHandler={(evt, setLoading) => {
                    showUserSettings.set(false);
                    setLoading?.(() => false);
                  }}
                >
                  X
                </CustomButton>
              </div>
            </div>
            <div className={styles.block}>
              <h4>Funktionen</h4>
              <div className={styles.funktion}>
                {funktionen.map((funktion) => (
                  <fieldset key={funktion.id}>
                    <input
                      id={`funktion_${funktion.id}`}
                      checked={
                        !!userSettings.funktion_ids.includes(funktion.id)
                      }
                      onChange={changeFunktion}
                      type="checkbox"
                      name="funktion"
                      value={funktion.id}
                    />
                    <label htmlFor={`funktion_${funktion.id}`}>
                      {funktion.planname}
                    </label>
                  </fieldset>
                ))}
              </div>
            </div>
            <div className={styles.block}>
              <KonfliktFilter
                konfliktFilter={verteiler?.konflikteFilter}
                showAllways
              />
            </div>
            {verteiler.pageName === 'tagesverteiler' && (
              <div className={styles.block}>
                <h4>Layout</h4>
                <div className={styles.layouts_wrapper}>
                  {layouts.map((layout, ix) => (
                    <LayoutIcon
                      changeLayout={changeLayout}
                      key={ix}
                      layoutSide={layout}
                      userSettings={userSettings}
                    />
                  ))}
                </div>
              </div>
            )}
            {verteiler.pageName === 'wochenverteiler' && (
              <div className={styles.block}>
                <div className={styles.headline_buttons}>
                  <h4>Bereiche</h4>
                  <div>
                    <CustomButton
                      spinner={{ show: true }}
                      clickHandler={checkAll}
                      className="primary"
                      addStyles={styles.btn_sec}
                    >
                      Alles anwählen
                    </CustomButton>
                    <CustomButton
                      spinner={{ show: true }}
                      clickHandler={uncheckAll}
                      className="primary"
                      addStyles={styles.btn_sec}
                    >
                      Alles abwählen
                    </CustomButton>
                  </div>
                </div>
                <div className="bereiche-wrapper columns">
                  {bereiche
                    .sort((a, b) => numericLocaleCompare(a.name, b.name))
                    .map((bereich, ix) => {
                      return (
                        <fieldset key={ix}>
                          <input
                            id={`${bereich.converted_planname}-${bereich.id}`}
                            checked={checkedCheckbox(bereich)}
                            onChange={changeBereich}
                            type="checkbox"
                            name={bereich.converted_planname}
                            value={bereich.id}
                          />
                          <label
                            htmlFor={`${bereich.converted_planname}-${bereich.id}`}
                          >
                            {bereich.name}
                          </label>
                        </fieldset>
                      );
                    })}
                </div>
              </div>
            )}
            <div className="settings-block">
              <h4>Default Zoom</h4>
              <div className="layouts-wrapper">
                <select className="zoom" value={zoomVal} onChange={changeZoom}>
                  {zoom.map((factor, ix) => (
                    <option key={ix} value={factor}>
                      {(factor * 100).toFixed(0)}%
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeightAdjustWrapper>
  );
}

export default UserSettingsView;
