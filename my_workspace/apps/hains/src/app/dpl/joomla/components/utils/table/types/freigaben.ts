export type Funktion = {
  id: number;
  planname: string;
  name: string;
  beschreibung: string;
  color: string;
  prio: number;
  team_id: number;
};

export type Freigabetyp = {
  id: number;
  name: string;
  planname: string;
  beschreibung: string;
  created_at: string;
  updated_at: string;
  sort: number;
};

export type Freigabestatus = {
  id: number;
  name: string;
  counts_active: boolean;
  color: string;
  beschreibung: string;
  qualifiziert: boolean;
};

export type Freigabe = {
  freigabestatus_id: number;
  freigabetyp_id: number;
  id: number;
  mitarbeiter_id: number;
  standort_id: number | null;
  user_id: number | null;
  freigabestatus?: Freigabestatus;
  freigabetyp?: Freigabetyp;
};

export type kontingent = {
  id: number;
  name: string;
  kommentar: string;
  created_at: string;
  updated_at: string;
  position: number;
  kurzname: string;
  thema_ids: number[];
  team_id: number;
  default: boolean;
};

export type Rotation = {
  id: number;
  kontingent_id: number;
  mitarbeiter_id: number;
  mitarbeiter_planname: string;
  prioritaet: number;
  von: string;
  bis: string;
  kommentar: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  published_by: number | null;
  published_at: string | null;
  position: number;
  kontingent: kontingent;
};

export type Mitarbeiter = {
  id: number;
  planname: string;
  name: string;
  abwesend: boolean;
  a_seit: string | null;
  anrechenbare_zeit: number;
  funktion_id: number;
  aktiv: boolean;
  vk_and_vgruppe_am: object;
  dateis: object;
};

export type Freigaben = {
  [key: number]: Freigabe;
};

export type TableMitarbeiter = Mitarbeiter & {
  freigaben: Freigaben;
  funktion?: Funktion;
  rotation?: Rotation;
};
