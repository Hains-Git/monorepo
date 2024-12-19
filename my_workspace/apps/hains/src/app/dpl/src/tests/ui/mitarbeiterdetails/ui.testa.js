import React, { useMemo, useState } from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  prettyDOM,
  cleanup,
  fireEvent
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { useHistory, useLocation } from 'react-router-dom';
import { DataProvider } from '../../../../joomla/context/mitarbeiterinfo/DataProvider';
import { OAuthContext } from '../../../../joomla/context/OAuthProvider';
import {
  mockGetAllUserData,
  mockGetApiResponse,
  einteilungenInTime
} from './mockdata';

import MitarbeiterInfo from '../../../../joomla/mitarbeiterinfo/MitarbeiterInfo';

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

window.alert = jest.fn();

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
    is_urlaubsplaner: true
  }
};

afterEach(() => {
  cleanup();
  mockHainsOAuth.api.mockClear();
});

describe('MitarbeiterInfo', () => {
  let user = null;
  beforeEach(async () => {
    mockHainsOAuth.api.mockImplementation((endpoint, method, data) => {
      // console.log('endpoint', endpoint, method, data);
      if (endpoint === 'get_all_user_data' && method === 'get') {
        return Promise.resolve(mockGetAllUserData);
      }
      if (endpoint === 'get_mitarbeiter_details' && method === 'get') {
        return Promise.resolve(mockGetApiResponse);
      }
      if (
        endpoint === 'dienstplaner/mitarbeiter/einteilungen_in_time.json' &&
        method === 'post'
      ) {
        return Promise.resolve(einteilungenInTime);
      }
      return Promise.resolve({});
    });

    user = userEvent.setup();

    mockHandleSubmit.mockClear();

    useHistory.mockReturnValue({
      push: jest.fn(),
      location: {
        pathname: '',
        search: '',
        hash: '',
        key: ''
      }
      // goBack: jest.fn(),
    });

    useLocation.mockReturnValue({
      pathname: '',
      search: '',
      hash: ''
    });

    // act needed when state is changing
    // npm install @testing-library/react@latest @testing-library/jest-dom@latest
    // maybe install latest so warning goes away with deprecated
    await act(async () => {
      render(
        <OAuthContext.Provider value={mockOAuthContextValue}>
          <DataProvider>
            <MitarbeiterInfo />
          </DataProvider>
        </OAuthContext.Provider>
      );
    });

    // Wait for all state updates to complete
    await waitFor(() => {
      expect(mockHainsOAuth.api).toHaveBeenCalledWith(
        'get_all_user_data',
        'get'
      );
    });
  });

  test('Initial view is visible', async () => {
    await waitFor(() => {
      expect(screen.getByText('Neuer Benutzer')).toBeInTheDocument();
    });
  });

  describe('Interactions Benutzer anlegen', () => {
    beforeEach(async () => {
      const btn = screen.getByText('Neuer Benutzer');
      await act(async () => {
        await user.click(btn);
      });
    });

    test('change view to new form', async () => {
      await waitFor(() => {
        expect(screen.getByText('Benutzer anlegen')).toBeInTheDocument();
      });
    });

    describe('check available planname', () => {
      let vornameInput = null;
      let nachnameInput = null;
      let plannameInput = null;
      beforeEach(async () => {
        vornameInput = screen.getByRole('textbox', { name: /vorname/i });
        nachnameInput = screen.getByRole('textbox', {
          name: /nachname/i
        });
        plannameInput = screen.getByRole('textbox', {
          name: /planname/i
        });
      });

      test('planname is available', async () => {
        await act(async () => {
          await user.type(vornameInput, 'Erik');
          await user.type(nachnameInput, 'Haus');
          await user.keyboard('{Tab}');
          expect(plannameInput).toHaveFocus();
        });
        await act(async () => {
          expect(plannameInput).toHaveValue('Haus E');
          expect(
            screen.getByText(
              'Planname (Haus E) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.'
            )
          ).toBeInTheDocument();
        });
      });
      test('planname not available', async () => {
        await act(async () => {
          await user.type(vornameInput, 'Erik');
          await user.type(nachnameInput, 'Popp');
          await user.keyboard('{Tab}');
          expect(plannameInput).toHaveFocus();
        });
        await act(async () => {
          expect(
            screen.getByText(
              'Planname (Popp E) schon vergeben durch Mitarbeiter Erik Popp.'
            )
          ).toBeInTheDocument();
          expect(
            screen.getByText(
              'Planname (Popp Er) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.'
            )
          ).toBeInTheDocument();
          expect(plannameInput).toHaveValue('Popp Er');
        });
      });
      test('user changes planname manually', async () => {
        await act(async () => {
          await user.type(vornameInput, 'Erik');
          await user.type(nachnameInput, 'Popp');
          await user.keyboard('{Tab}');
          expect(plannameInput).toHaveFocus();
        });
        await act(async () => {
          const lockIcon = screen.getByTestId('planname_lock');
          await user.click(lockIcon);
        });
        await act(async () => {
          await user.clear(plannameInput);
          await user.type(plannameInput, 'Popp Erik');
          await user.keyboard('{Tab}');
          expect(plannameInput).toHaveValue('Popp Erik');
        });
        await act(async () => {
          expect(
            screen.getByText(
              'Planname (Popp Erik) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.'
            )
          ).toBeInTheDocument();
        });
      });
    });

    test('calculate urlaubstage', async () => {
      const dateInputVon = screen.getByLabelText('vertrag-von');
      const dateInputBis = screen.getByLabelText('vertrag-bis');
      const tagewoche = screen.getByLabelText('tagewoche');

      fireEvent.change(dateInputVon, { target: { value: '2024-09-01' } });
      fireEvent.change(dateInputBis, { target: { value: '2026-08-31' } });

      const year2024 = screen.getByLabelText('urlaubstage-2024');
      const year2025 = screen.getByLabelText('urlaubstage-2025');
      const year2026 = screen.getByLabelText('urlaubstage-2026');

      expect(year2024.value).toBe('8');
      expect(year2025.value).toBe('30');
      expect(year2026.value).toBe('20');

      fireEvent.change(tagewoche, { target: { value: '4' } });

      expect(year2024.value).toBe('6');
      expect(year2025.value).toBe('24');
      expect(year2026.value).toBe('16');

      fireEvent.change(tagewoche, { target: { value: '2' } });

      expect(year2024.value).toBe('3');
      expect(year2025.value).toBe('12');
      expect(year2026.value).toBe('8');
    });
  });

  describe('Edit user', () => {
    beforeEach(async () => {
      const editBtn = screen.getByTestId('edit_btn_17');
      await act(async () => {
        await user.click(editBtn);
      });
    });
    test('open edit form', async () => {
      await act(async () => {
        expect(screen.getByText('Mitarbeiterdetails')).toBeInTheDocument();
      });
    });
    test('save user data without changes', async () => {
      const saveBtn = screen.getByTestId('save_user_btn');
      await act(async () => {
        await user.click(saveBtn);
        expect(mockHandleSubmit).toHaveBeenCalled();
      });
      expect(screen.getByText('User wurde aktualisiert')).toBeInTheDocument(); // Adjust the text as needed
      expect(
        screen.getByText(
          'Mitarbeiter und Accountinfo erfolgreich verbunden oder aktualisiert.'
        )
      ).toBeInTheDocument(); // Adjust the text as needed
    });
  });

  describe('Details', () => {
    beforeEach(async () => {
      const row = screen.getByRole('row', { name: /Popp E/i });
      await act(async () => {
        fireEvent.click(row);
      });
    });
    test('show details view', async () => {
      await waitFor(() => {
        expect(mockHainsOAuth.api).toHaveBeenNthCalledWith(
          2,
          'get_mitarbeiter_details',
          'get',
          { mitarbeiter_id: 17 }
        );
        expect(screen.getByText('Mitarbeiterdetails:')).toBeInTheDocument();
      });
    });
  });
});
