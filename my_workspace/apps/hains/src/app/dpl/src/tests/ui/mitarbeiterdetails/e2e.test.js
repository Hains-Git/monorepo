import {
  screen,
  waitFor,
  act,
  cleanup,
  fireEvent
} from '@testing-library/react';

// import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { mockGetAllUserData } from './mockdata';

import {
  mockHandleSubmit,
  setApiDataMock,
  mockLocation,
  renderMitarbeiterInfoWithDataProvider,
  mockHainsOAuth,
  mockHistory
} from './mocksSetup';

import { clearInput, setInputValue } from '../utils/utilsFunctions';

afterEach(() => {
  cleanup();
  jest.spyOn(window, 'confirm').mockRestore();
});

beforeEach(() => {
  mockHandleSubmit.mockClear();
  mockHainsOAuth.api.mockClear();
});

async function initialRender() {
  setApiDataMock(mockGetAllUserData);
  mockLocation();
  mockHistory();
  await renderMitarbeiterInfoWithDataProvider();
}

function getFields() {
  const vornameInput = screen.getByLabelText(/vorname/i);
  const nachnameInput = screen.getByLabelText(/nachname/i);
  const plannameInput = screen.getByLabelText(/planname/i);
  return { vornameInput, nachnameInput, plannameInput };
}

async function renderDetailsPage() {
  await initialRender();
  const cell = screen.getByText('Popp E', { selector: 'td' });
  const row = cell.closest('tr');
  await act(async () => {
    fireEvent.click(row);
  });
}

test('Initial component render', async () => {
  await initialRender();
  await waitFor(() => {
    expect(mockHainsOAuth.api).toHaveBeenCalledWith('get_all_user_data', 'get');
    expect(
      screen.getByText('Neuer Benutzer', { selector: 'button' })
    ).toBeInTheDocument();
  });
});

test('Show form for creating new user', async () => {
  await initialRender();
  const btn = screen.getByText('Neuer Benutzer', { selector: 'button' });
  fireEvent.click(btn);
  expect(
    screen.getByText('Benutzer anlegen', { selector: 'h2' })
  ).toBeInTheDocument();
});

test('Get avaible planname', async () => {
  await initialRender();
  const btn = screen.getByText('Neuer Benutzer', { selector: 'button' });
  fireEvent.click(btn);

  const { vornameInput, nachnameInput, plannameInput } = getFields();

  vornameInput.focus();
  fireEvent.change(vornameInput, { target: { value: 'Erik' } });
  nachnameInput.focus();
  fireEvent.change(nachnameInput, { target: { value: 'Haus' } });
  await act(async () => {
    plannameInput.focus();
  });
  expect(plannameInput).toHaveFocus();
  expect(plannameInput).toHaveAttribute('readonly');
  expect(plannameInput).toHaveValue('Haus E');
  expect(
    screen.getByText(
      'Planname (Haus E) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.',
      { selector: 'p' }
    )
  ).toBeInTheDocument();

  clearInput(nachnameInput);
  setInputValue(nachnameInput, 'Popp');
  await act(async () => {
    plannameInput.focus();
  });
  expect(plannameInput).toHaveFocus();
  expect(plannameInput).toHaveValue('Popp Er');
  expect(plannameInput).toHaveAttribute('readonly');

  expect(
    screen.getByText(
      'Planname (Popp E) schon vergeben durch Mitarbeiter Erik Popp.',
      { selector: 'p' }
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'Planname (Popp Er) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.',
      { selector: 'p' }
    )
  ).toBeInTheDocument();

  const lockIcon = screen.getByTestId('planname_lock');
  fireEvent.click(lockIcon);
  expect(plannameInput.readOnly).toBe(false);

  setInputValue(plannameInput, 'Popp Erik');
  await act(async () => {
    plannameInput.blur();
  });
  expect(plannameInput).toHaveValue('Popp Erik');
  expect(plannameInput).toHaveAttribute('readonly');

  expect(
    screen.getByText(
      'Planname (Popp Erik) ist verfügbar, alternativ können Sie einen anderen Plannamen eingeben.',
      { selector: 'p' }
    )
  ).toBeInTheDocument();
});

test('Calculate urlaubstage', async () => {
  await initialRender();
  const btn = screen.getByText('Neuer Benutzer', { selector: 'button' });

  fireEvent.click(btn);

  const dateInputVon = screen.getByLabelText(/beginn/i);
  const dateInputBis = screen.getByLabelText(/ende/i);

  setInputValue(dateInputVon, '2024-09-01');
  setInputValue(dateInputBis, '2026-08-31');

  const tagewoche = screen.getByLabelText(/tagewoche/i);

  const year2024 = screen.getByLabelText(/2024/i);
  const year2025 = screen.getByLabelText(/2025/i);
  const year2026 = screen.getByLabelText(/2026/i);

  expect(year2024.value).toBe('8');
  expect(year2025.value).toBe('30');
  expect(year2026.value).toBe('20');

  setInputValue(tagewoche, '4');

  expect(year2024.value).toBe('6');
  expect(year2025.value).toBe('24');
  expect(year2026.value).toBe('16');

  setInputValue(tagewoche, '2');

  expect(year2024.value).toBe('3');
  expect(year2025.value).toBe('12');
  expect(year2026.value).toBe('8');
});

test('Edit user form', async () => {
  await initialRender();
  const editBtn = screen.getByTestId('edit_btn_17');

  fireEvent.click(editBtn);
  expect(screen.getByText('Mitarbeiterdetails')).toBeInTheDocument();

  const saveBtn = screen.getByTestId('save_user_btn');
  fireEvent.click(saveBtn);
  expect(mockHandleSubmit).toHaveBeenCalled();
  expect(screen.getByText('User wurde aktualisiert')).toBeInTheDocument(); // Adjust the text as needed
  expect(
    screen.getByText(
      'Mitarbeiter und Accountinfo erfolgreich verbunden oder aktualisiert.'
    )
  ).toBeInTheDocument();
});

test('Click on row to show details page', async () => {
  await renderDetailsPage();
  await waitFor(() => {
    expect(mockHainsOAuth.api).toHaveBeenNthCalledWith(
      2,
      'get_mitarbeiter_details',
      'get',
      { mitarbeiter_id: 17 }
    );
    const heading = screen.getByText('Mitarbeiterinfo:');
    expect(heading).toBeInTheDocument();
  });
});

test('Tab navigation shows content', async () => {
  await renderDetailsPage();
  const li1 = screen.getByText(/^überblick$/i, { selector: 'span' });
  expect(li1).toBeInTheDocument();
  const li2 = screen.getByText(/^freigaben$/i, { selector: 'span' });
  expect(li2).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(li2);
  });

  const li2Content = screen.getByText(/^freigabename$/i, { selector: 'th' });
  expect(li2Content).toBeInTheDocument();
  const liTabbar2 = screen.getByText(/^dienstwünsche$/i, { selector: 'span' });
  expect(liTabbar2).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(liTabbar2);
  });

  const calAugust = screen.getByText(/^august 2024$/i, { selector: 'h2' });
  expect(calAugust).toBeInTheDocument();
  const calSeptember = screen.getByText(/^september 2024$/i, {
    selector: 'h2'
  });
  expect(calSeptember).toBeInTheDocument();

  const calOktober = screen.getByText(/^oktober 2024$/i, { selector: 'h2' });
  expect(calOktober).toBeInTheDocument();
  const calNovember = screen.getByText(/^november 2024$/i, { selector: 'h2' });
  expect(calNovember).toBeInTheDocument();

  const liTabbar3 = screen.getByText(/^präferenzen$/i, { selector: 'span' });
  expect(liTabbar3).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(liTabbar3);
  });

  const tablePreference = screen.getByText(/^präferenzwertung$/i, {
    selector: 'th'
  });
  expect(tablePreference).toBeInTheDocument();

  const liTabbar4 = screen.getByText(/^notizen$/i, { selector: 'span' });
  expect(liTabbar4).toBeInTheDocument();

  await act(async () => {
    fireEvent.click(liTabbar4);
  });
  const formNotiz = screen.getByText(/^neue notiz$/i, { selector: 'h1' });
  expect(formNotiz).toBeInTheDocument();
});

test('Cycle through months in calendar', async () => {
  await renderDetailsPage();
  const nextMonthButton = document.querySelector('button.fc-next-button');
  const prevMonthButton = document.querySelector('button.fc-prev-button');

  fireEvent.click(nextMonthButton);

  expect(screen.getByText('September 2024')).toBeInTheDocument();
  fireEvent.click(nextMonthButton);
  expect(screen.getByText('Oktober 2024')).toBeInTheDocument();

  fireEvent.click(prevMonthButton);
  fireEvent.click(prevMonthButton);
  expect(screen.getByText('August 2024')).toBeInTheDocument();
});

// test('Toggle Auto einteilen popup', async () => {
//   await renderDetailsPage();
//   const btn = screen.getByText(/^auto einteilen$/i, { selector: 'button' });
//   fireEvent.click(btn);
//   const heading = screen.getByText(/^automatische einteilungen$/i, {
//     selector: 'h4'
//   });
//   expect(heading).toBeInTheDocument();
//   const btnX = screen.getByText(/^x$/i, { selector: 'button' });
//   fireEvent.click(btnX);
//   expect(heading).not.toBeInTheDocument();
// });

test('Create note', async () => {
  await renderDetailsPage();

  const liTabNote = screen.getByText(/^notizen$/i, { selector: 'span' });
  expect(liTabNote).toBeInTheDocument();

  fireEvent.click(liTabNote);

  const inputNoteTitle = screen.getByLabelText(/notiz titel: \*/i);
  const inputNote = screen.getByLabelText(/ihre notiz zum mitarbeiter:\*/i);

  setInputValue(inputNoteTitle, 'Testnotiz');
  setInputValue(inputNote, 'Eine Notiz zum Mitarbeiter');

  expect(inputNoteTitle).toHaveValue('Testnotiz');
  expect(inputNote).toHaveValue('Eine Notiz zum Mitarbeiter');

  const saveBtn = screen.getByText(/speichern/i, { selector: 'button' });

  await act(async () => {
    fireEvent.click(saveBtn);
  });

  const category = screen.getByText(/urlaubsplanung/i, { selector: 'td' });

  const noteTitle = screen.getByText('Testnotiz', { selector: 'p' });
  const noteCreator = screen.getByText('Juri Diener', { selector: 'p' });

  expect(category).toBeInTheDocument();
  expect(noteTitle).toBeInTheDocument();
  expect(noteCreator).toBeInTheDocument();
});

// test('Should add new Vertrag and delete it', async () => {
//   await renderDetailsPage();
//   const btn = screen.getByText(/^verträge$/i, { selector: 'button' });
//   fireEvent.click(btn);
//   const btn2 = screen.getByText(/^neuer vertrag$/i, { selector: 'span' });
//   expect(btn2).toBeInTheDocument();

//   fireEvent.click(btn2);
//   const heading = screen.getByText(/^neuer vertrag für popp e$/i, {
//     selector: 'h2'
//   });
//   expect(heading).toBeInTheDocument();
//   const anfangDateI = screen.getByLabelText(/anfang \*/i);
//   const endeDateI = screen.getByLabelText(/ende \*/i);

//   const saveBtn = screen.getByText(/speichern/i, { selector: 'button' });

//   setInputValue(anfangDateI, '2024-09-10');
//   setInputValue(endeDateI, '2025-09-10');
//   expect(endeDateI).toHaveValue('2025-09-10');

//   await act(async () => {
//     fireEvent.click(saveBtn);
//   });

//   const newDropDownBtn = screen.getByTestId('vertrag-dropdown-173');

//   const deleteVertragBtn = screen.getByTestId('delete-vertrag-105');
//   expect(newDropDownBtn).toBeInTheDocument();

//   const confirmSpy = jest
//     .spyOn(window, 'confirm')
//     .mockImplementation(() => true);

//   fireEvent.click(deleteVertragBtn);
//   expect(confirmSpy).toHaveBeenCalledTimes(1);

//   await waitFor(() => {
//     expect(screen.queryByText('delete-vertrag-105')).not.toBeInTheDocument();
//   });
// });

// test('Should add new phase', async () => {
//   await renderDetailsPage();
//   const btn = screen.getByText('Verträge', { selector: 'button' });
//   await act(async () => {
//     fireEvent.click(btn);
//   });

//   const dropdown = screen.getByTestId('vertrag-dropdown-105');
//   fireEvent.click(dropdown);

//   const editPhaseBtn = screen.getByTestId('edit-phase-109');
//   fireEvent.click(editPhaseBtn);

//   const popupHeading = screen.getByText('Phase Anpassen', { selector: 'h2' });
//   expect(popupHeading).toBeInTheDocument();

//   const closeBtn = screen.getByText('X', { selector: 'button' });
//   fireEvent.click(closeBtn);

//   expect(popupHeading).not.toBeInTheDocument();
//   const addPhase = screen.getByTestId('add-phase');
//   fireEvent.click(addPhase);

//   const heading = screen.getByText('Neue Phase für Vertrag: 105', {
//     selector: 'h2'
//   });
//   expect(heading).toBeInTheDocument();

//   const bisDateI = screen.getByLabelText('Bis *');
//   setInputValue(bisDateI, '2024-09-10');
//   expect(bisDateI).toHaveValue('2024-09-10');

//   const saveBtn = screen.getByText('Speichern', { selector: 'button' });
//   await act(async () => {
//     fireEvent.click(saveBtn);
//   });

//   const newPhaseEditBtn = screen.getByTestId('edit-phase-192');
//   expect(newPhaseEditBtn).toBeInTheDocument();

//   const deletePhaseBtn = screen.getByTestId('delete-phase-192');

//   const confirmSpy = jest
//     .spyOn(window, 'confirm')
//     .mockImplementation(() => true);

//   fireEvent.click(deletePhaseBtn);
//   expect(confirmSpy).toHaveBeenCalledTimes(1);

//   await waitFor(() => {
//     expect(screen.queryByTestId('delete-phase-192')).not.toBeInTheDocument();
//   });
// });
