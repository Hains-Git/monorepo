import Zeitraumkategorie from "../../models/apimodels/zeitraumkategorie";
import Basic from "../../models/basic";

const zeitraumkategorien = {
  "1": {
      "id": 1,
      "name": "Alle Tage",
      "beschreibung": "Immer.",
      "zeitraumregel_id": 6,
      "prio": 0,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "",
      "sys": true,
      "created_at": "2020-11-26T15:19:48.706Z",
      "updated_at": "2021-11-18T13:48:36.889Z"
  },
  "2": {
      "id": 2,
      "name": "Montag",
      "beschreibung": "Jeden Montag",
      "zeitraumregel_id": 6,
      "prio": 1,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#wr_Mo",
      "sys": true,
      "created_at": "2020-11-26T15:19:48.708Z",
      "updated_at": "2021-11-18T14:05:31.538Z"
  },
  "9": {
      "id": 9,
      "name": "Montag bis Freitag ohne Feiertage",
      "beschreibung": "Montag bis Freitag inkl. Karsamstag, Heiligabend und Silvester, ohne Feiertage",
      "zeitraumregel_id": 6,
      "prio": 1,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#wr_Mo_Di_Mi_Do_Fr_#ft_#nicht_neujahr_heilige drei könige_karfreitag_ostersonntag_ostermontag_tag der arbeit_christi himmelfahrt_pfingstsonntag_pfingstmontag_fronleichnam_tag der deutschen einheit_allerheiligen_heiligabend_erster weihnachtstag_zweiter weihnachtstag_silvester",
      "sys": false,
      "created_at": "2020-11-30T10:55:43.763Z",
      "updated_at": "2021-11-19T14:55:40.362Z"
  },
  "10": {
      "id": 10,
      "name": "Karfreitag",
      "beschreibung": "Entblockung für Karfreitag",
      "zeitraumregel_id": 6,
      "prio": 4,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#ft_#nur_karfreitag",
      "sys": false,
      "created_at": "2020-11-30T12:41:53.656Z",
      "updated_at": "2021-11-18T13:46:46.685Z"
  },
  "19": {
      "id": 19,
      "name": "Januar",
      "beschreibung": "ganzer Januar",
      "zeitraumregel_id": 6,
      "prio": 2,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#fm_m1",
      "sys": false,
      "created_at": "2020-11-30T14:14:56.192Z",
      "updated_at": "2021-11-18T13:49:48.940Z"
  },
  "31": {
      "id": 31,
      "name": "Wochenende und Feiertage",
      "beschreibung": "Samstag, Sonntag, Feiertage inkl. Heiligabend und Silvester",
      "zeitraumregel_id": 6,
      "prio": 1,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#wr_Sa_So_#ft_#auch_neujahr_heilige drei könige_karfreitag_ostersonntag_ostermontag_tag der arbeit_christi himmelfahrt_pfingstsonntag_pfingstmontag_fronleichnam_tag der deutschen einheit_allerheiligen_heiligabend_erster weihnachtstag_zweiter weihnachtstag_silvester",
      "sys": false,
      "created_at": "2020-11-30T14:46:03.722Z",
      "updated_at": "2021-11-19T14:16:51.532Z"
  },
  "32": {
      "id": 32,
      "name": "Montag bis Donnerstag",
      "beschreibung": "Montag bis Donnerstag, jede Woche",
      "zeitraumregel_id": 6,
      "prio": 2,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#wr_Mo_Di_Mi_Do",
      "sys": false,
      "created_at": "2020-12-02T14:20:08.174Z",
      "updated_at": "2022-02-03T11:24:02.383Z"
  },
  "34": {
      "id": 34,
      "name": "Werktage 1. bis 7. des Monats",
      "beschreibung": "Werktage der ersten 7 Tage des Monats",
      "zeitraumregel_id": 6,
      "prio": 1,
      "anfang": null,
      "ende": null,
      "dauer": null,
      "regelcode": "#tr_1_1_7_#ende_#wr_Mo_Di_Mi_Do_Fr_#ft_#nicht_neujahr_heilige drei könige_karfreitag_ostersonntag_ostermontag_tag der arbeit_christi himmelfahrt_pfingstsonntag_pfingstmontag_fronleichnam_tag der deutschen einheit_allerheiligen_erster weihnachtstag_zweiter weihnachtstag",
      "sys": false,
      "created_at": "2021-11-15T13:21:04.327Z",
      "updated_at": "2021-11-19T12:43:36.019Z"
  },
  "51": {
      "id": 51,
      "name": "HIS_April_23",
      "beschreibung": "abgesprochene 12HIS Dienste",
      "zeitraumregel_id": 6,
      "prio": 0,
      "anfang": "2022-04-23",
      "ende": "2022-04-24",
      "dauer": null,
      "regelcode": "#wr_Sa_#ft_#nicht_ostersonntag",
      "sys": false,
      "created_at": "2022-02-07T11:40:53.790Z",
      "updated_at": "2022-02-07T11:40:53.790Z"
  }
}

describe("Whitebox testing", () => {
  describe("Instances", () => {
    test("Zeitraumkategorie is instanceof Zeitraumkategorie and Basic", () => {
      const z = new Zeitraumkategorie(zeitraumkategorien[1]);
      expect(z).toBeInstanceOf(Zeitraumkategorie);
      expect(z).toBeInstanceOf(Basic);
    });
  });

  describe("Zeitraumkategorie defines Propertys", () => {
    const data = zeitraumkategorien[9];
    const properties = [
      {key: "anfang", expectedValue: data.anfang},
      {key: "beschreibung", expectedValue: data.beschreibung},
      {key: "dauer", expectedValue: data.dauer},
      {key: "ende", expectedValue: data.ende},
      {key: "id", expectedValue: data.id},
      {key: "prio", expectedValue: data.prio},
      {key: "regelcode", expectedValue: data.regelcode},
      {key: "name", expectedValue: data.name},
      {key: "sys", expectedValue: data.sys},
      {key: "zeitraumregel_id", expectedValue: data.zeitraumregel_id}
    ];
    const z = new Zeitraumkategorie(data);
    properties.forEach(({key, expectedValue}) => {
      test(`sets ${   key}`, () => {
        expect(z[key]).toBe(expectedValue);
      });
    });

    test("get _info", () => {
      expect(z._info).toEqual(expect.any(Object));
    });
  });
});