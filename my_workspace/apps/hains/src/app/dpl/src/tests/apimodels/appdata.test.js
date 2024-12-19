import AppData from "../../models/apimodels/appdata";
import Dienst from "../../models/apimodels/dienst";
import Dienstkategorie from "../../models/apimodels/dienstkategorie";
import Mitarbeiter from "../../models/apimodels/mitarbeiter";
import Team from "../../models/apimodels/team";
import Basic from "../../models/basic";
import Data from "../../models/helper/data";

const data = {
  MAX_RATING: 5,
  MAX_WOCHENENDEN: 2,
  monatsplan_ansichten: [],
  arbeitsplaetze: {},
  bereiche: {},
  dienstgruppen: {},
  dienstplanpfade: {},
  dienstverteilungstypen: {},
  einteilungskontexte: {},
  einteilungsstatuse: {},
  freigabestatuse: {},
  freigabetypen: {},
  funktionen: {},
  kostenstellen: {},
  publicvorlagen: {},
  themen: {},
  teams: {
    1: {}
  },
  standorte: {},
  vertraege: {},
  vertragsphasen: {},
  vertragsvarianten: {},
  vertragstyp_varianten: {},
  mitarbeiters: {
    1: {}
  },
  po_dienste: {
    1: {}
  },
  arbeitszeittypen: {
    1: { count: true },
    2: { count: false }
  },
  arbeitszeitverteilungen: {},
  dienstkategorien: {
    1: {}
  },
  freigaben: {},
  kontingente: {},
  ratings: {},
  zeitraumkategorien: {},
  arbeitszeit_absprachen: [],
  nicht_einteilen_absprachen: []
};

const mockDienstkategorieAddDienst = jest.spyOn(Dienstkategorie.prototype, "addDienst");
const mockDienstAddQualifizierteMitarbeiter = jest.spyOn(Dienst.prototype, "addQualifizierteMitarbeiter");
const mockMitarbeiterResetAttributes = jest.spyOn(Mitarbeiter.prototype, "resetAttributes");
const mockTeamResetAttributes = jest.spyOn(Team.prototype, "resetAttributes");

afterEach(() => {
  jest.clearAllMocks();
});

describe("AppData", () => {
  const appdata = new AppData(data);
  test("Instance of AppData, Data and Basic", () => {
    expect(appdata).toBeInstanceOf(AppData);
    expect(appdata).toBeInstanceOf(Data);
    expect(appdata).toBeInstanceOf(Basic);
  });

  test("Intialising properties through newParams(data)", () => {
    expect(appdata).toBeInstanceOf(AppData);
    expect(appdata.MAX_RATING).toBe(5);
    expect(appdata.MAX_WOCHENENDEN).toBe(2);
    expect(appdata.arbeitsplaetze).toBeInstanceOf(Basic);
    expect(appdata.bereiche).toBeInstanceOf(Basic);
    expect(appdata.dienstgruppen).toBeInstanceOf(Basic);
    expect(appdata.dienstplanpfade).toBeInstanceOf(Basic);
    expect(appdata.dienstverteilungstypen).toBeInstanceOf(Basic);
    expect(appdata.einteilungskontexte).toBeInstanceOf(Basic);
    expect(appdata.einteilungsstatuse).toBeInstanceOf(Basic);
    expect(appdata.freigabestatuse).toBeInstanceOf(Basic);
    expect(appdata.freigabetypen).toBeInstanceOf(Basic);
    expect(appdata.funktionen).toBeInstanceOf(Basic);
    expect(appdata.kostenstellen).toBeInstanceOf(Basic);
    expect(appdata.publicvorlagen).toBeInstanceOf(Basic);
    expect(appdata.themen).toBeInstanceOf(Basic);
    expect(appdata.teams).toBeInstanceOf(Basic);
    expect(appdata.vertraege).toBeInstanceOf(Basic);
    expect(appdata.vertragsphasen).toBeInstanceOf(Basic);
    expect(appdata.vertragsvarianten).toBeInstanceOf(Basic);
    expect(appdata.vertragstyp_varianten).toBeInstanceOf(Basic);
    expect(appdata.mitarbeiters).toBeInstanceOf(Basic);
    expect(appdata.po_dienste).toBeInstanceOf(Basic);
    expect(appdata.arbeitszeittypen).toBeInstanceOf(Basic);
    expect(appdata.arbeitszeitverteilungen).toBeInstanceOf(Basic);
    expect(appdata.dienstkategorien).toBeInstanceOf(Basic);
    expect(appdata.freigaben).toBeInstanceOf(Basic);
    expect(appdata.kontingente).toBeInstanceOf(Basic);
    expect(appdata.ratings).toBeInstanceOf(Basic);
    expect(appdata.zeitraumkategorien).toBeInstanceOf(Basic);
    expect(appdata.arbeitszeit_absprachen).toBeInstanceOf(Basic);
    expect(appdata.nicht_einteilen_absprachen).toBeInstanceOf(Basic);
    expect(appdata.konfliktArbeitszeittypen).toEqual([]);
  });

  test("updateMe()", () => {
    appdata.updateMe();
    expect(mockDienstkategorieAddDienst).toHaveBeenCalledWith(appdata.po_dienste[1]);
    expect(mockDienstAddQualifizierteMitarbeiter).toHaveBeenCalledWith(appdata.mitarbeiters[1]);
    expect(appdata.konfliktArbeitszeittypen).toEqual([appdata.arbeitszeittypen[1]]);
  });

  test("resetTeams()", () => {
    appdata.resetTeams();
    expect(mockTeamResetAttributes).toHaveBeenCalled();
  });

  test("resetMitarbeiter()", () => {
    appdata.resetMitarbeiter();
    expect(mockMitarbeiterResetAttributes).toHaveBeenCalled();
  });
});

