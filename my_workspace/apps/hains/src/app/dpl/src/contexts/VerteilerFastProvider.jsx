import { createContext, useMemo } from 'react';

import createFastContext from './FastContextVerteilerProvider';

export const {
  FastContextProvider: VerteilerFastContextProvider,
  useFastContextFields: useVerteilerFastContextFields
} = createFastContext({
  showForm: false,
  showInfoTable: false,
  isOpen: false,
  showUserSetting: false,
  showVorlagen: false,
  newEinteilung: {},
  changedEinteilung: {}
});

const VerteilerFastContext = createContext({});

const VerteilerFastProvider = ({ children, verteiler, user }) => {
  const employeesRoom = {};

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
      useVerteilerFastContextFields,
      verteiler,
      user,
      employeesRoom,
      searchInSuggestionInput,
      roomChange,
      saveInfoComment
    }),
    [verteiler, user, employeesRoom]
  );

  if (!verteiler) return null;
  return (
    <VerteilerFastContext.Provider value={providerValue}>
      <VerteilerFastContextProvider>{children}</VerteilerFastContextProvider>
    </VerteilerFastContext.Provider>
  );
};

export { VerteilerFastContext, VerteilerFastProvider };
