import React, { createContext, useEffect, useMemo, useState } from 'react';

export const VerteilerSearchContext = createContext('');

const VerteilerContext = createContext({});

function VerteilerProvider({ children, verteiler, user }) {
  const [showInfoTable, setShowInfoTable] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showVorlagen, setShowVorlagen] = useState(false);
  const [newEinteilung, setNewEinteilung] = useState();
  const [showForm, setShowForm] = useState(false);
  const [changedEinteilung, setChangedEinteilung] = useState();
  const [isOpen, setIsOpen] = useState(false);
  // const [search, setSearch] = useState('');
  const employeesRoom = {};

  useEffect(() => {
    async function fetchNewEinteilung() {
      const status =
        verteiler && (await verteiler.createNewEinteilung(changedEinteilung));
      if (status === 0) {
        alert(
          'Es ist ein Fehler aufgetreten, bitte überprüfen Sie alle Einteilungen die Sie machen wollten, ob diese auch erstellt worden sind.'
        );
      }
    }
    fetchNewEinteilung();
  }, [changedEinteilung]);

  const searchInSuggestionInput = ({ inputVal, data, searchKeys }) => {
    let found = false;

    const mFilteredData = data.filter((_record) => {
      const trimedVal = inputVal.trim();
      for (let i = 0; i < searchKeys.length; i++) {
        const key = searchKeys[i];
        const recordKey = _record[key]?.toLowerCase();
        if (trimedVal === recordKey) {
          found = true;
          return _record;
        }
        if (recordKey.indexOf(trimedVal.toLowerCase()) !== -1) {
          return _record;
        }
      }
      return null;
    });

    return { mFilteredData, found };
  };

  const roomChange = async (einteilungId, roomId) => {
    if (!einteilungId) return;
    const status = await verteiler.roomChanged(einteilungId, roomId);
    if (status.msg !== 'ok') {
      alert(status.msg);
      verteiler.logger && console.log(status.err);
    }
  };

  const saveInfoComment = async (einteilungId, comment, fieldId) => {
    const { status } = await verteiler.data.saveInfoComment(
      einteilungId,
      comment
    );
    if (status.msg.toLowerCase() !== 'ok') {
      alert(status.msg);
    }
    verteiler.data.updateFieldsBySuffix('comment', fieldId);
    verteiler.uiUpdate(true);
  };

  const providerValue = useMemo(
    () => ({
      verteiler,
      user,
      showInfoTable,
      setShowInfoTable,
      showUserSettings,
      setShowUserSettings,
      showVorlagen,
      setShowVorlagen,
      newEinteilung,
      setNewEinteilung,
      showForm,
      setShowForm,
      changedEinteilung,
      setChangedEinteilung,
      isOpen,
      setIsOpen,
      searchInSuggestionInput,
      roomChange,
      saveInfoComment,
      employeesRoom
    }),
    [
      verteiler,
      showInfoTable,
      showUserSettings,
      showVorlagen,
      newEinteilung,
      showForm,
      changedEinteilung,
      isOpen,
      user
    ]
  );

  return (
    <VerteilerContext.Provider value={providerValue}>
      {children}
    </VerteilerContext.Provider>
  );
}

export { VerteilerContext, VerteilerProvider };
