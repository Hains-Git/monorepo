export type TDate = string & (string extends Date ? string : never);

export type TStatus = {
  color: string;
  counts: boolean;
  id: number;
  name: string;
  public: boolean;
  sys: boolean;
  vorschlag: boolean;
  waehlbar: boolean;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TStatuseObjects = {
  [key: string]: TStatus;
};

export type TFreigabe = {
  id: number;
  name: string;
  freigabestatus_id: number;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TDienst = {
  aneasy_name: string;
  aufwand: number;
  beschreibung: string;
  color: string;
  dpl_all_teams: boolean;
  frei_eintragbar: boolean;
  freigabetypen_ids: number[];
  id: number;
  ignore_before: boolean;
  kostenstelle_id: number;
  name: string;
  oberarzt: boolean;
  order: number;
  planname: string;
  preset: boolean;
  priorisiere_wunsch: boolean;
  stundennachweis_default_bis: string;
  stundennachweis_default_std: string;
  stundennachweis_default_von: string;
  stundennachweis_krank: boolean;
  stundennachweis_sonstig: boolean;
  stundennachweis_urlaub: boolean;
  sys: boolean;
  team_id: number;
  thema_ids: number[];
  use_tagessaldo: boolean;
  weak_parallel_conflict: boolean;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TArbeitsplatz = {
  id: number;
  name: string;
  bereich_id: number;
  standort_id: number | null;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TEinteilung = {
  arbeitsplatz_id: number;
  bereich_id: number | null;
  context_comment: string;
  dienstplan_id: number;
  doppeldienst_id: number;
  einteilungskontext_id: number;
  einteilungsstatus: TStatus;
  einteilungsstatus_id: number;
  id: number;
  info_comment: string;
  mitarbeiter_id: number;
  number: number | null;
  po_dienst: TDienst;
  po_dienst_id: number;
  reason: string;
  schicht_nummern: number[];
  tag: string;
  arbeitsplatz: TArbeitsplatz;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TKontingent = {
  created_at?: TDate;
  updated_at?: TDate;
  default: boolean;
  default_last_year: number;
  id: number;
  kommentar: string;
  kurzname: string;
  name: string;
  position: number;
  team_id: number;
  thema_ids: number[];
};

export type TRotation = {
  id: number;
  kontingent_id: number;
  mitarbeiter_id: number;
  mitarbeiter_planname: string;
  prioritaet: number;
  von: TDate;
  bis: TDate;
  kommentar: string;
  created_at?: TDate;
  updated_at?: TDate;
  published: boolean;
  published_by: string;
  published_at: TDate;
  position: number;
};

export type TFunktion = {
  id: number;
  name: string;
  planname: string;
  prio: number;
  team_id: number;
  color: string;
  beschreibung: string;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TRole = {
  id: number;
  name: string;
  resource_id: number | null;
  resource_type: number | null;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TTeam = {
  default: boolean;
  id: number;
  kostenstelle_id: number;
  krank_puffer: number;
  name: string;
  verteiler_default: boolean;
  is_in_team?: boolean;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TMitarbeiter = {
  id: number;
  name: string;
  planname: string;
  funktion_id: number;
  personalnummer: number;
  a_seit: string;
  abwesend: boolean;
  aktiv: boolean;
  aktiv_bis: string | null;
  abktiv_von: string | null;
  anrechenbare_zeit: number;
  pass_count: number;
  platzhalter: boolean;
  zeit_kommentar: string | null;
  weiterbildungsjahr?: string;
  created_at?: TDate;
  updated_at?: TDate;
  funktion: TFunktion;
};

export type TUser = {
  id: number | string;
  login: string;
  email: string;
  admin: string | boolean;
  planname: string;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TAccountInfo = {
  id: number;
  nameKurz: string;
  mitarbeiter: TMitarbeiter;
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
  user: TUser;
  vorname: string;
  file_preview?: string;
  ueber_mich: string;
  created_at?: TDate;
  updated_at?: TDate;
  renten_eintritt?: string;
};

export type TNoteCategory = {
  id: number;
  category: string;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TNote = {
  id: number;
  notiz: string;
  mitarbeiter_id: number;
  ersteller_id: number;
  ersteller: { id: number; name: string; planname: string };
  private_note: boolean;
  title: string;
  note_category_id: number;
  note_category?: TNoteCategory;
  notes_history?: TNote[];
  created_at?: TDate;
  updated_at?: TDate;
};

export type TThema = {
  beschreibung: string;
  color: string;
  id: number;
  name: string;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TStandort = {
  id: number;
  name: string;
};

export type TDienstkategorieTeams = {
  dienstkategorie_id: number;
  id: number;
  team_id: number;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TDienstkategorieThemas = {
  dienstkategorie_id: number;
  id: number;
  thema_id: number;
  created_at?: TDate;
  updated_at?: TDate;
};

export type TDienstkategorie = {
  beschreibung: string;
  color: string;
  id: number;
  mark: boolean;
  name: string;
  order: number;
  poppix_name: string;
  selectable: boolean;
  dienstkategorie_teams?: TDienstkategorieTeams[];
  dienstkategoriethemas?: TDienstkategorieThemas[];
  teamDetails?: TTeam[];
  themaDetails: TThema[];
  created_at?: TDate;
  updated_at?: TDate;
};

export type TZeitraumkategorie = {
  anfang: null | string | Date;
  beschreibung: string;
  created_at?: TDate;
  updated_at?: TDate;
  dauer: null | string | number;
  ende: null | string | Date;
  id: number;
  name: string;
  prio: number;
  regelcode: string;
  sys: boolean;
  zeitraumregel_id: number;
};

export type TVertragsvariante = {
  id: number;
  name: string;
  von: string | null;
  bis: string | null;
  wochenstunden: number;
  vertragstyp_id: number;
};

export type TVertragsstufe = {
  id: number;
  stufe: number;
  nach_jahren: number | null;
  nach_monaten: number | null;
  vertragsgruppe_id: number;
  vertrags_variante_id: number;
  vertrags_variante?: TVertragsvariante;
  vertragsgruppe?: TVertragsgruppe;
  vertragstyp?: TVertragsTyp;
  von_bis?: string;
};

export type TVertragsgruppe = {
  id: number;
  name: string;
  vertragstyp_id: number;
  vertragsstuves?: TVertragsstufe[];
};

export type TVertragsArbeitszeit = {
  id: number;
  vertrag_id: number;
  von: string | null;
  bis: string | null;
  vk: number;
  tage_woche: number;
  created_at?: TDate;
  updated_at?: TDate;
  updatedBeforeArbeitszeit?: TVertragsArbeitszeit;
  updatedAfterArbeitszeit?: TVertragsArbeitszeit;
};

export type TVertragsPhase = {
  bis: string | null;
  id: number;
  vertragsstufe_id: number;
  vertragsstufe?: TVertragsstufe;
  vertrag_id: number;
  von: string | null;
  created_at?: TDate;
  updated_at?: TDate;
  updatedBeforePhase?: TVertragsPhase;
  updatedAfterPhase?: TVertragsPhase;
};

export type TVertragsTyp = {
  id: number;
  name: string;
  created_at?: TDate;
  updated_at?: TDate;
  vertragsstuves?: TVertragsstufe[];
};

export type TVertrag = {
  id: number;
  mitarbeiter_id: number;
  vertragstyp_id: number;
  anfang: string;
  ende: string | null;
  unbefristet: boolean;
  kommentar: string | null;
  vertrags_phases: TVertragsPhase[];
  vertragstyp: TVertragsTyp;
  vertrags_arbeitszeits: TVertragsArbeitszeit[];
};

export type TDienstfrei = {
  tag: string;
  description: string;
  label: string;
  id: string;
  color: string;
};

export type TMerkmal = {
  id: number;
  name: string;
  beschreibund: string;
  can_edit: boolean;
  typ: string;
  merkmal_options: Array<{
    id: number;
    merkmal_id: number;
    wert: string;
  }>;
};

export type TMitarbeiterMerkmal = {
  [key: number]: any;
  id: number;
  mitarbeiter_id: number;
  merkmal_id: number;
  wert: string;
  freitext: string;
};

export type TAutoEinteilungForm = {
  id: number;
  po_dienst_id: number;
  von: string | null;
  bis: string | null;
  zeitraumkategorie_id: number;
  days: number;
  mitarbeiter_id: number;
};

export type TAutoEinteilung = TAutoEinteilungForm & {
  anfang: string | null;
  ende: string | null;
  po_dienst: TDienst;
  zeitraumkategorie: TZeitraumkategorie;
};

export type TNichtEinteilenStandortThemenForm = {
  absprache_id: number;
  standort_id: number;
  thema_id: number;
};

export type TNichtEinteilenStandortThemen = TNichtEinteilenStandortThemenForm & {
  standort: TStandort;
  thema: TThema;
};

export type TNichtEinteilenAbspracheForm = {
  id: number;
  von: string | null;
  bis: string | null;
  mitarbeiter_id: number;
  zeitraumkategorie_id: number;
  nicht_einteilen_standort_themens: TNichtEinteilenStandortThemenForm[];
};

export type TNichtEinteilenAbsprache = Omit<TNichtEinteilenAbspracheForm, 'nicht_einteilen_standort_themens'> & {
  anfang: string | null;
  ende: string | null;
  zeitraumkategorie: TZeitraumkategorie;
  nicht_einteilen_standort_themens: TNichtEinteilenStandortThemen[];
};

export type TArbeitszeitAbspracheForm = {
  id: number;
  von: string | null;
  bis: string | null;
  arbeitszeit_von: string;
  arbeitszeit_bis: string;
  arbeitszeit_von_time: string;
  arbeitszeit_bis_time: string;
  pause: number;
  mitarbeiter_id: number;
  zeitraumkategorie_id: number;
  bemerkung: string;
};

export type TArbeitszeitAbsprache = TArbeitszeitAbspracheForm & {
  anfang: string | null;
  ende: string | null;
  zeitraumkategorie: TZeitraumkategorie;
};
export type AbspracheType = 'nichteinteilenabsprachen' | 'arbeitszeitabsprachen' | 'automatischeeinteilungen';

export type TAbspracheForm = (TArbeitszeitAbspracheForm | TNichtEinteilenAbspracheForm | TAutoEinteilungForm) & {
  type: AbspracheType;
};

export type TAbsprache = TArbeitszeitAbsprache | TNichtEinteilenAbsprache | TAutoEinteilung;

export type TGeraetepass = {
  id: number;
  name: string;
  typ: string;
  hersteller: string;
  has_pass: boolean;
  herstellereinweisung: boolean;
  table_sort: number;
  table_title: string;
  table_color: string;
};
