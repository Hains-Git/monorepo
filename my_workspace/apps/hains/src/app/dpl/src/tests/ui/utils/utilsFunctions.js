import { screen, fireEvent } from '@testing-library/react';

export function partialTextMatch(partialText) {
  const element = screen.getByText((content, element) => {
    return content.includes(partialText);
  });
  return element;
}

export function clearInput(inputField) {
  // First, focus the input
  fireEvent.focus(inputField);
  // Select all text
  fireEvent.select(inputField);
  // Delete the selected text
  fireEvent.input(inputField, { target: { value: '' } });
  // Trigger a change event
  fireEvent.change(inputField, { target: { value: '' } });
}

export function setInputValue(inputField, value = '') {
  inputField.focus();
  fireEvent.change(inputField, { target: { value } });
}
