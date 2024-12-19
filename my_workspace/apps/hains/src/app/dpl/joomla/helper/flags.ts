// Diese Variablen werden im setupTest.js gemocked, da import.meta.env in
// jest einen Fehler wirft
const DEV = process?.env?.NODE_ENV === 'development';
export const development = DEV;
