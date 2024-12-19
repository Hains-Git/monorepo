import { Mitarbeiter } from './freigaben';

export type User = {
  id: number | string;
  login: string;
  email: string;
  admin: string | boolean;
  planname: string;
};

export type AccountInfo = {
  id: number;
  nameKurz: string;
  mitarbeiter: Mitarbeiter;
  adresseOrt: string;
  adressePlz: string;
  adresseStrasse: string;
  anrede: string;
  dienstEmail: string;
  dienstTelefon: string;
  geburtsdatum: string | null;
  mitarbeiter_id: number;
  mittelname: string;
  mobileTelefon: string;
  nachname: string;
  privateEmail: string;
  privateTelephone: string;
  telephone: string;
  titelPostfix: string;
  titelPraefix: string;
  user: User;
  vorname: string;
};
