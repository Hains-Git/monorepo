import React, { useState, Profiler } from 'react';
import { render, act } from '@testing-library/react';

import '@testing-library/jest-dom';

import { useHistory, useLocation } from 'react-router-dom';
import { DataProvider } from '../../../../joomla/context/mitarbeiterinfo/DataProvider';
import { OAuthContext } from '../../../../joomla/context/OAuthProvider';

import {
  mockGetAllUserData,
  mockGetApiResponse,
  einteilungenInTime,
  noteData,
  vertraegData,
  noteDataUpdate,
  resultAddPhase,
  resultAddVertrag
} from './mockdata';

import MitarbeiterInfo from '../../../../joomla/mitarbeiterinfo/MitarbeiterInfo';

window.alert = jest.fn();

jest.mock('../../../../joomla/helper/flags.ts', () => ({
  DEV: false,
  development: false,
  showConsole: false,
  showTime: false,
  showExport: false,
  virtualisieren: false
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useLocation: jest.fn()
}));

const mockHandleSubmit = jest.fn((event, setMessageFromApi) => {
  event.preventDefault(); // Prevent default form submission
  setMessageFromApi({
    status: 'ok',
    info: [
      'User wurde aktualisiert',
      'Mitarbeiter und Accountinfo erfolgreich verbunden oder aktualisiert.'
    ]
  }); // Simulate state update
});

// Mocking the DataProvider
jest.mock('../../../../joomla/context/mitarbeiterinfo/DataProvider', () => {
  const actualModule = jest.requireActual(
    '../../../../joomla/context/mitarbeiterinfo/DataProvider'
  );

  // Create a functional component to wrap the original DataProvider
  const MockDataProvider = ({ children }) => {
    const originalContext = actualModule.DataProvider({ children });

    // Create a local state to manage messageFromApi
    const [messageFromApi, setMessageFromApi] = useState(null);

    return React.cloneElement(originalContext, {
      value: {
        ...originalContext.props.value,
        handleSubmit: (event) => mockHandleSubmit(event, setMessageFromApi), // Pass the state setter
        messageFromApi, // Include the message in context
        setMessageFromApi // Include the setter in context
      }
    });
  };

  return {
    ...actualModule,
    DataProvider: MockDataProvider // Use the MockDataProvider here
  };
});

jest.mock('../../../../joomla/context/mitarbeiterinfo/ApiProvider', () => {
  const originalModule = jest.requireActual(
    '../../../../joomla/context/mitarbeiterinfo/ApiProvider'
  );

  const MockedApiProvider = ({ children }) => {
    const mitarbeiter_id = 17;
    const originalContext = originalModule.ApiProvider({
      children,
      mitarbeiter_id
    });

    if (!originalContext) return;

    return React.cloneElement(originalContext, {
      value: {
        ...originalContext.props.value,
        initialDate: '2024-08-01'
      }
    });
  };

  return {
    ...originalModule,
    ApiProvider: MockedApiProvider
  };
});

// Mock the OAuthContext
const mockHainsOAuth = {
  api: jest.fn()
};

const mockOAuthContextValue = {
  hainsOAuth: mockHainsOAuth,
  returnError: jest.fn(),
  user: {
    has_wv_vorlagen: true,
    id: 543,
    is_admin: true,
    is_dienstplaner: true,
    is_rotationsplaner: true,
    is_urlaubsplaner: true,
    roles: [
      'HAINS Admins',
      'Mitarbeiter Anästhesie HD',
      'Pflege Anästhesie HD',
      'Ärzte Anästhesie HD',
      'Sekretariat Anästhesie HD',
      'Rotationsplaner Anästhesie HD',
      'Oberärzte Anästhesie HD',
      'Dienstplaner Anästhesie HD',
      'Urlaubsplaner Anästhesie HD',
      'Telefonlisten Admin',
      'Covid-19',
      'Beta',
      'Geraetepaessemanager',
      'Notfallmedizin Admin',
      'Benutzerverwaltung'
    ]
  }
};

function setApiDataMock(mockData) {
  mockHainsOAuth.api.mockImplementation((endpoint, method, data) => {
    // console.log('endpoint', endpoint, method, data);
    if (endpoint === 'get_all_user_data' && method === 'get') {
      return Promise.resolve(mockGetAllUserData || mockData);
    }
    if (endpoint === 'get_mitarbeiter_details' && method === 'get') {
      return Promise.resolve(mockGetApiResponse || mockData);
    }
    if (
      endpoint === 'dienstplaner/mitarbeiter/einteilungen_in_time.json' &&
      method === 'post'
    ) {
      return Promise.resolve(einteilungenInTime || mockData);
    }
    if (endpoint === 'get_notes_for_detail_page' && method === 'get') {
      return Promise.resolve(noteData || mockData);
    }
    if (endpoint === 'getVertrags' && method === 'get') {
      return Promise.resolve(vertraegData || mockData);
    }
    if (endpoint === 'update_note' && method === 'post') {
      return Promise.resolve(noteDataUpdate || mockData);
    }
    if (endpoint === 'vertragsupdate' && method === 'post') {
      return Promise.resolve(resultAddVertrag || mockData);
    }
    if (endpoint === 'phasenupdate' && method === 'post') {
      return Promise.resolve(resultAddPhase || mockData);
    }
    if (endpoint === 'destroyvertrag' && method === 'post') {
      return Promise.resolve({ info: '', destroyed: true });
    }
    if (endpoint === 'destroyphase' && method === 'post') {
      return Promise.resolve({ info: '', destroyed: true });
    }
    return Promise.resolve({});
  });
}

function mockHistory(data) {
  const mockedData = data || {
    push: jest.fn(),
    location: {
      pathname: '',
      search: '',
      hash: '',
      key: ''
    }
  };
  useHistory.mockReturnValue(mockedData);
}

function mockLocation(data) {
  const mockedData = data || {
    pathname: '',
    search: '',
    hash: ''
  };
  useLocation.mockReturnValue(mockedData);
}

async function renderMitarbeiterInfoWithDataProvider() {
  await act(async () => {
    render(
      <OAuthContext.Provider value={mockOAuthContextValue}>
        <DataProvider>
          <MitarbeiterInfo />
        </DataProvider>
      </OAuthContext.Provider>
    );
  });
}

export {
  renderMitarbeiterInfoWithDataProvider,
  mockLocation,
  mockHistory,
  setApiDataMock,
  mockHainsOAuth,
  mockHandleSubmit
};
