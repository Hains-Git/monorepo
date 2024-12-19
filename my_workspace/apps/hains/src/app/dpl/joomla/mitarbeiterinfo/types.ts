import { AccountInfo } from '../components/utils/table/types/accountinfo';
import { TTeam } from '../components/utils/table/types/teams';
import { Mitarbeiter } from '../components/utils/table/types/freigaben';
import { MailerContext } from '../helper/mailer_context_types';
import { TDienst, TFunktion, TStandort, TThema, TVertragsTyp, TZeitraumkategorie } from '../helper/api_data_types';

export type TApiResult = {
  status: string;
  info: string[];
};

// export type TMitarbiter extends Mitarbeiter = {};
// type UserEvent = Event & {UserId: string}
export type TMitarbeiter = Mitarbeiter;

export type TData = {
  all_mitarbeiters: TMitarbeiter[];
  mitarbeiters: TMitarbeiter[];
  vertrags_typ: TVertragsTyp[];
  mitarbeiterInfosArr: AccountInfo[];
  mitarbeiter_infos: { [key: string | number]: AccountInfo };
  mailer_contexts_deactivate: MailerContext[];
  mailer_contexts_reactivate: MailerContext[];
  funktionen: TFunktion[];
  teams: TTeam[];
  dienste: TDienst[];
  zeitraumkategorie: TZeitraumkategorie[];
  standorte: TStandort[];
  themen: TThema[];
  hains_groups: any[];
  datei_typs: any[];
};
