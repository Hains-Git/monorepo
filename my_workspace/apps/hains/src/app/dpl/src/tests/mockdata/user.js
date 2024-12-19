export const userDienstplanSettings = {
    529: {
        "vorlagen": [
            {
                "id": 3,
                "mitarbeiter_id": 576,
                "name": "Test",
                "dienste": [
                    29,
                    33,
                    37,
                    41,
                    30,
                    34,
                ],
                "created_at": "2022-02-04T14:35:03.645+01:00",
                "updated_at": "2022-05-11T09:46:55.613+02:00",
                "standard": true,
                "team_id": 4,
                "funktionen_ids": [
                    2,
                    5,
                    3
                ]
            },
            {
                "id": 5,
                "mitarbeiter_id": 576,
                "name": "add feld",
                "dienste": [
                    74,
                    75,
                    76,
                    77,
                    78,
                    79,
                    80,
                    81
                ],
                "created_at": "2022-02-17T16:23:23.593+01:00",
                "updated_at": "2022-05-11T09:46:55.620+02:00",
                "standard": false,
                "team_id": null,
                "funktionen_ids": [
                    1,
                    2
                ]
            }
        ],
        "dienstplan_custom_felder": [
            {
                "id": 52,
                "ansicht_id": 0,
                "vorlage_id": 12,
                "row": true,
                "index": 1,
                "name": "test",
                "count_all_typ": 1,
                "created_at": "2022-07-05T05:30:03.469Z",
                "updated_at": "2022-07-05T09:04:48.265Z",
                "custom_counter_ids": [
                    29
                ]
            },
            {
                "id": 53,
                "ansicht_id": 0,
                "vorlage_id": 12,
                "row": true,
                "index": 2,
                "name": "bla",
                "count_all_typ": 0,
                "created_at": "2022-07-05T05:41:14.465Z",
                "updated_at": "2022-07-05T05:41:14.465Z",
                "custom_counter_ids": []
            }
        ],
        "dienstplan_custom_counter": [
            {
                "id": 29,
                "name": "Neuer Zähler",
                "dienste_ids": [],
                "mitarbeiter_ids": [],
                "dienstplan_custom_feld_id": 52,
                "beschreibung": "",
                "cell_id": "headdienst_1_1_0_29_0_0",
                "created_at": "2022-07-05T09:04:48.243Z",
                "updated_at": "2022-07-05T09:04:48.243Z",
                "date_ids": [],
                "colors": [],
                "hidden": false,
                "aktiv": true,
                "inaktiv": false,
                "currently_in_team": true,
                "mit_bedarf": true,
                "ohne_bedarf": true,
                "act_as_funktion": false,
                "evaluate_seperate": true,
                "add_kein_mitarbeiterteam": false,
                "count": "Arbeitszeiten (Std)",
                "funktion": "",
                "feiertage": "auch",
                "mitarbeiterteam_ids": [],
                "mitarbeiterfunktionen_ids": [],
                "diensteteam_ids": [],
                "wochentage": []
            }
        ]
    },

};

export const userArray = [
  {
    "iss": "hains.info/api",
    "id": 529,
    "name": "abcd efg",
    "uid": null,
    "login": "abcd",
    "email": "abcdfg@mail",
    "created_at": "2021-05-03T13:18:34.039+02:00",
    "updated_at": "2022-05-30T11:02:42.754+02:00",
    "otp_enabled": false,
    "sign_in_count": 450,
    "url": "abcd.de",
    "sub": "abcd",
    "is_admin": true,
    "is_dienstplaner": true,
    "is_urlaubsplaner": true,
    "is_rotationsplaner": true,
    "roles": [
        "Rolle1",
        "Rolle2",
        "Rolle3"
    ],
    "hainsinfo": {
        "id": 702,
        "old_user_id": null,
        "comments": null,
        "nameKurz": "Abcd",
        "telephone": null,
        "privateEmail": "",
        "privateTelephone": "",
        "created_at": "2021-05-03T13:18:33.711+02:00",
        "updated_at": "2022-01-03T09:20:32.707+01:00",
        "anrede": "Hr.",
        "titelPraefix": "",
        "titelPostfix": "",
        "vorname": "A",
        "mittelname": "",
        "nachname": "BCD",
        "mobileTelefon": "",
        "dienstEmail": "abcd@mail",
        "dienstTelefon": "",
        "adresseStrasse": "Adress",
        "adressePlz": "12345",
        "adresseOrt": "Ort",
        "adresseLand": null,
        "aktivAb": null,
        "aktivBis": null,
        "mitarbeiter_id": 576,
        "user_id": null,
        "geburtsdatum": null,
        "teilzeit": "",
        "funktion": null,
        "vertragsbeginn_ukhd": "",
        "vertragsende": "",
        "geburtsort": ""
    }
  }
];