import React, { useEffect, useState } from 'react';
import styles from './vorlagen.module.css';
import SaveButton from '../../utils/custom_buttons/SaveButton';
import { UseMounted } from '../../../hooks/use-mounted';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import DeleteButton from '../../utils/custom_buttons/DeleteButton';

const getHead = (type, setArr, arr, isAdmin) => {
  const head = [<h3 key={`h3-${type}`}>{type}</h3>];
  if (isAdmin) {
    head.push(
      <CustomButton
        spinner={{ show: true }}
        key={`button-${type}-all`}
        clickHandler={(evt, setLoading) => {
          setArr(() => arr);
          setLoading?.(() => false);
        }}
      >
        Alle
      </CustomButton>
    );
    head.push(
      <CustomButton
        spinner={{ show: true }}
        key={`button-${type}-none`}
        clickHandler={(evt, setLoading) => {
          setArr(() => []);
          setLoading?.(() => false);
        }}
      >
        Keine
      </CustomButton>
    );
  }

  return <div>{head}</div>;
};

const getCheckBox = (el, type, isChecked, setArr, isAdmin) => {
  const elId = el.id;
  const id = `verteiler-vorlage-${type}-${elId}`;
  if (isAdmin) {
    return (
      <label key={id} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          name={id}
          onChange={() => {
            if (isChecked()) {
              setArr((arr) => arr.filter((_id) => _id !== elId));
            } else {
              setArr((arr) => [...arr, elId]);
            }
          }}
          checked={isChecked()}
        />
        {` ${el.name}`}
      </label>
    );
  }
  return isChecked() ? <p key={id}>{el.name}</p> : null;
};

function Vorlage({ vorlage }) {
  const getOrder = (value) => {
    const _order = parseInt(value, 10);
    return !Number.isNaN(_order) && _order > 0 ? _order : 1;
  };

  const [name, setName] = useState('');
  const [order, setOrder] = useState(1);
  const [beschreibung, setBeschreibung] = useState('');
  const [kommentar, setKommentar] = useState('');
  const [diensteIds, setDiensteIds] = useState([]);
  const [bereicheIds, setBereicheIds] = useState([]);
  const [dplPathId, setDplPathId] = useState(0);
  const [teamIds, setTeamIds] = useState([]);
  const mounted = UseMounted();
  const isAdmin = !!vorlage?.isAdmin;
  const readOnly = !isAdmin;

  const reset = (evt, setLoading) => {
    if (!mounted) return;
    setLoading?.(() => false);
    setName(() => vorlage?.name || '');
    setOrder(() => getOrder(vorlage?.order));
    setKommentar(() => vorlage?.kommentar || '');
    setBeschreibung(() => vorlage?.beschreibung || '');
    setDiensteIds(() => vorlage?.dienste_ids || []);
    setBereicheIds(() => vorlage?.bereiche_ids || []);
    setTeamIds(() => vorlage?.team_ids || []);
    setDplPathId(() => vorlage?.dienstplan_path_id || 0);
  };

  useEffect(() => {
    reset();
  }, [vorlage]);

  const getCheckboxGroups = () => {
    const bodys = [[], [], []];
    const allIds = [[], [], []];
    const setArrays = [
      (callback) => mounted && setTeamIds(callback),
      (callback) => mounted && setBereicheIds(callback),
      (callback) => mounted && setDiensteIds(callback)
    ];
    const keys = ['Teams', 'Bereiche', 'Dienste'];
    vorlage?.eachBereichOrDienst?.((bereichOrDienst) => {
      if (bereichOrDienst.bereich && !allIds[1].includes(bereichOrDienst.bereich.id)) {
        const isChecked = () => bereicheIds.includes(bereichOrDienst.bereich.id);
        bodys[1].push(getCheckBox(bereichOrDienst.bereich, keys[1], isChecked, setArrays[1], isAdmin));
        allIds[1].push(bereichOrDienst.bereich.id);
      } else if (bereichOrDienst.po_dienst && !allIds[2].includes(bereichOrDienst.po_dienst.id)) {
        const isChecked = () => diensteIds.includes(bereichOrDienst.po_dienst.id);
        bodys[2].push(getCheckBox(bereichOrDienst.po_dienst, keys[2], isChecked, setArrays[2], isAdmin));
        allIds[2].push(bereichOrDienst.po_dienst.id);
      }
    });

    vorlage?.eachTeam?.((team) => {
      if (allIds[0].includes(team.id)) return;
      const isChecked = () => teamIds.includes(team.id);
      bodys[0].push(getCheckBox(team, keys[0], isChecked, setArrays[0], isAdmin));
      allIds[0].push(team.id);
    });

    return bodys.map((body, i) => (
      <div key={`vorlage-checkbox-group-${keys[i]}`}>
        {getHead(keys[i], setArrays[i], allIds[i], isAdmin)}
        <div>
          {body.sort((a, b) => {
            const aName = a?.props?.children?.[1] || 'zzz';
            const bName = b?.props?.children?.[1] || 'zzz';
            return aName.localeCompare(bName);
          })}
        </div>
      </div>
    ));
  };

  const handleChangeName = (evt) => {
    setName(() => evt.target.value);
  };

  const handleChangeBeschreibung = (evt) => {
    setBeschreibung(() => evt.target.value || '');
  };

  const handleChangeOrder = (evt) => {
    setOrder(() => getOrder(evt.target.value));
  };

  const handleChangeKommentar = (evt) => {
    setKommentar(() => evt.target.value || '');
  };

  if (!vorlage) return null;
  return (
    <div className={styles.vorlage}>
      <div>
        {isAdmin && (
          <div>
            <SaveButton
              spinner={{ show: true }}
              clickHandler={(evt, setLoading) => {
                vorlage?.save?.(
                  name,
                  beschreibung,
                  kommentar,
                  order,
                  diensteIds,
                  bereicheIds,
                  dplPathId,
                  teamIds,
                  setLoading,
                  reset
                );
              }}
            />
            <CustomButton spinner={{ show: true }} clickHandler={reset}>
              Reset
            </CustomButton>
            {vorlage?.id !== 0 && (
              <DeleteButton
                spinner={{ show: true }}
                clickHandler={(evt, setLoading) => {
                  vorlage?.remove?.(setLoading, reset);
                }}
              />
            )}
          </div>
        )}
        <p>{`ID: ${vorlage.id}`}</p>
        <label htmlFor="verteiler-vorlage-name">
          Name:
          <input
            type="text"
            id="verteiler-vorlage-name"
            placeholder="Wähle einen Namen"
            value={name}
            onChange={handleChangeName}
            readOnly={readOnly}
          />
        </label>

        <label htmlFor="verteiler-vorlage-order">
          Reihenfolge:
          <input
            type="number"
            id="verteiler-vorlage-order"
            min={1}
            step={1}
            value={order}
            onChange={handleChangeOrder}
            readOnly={readOnly}
          />
        </label>

        <label htmlFor="verteiler-vorlage-pfad">
          PDF Pfad:
          <select
            value={dplPathId}
            onChange={(evt) => {
              evt.stopPropagation();
              const value = evt.target.value;
              setDplPathId(() => parseInt(value, 10));
            }}
          >
            <option key={0} value={0}>
              Nicht ausgewählt
            </option>
            {vorlage?.eachPath?.((path) => {
              return (
                <option key={path.id} value={path.id}>
                  {path.name} - {path.path}
                </option>
              );
            }) || []}
          </select>
        </label>

        <label htmlFor="verteiler-vorlage-beschreibung">
          Beschreibung:
          <textarea
            id="verteiler-vorlage-beschreibung"
            placeholder="Optionale Beschreibung"
            value={beschreibung}
            onChange={handleChangeBeschreibung}
            readOnly={readOnly}
          />
        </label>

        <label htmlFor="verteiler-vorlage-kommentar">
          Kommentar:
          <textarea
            id="verteiler-vorlage-kommentar"
            placeholder="Optionaler Kommentar"
            value={kommentar}
            onChange={handleChangeKommentar}
            readOnly={readOnly}
          />
        </label>
      </div>
      {getCheckboxGroups()}
    </div>
  );
}

export default Vorlage;
