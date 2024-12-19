// Diese Variablen werden im setupTest.js gemocked, da import.meta.env in
// jest einen Fehler wirft
const DEV = process?.env?.NODE_ENV === 'development';
export const development = DEV;
export const showConsole = DEV && false;
export const logger_wv = DEV && false;
export const logger_tv = DEV && false;
export const logger_rp = DEV && false;
export const showTime = DEV && true;
export const showExport = DEV && false;
