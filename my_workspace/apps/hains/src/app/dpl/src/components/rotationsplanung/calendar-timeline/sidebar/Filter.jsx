import React, { useState, useEffect } from 'react';

import { returnError } from '../../../../tools/hains';
import Range from './Range';
import VKDate from './VKDate';

function Filter({ rotationsplan }) {
  const [contingentIds, setContingentIds] = useState(
    rotationsplan.timeline.contingentIds
  );
  const [employeeIds, setEmployeeIds] = useState(
    rotationsplan.timeline.employeeIds
  );
  const [searchName, setSearchName] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [noRotFrom, setNoRotFrom] = useState('');
  const [noRotTo, setNoRotTo] = useState('');
  const [funktionId, setFunktionId] = useState(0);
  const [teamId, setTeamId] = useState(0);
  const contingents = rotationsplan.data.kontingente;
  const employees = rotationsplan.data.mitarbeiter;

  const isMitarbeiterView = rotationsplan.timeline.view === 'mitarbeiter';
  const isContingentView = rotationsplan.timeline.view === 'contingent';

  const checkIsFound = (val, bedingung) => {
    if (val.indexOf('::') > -1) {
      const valArr = val.split('::');
      const l = valArr.length;
      for (let i = 0; i < l; i++) {
        if (valArr[i].length > 0 && !!bedingung(valArr[i])) {
          return true;
        }
      }
      return false;
    }
    return !!bedingung(val);
  };

  const getFoundIds = (val, { obj, key, bedingung = () => true }) => {
    const foundIds = [];
    const formattedValue = val.toLowerCase().trim();
    Object.values(obj).forEach((el) => {
      const name = el[key]?.toLowerCase?.() || '';
      if (
        bedingung(el) &&
        (!formattedValue ||
          checkIsFound(formattedValue, (value) => name.indexOf(value) > -1))
      ) {
        foundIds.push(el.id);
      }
    });
    return foundIds;
  };

  const isContingentInteam = (contingent, _teamId) =>
    _teamId === 0 || contingent.team_id === _teamId;

  const isFilteredEmployee = (employee, _funktionId) =>
    (!rotationsplan.timeline.onlyActiveEmployees || employee.aktiv) &&
    (_funktionId === 0 || employee.funktion_id === _funktionId);

  const sendBothContingentIds = (_contingentIds) => {
    setContingentIds(() => _contingentIds);
    rotationsplan.timeline.filterContingent(_contingentIds);
  };

  const sendBothEmployeeIds = (_employeeIds) => {
    setEmployeeIds(() => _employeeIds);
    rotationsplan.timeline.filterEmployee(_employeeIds);
  };

  const filterEmployeeIds = (_searchName, _funktionId, set = true) => {
    const params = {
      obj: employees,
      key: 'planname',
      bedingung: (employee) => isFilteredEmployee(employee, _funktionId)
    };
    const foundIds = getFoundIds(_searchName, params);
    if (set) {
      setErrMsg(() => (foundIds.length ? '' : 'Keine Mitarbeiter gefunden.'));
      sendBothEmployeeIds(foundIds);
    }
    return foundIds;
  };

  const filterContingentIds = (_searchName, _teamId, set = true) => {
    const params = {
      obj: contingents,
      key: 'name',
      bedingung: (contingent) => isContingentInteam(contingent, _teamId)
    };
    const foundIds = getFoundIds(_searchName, params);
    if (set) {
      setErrMsg(() => (foundIds.length ? '' : 'Keine Kontingente gefunden.'));
      sendBothContingentIds(foundIds);
    }
    return foundIds;
  };

  useEffect(() => {
    if (noRotFrom !== '' && noRotTo !== '') {
      const von = Number(noRotFrom.split('-').join(''));
      const bis = Number(noRotTo.split('-').join(''));

      if (von > bis) {
        setErrMsg(() => 'Von darf nicht größer sein als Bis');
        return;
      }

      const params = {
        von: noRotFrom,
        bis: noRotTo
      };
      rotationsplan._hains
        .api('check_rotation', 'post', params)
        .then((response) => {
          const _employeeIds = rotationsplan.timeline.getEmployeeIdsWithNoRot(
            employees,
            response
          );
          setErrMsg(() => '');
          sendBothEmployeeIds(_employeeIds);
        }, returnError);
    } else {
      const _employeeIds = Object.values(employees).reduce((acc, el) => {
        if (el.aktiv) {
          acc.push(el.id);
        }
        return acc;
      }, []);
      sendBothEmployeeIds(_employeeIds);
      setErrMsg(() => '');
    }
  }, [noRotFrom, noRotTo]);

  const expandFilterView = (evt) => {
    const headerBlock = evt.currentTarget.closest('div.header-block');
    headerBlock.classList.toggle('open');
    evt.currentTarget.classList.toggle('close');
  };

  const onChangeView = (evt) => {
    rotationsplan.timeline.changeView(evt.target.value);
  };

  const onChangeNoRotation = (evt) => {
    if (evt.target.name === 'no-rot-from') {
      setNoRotFrom(() => evt.target.value.trim());
    }
    if (evt.target.name === 'no-rot-to') {
      setNoRotTo(() => evt.target.value.trim());
    }
  };

  const onChangeActive = (evt) => {
    const val = evt.target.value?.toString?.();
    rotationsplan.timeline.changeActiveEmployee(val === 'true');
    filterEmployeeIds(searchName, funktionId, true);
  };

  const onChangeContingent = (evt) => {
    const val = parseInt(evt.target.value, 10);
    const checked = evt.target.checked;
    sendBothContingentIds(
      checked
        ? [...contingentIds, val]
        : contingentIds.filter((id) => id !== val)
    );
  };

  const onChangeSearch = (evt) => {
    const val = evt.target.value;
    if (isMitarbeiterView) {
      filterEmployeeIds(val, funktionId, true);
    } else if (isContingentView) {
      filterContingentIds(val, teamId, true);
    }
    setSearchName(() => val);
  };

  const onKeyPressEnter = (evt) => {
    if (evt.key === 'Enter') {
      expandFilterView(evt);
    }
  };

  const onChangeFunktion = (evt) => {
    const targetId = parseInt(evt.target.value, 10);
    filterEmployeeIds(searchName, targetId, true);
    setFunktionId(() => targetId);
  };

  const onChangeTeam = (evt) => {
    const targetId = parseInt(evt.target.value, 10);
    filterContingentIds(searchName, targetId, true);
    setTeamId(() => targetId);
  };

  return (
    <div className="filter">
      <div className="filter-headline" onClick={expandFilterView}>
        <p>Filter Einstellungen:</p>
        <span />
        <span />
      </div>
      <div className="filter-content">
        <div className="fieldset column inline">
          <label>Ansicht:</label>
          <select name="view" onChange={onChangeView}>
            <option value="contingent">Kontingente</option>
            <option value="mitarbeiter">Mitarbeiter</option>
          </select>
        </div>
        <div className="fieldset column inline">
          <label>Mitarbeiter:</label>
          <select name="aktiv" onChange={onChangeActive}>
            <option value="true">Aktive</option>
            <option value="false">Alle</option>
          </select>
        </div>

        {isContingentView && <VKDate rotationsplan={rotationsplan} />}
        <Range rotationsplan={rotationsplan} />

        {isMitarbeiterView && (
          <div className="fieldset column inline">
            <label>Funktion:</label>
            <select name="funktion" onChange={onChangeFunktion}>
              <option value="0">Alle</option>
              {Object.values(rotationsplan.data.funktionen).map((funktion) => (
                <option key={funktion.id} value={funktion.id}>
                  {funktion.planname}
                </option>
              ))}
            </select>
          </div>
        )}

        {isContingentView && (
          <div className="fieldset column inline">
            <label>Team:</label>
            <select name="funktion" onChange={onChangeTeam}>
              <option value="0">Alle</option>
              {rotationsplan.eachTeam((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {isMitarbeiterView && (
          <div className="fieldset column">
            <label style={{ margin: '5px 0' }}>Keine Rotationen</label>
            {/* <input
              type="checkbox"
              name="show_no_rotation"
              onChange={onChangeNoRotation}
            /> */}
            <div className="fieldset column inline">
              <label>Von:</label>
              <input
                type="date"
                value={noRotFrom}
                name="no-rot-from"
                onChange={onChangeNoRotation}
              />
            </div>
            <div className="fieldset column inline">
              <label>Bis:</label>
              <input
                type="date"
                value={noRotTo}
                name="no-rot-to"
                onChange={onChangeNoRotation}
              />
            </div>
          </div>
        )}

        <div className="fieldset space-after">
          <label
            title={`Suche kann mit (::) separiert werden\nBeispiel: Busch::Mueller`}
          >
            Suche:
          </label>
          <input
            className="search-name"
            placeholder="Suche in Name"
            type="text"
            name="search"
            value={searchName}
            onChange={onChangeSearch}
            onKeyPress={onKeyPressEnter}
          />
        </div>
        {isMitarbeiterView && <p className="errMsg">{errMsg}</p>}
        {isContingentView && (
          <div className="fieldset column2 contingents">
            <p>Kontingente:</p>
            <p className="errMsg">{errMsg}</p>
            <div className="contingents-item">
              {Object.values(contingents).map(
                (contingent) =>
                  isContingentInteam(contingent, teamId) && (
                    <div
                      className="contingent"
                      key={contingent.id}
                      title={contingent.name}
                    >
                      <input
                        type="checkbox"
                        value={contingent.id}
                        name="contingentid"
                        checked={
                          contingentIds.includes(contingent.id) ? 'checked' : ''
                        }
                        onChange={onChangeContingent}
                      />
                      <label>{contingent.name}</label>
                    </div>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Filter;
