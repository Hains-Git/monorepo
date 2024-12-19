export function createConf(){
 return {
  columns:[
    {title:'ID', key:'id', type:'numeric'},
    {title:'Art', key:'antragstyp.name', type:'string'},
    {title:'Planname', key:'mitarbeiter.planname', type:'string'},
    {title:'Eingereicht', key:'created_at', type:'date', formatDate: {
      lang: 'de-De',
      props : {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }},
    {title:'Beginn', key:'start', type:'date'},
    {title:'Ende', key:'ende', type:'date'},
    {title:'Status', key:'antragsstatus.name', bg_color:'antragsstatus.color', type:'string'}
  ],
  pages:{
    sizes: [10,25,50,100,150,200,0],
    cur_size: 10,
    visible:[1,2,3,4,5]
  },
  order: {
    key: 'id',
    sort: 'asc',
    type: 'date' // date, numeric, string
  },
  append_child: {
    position:'first',
    childs:[
      {
        type:'checkbox',
        name:'bin',
        className:'bin-checkbox'
        /* callback: this.checkBoxChecked */
      }
    ]
  },
  filter: [
    {
      type: 'text',
      key: 'search',
      search_in : {
        key:'all'
      },
      initial_val: ""
    },
    {
      type:'select',
      key:'status',
      search_in: {
        key:'antragsstatus.id'
      },
      options:[
        {id: 1, name:'In Bearbeitung'},
        {id: 2, name:'Genehmigt'},
        {id: 3, name:'Nicht Genehmigt'},
        {id: 4, name:'In Klärung'},
        {id: 5, name:'In Rücksprache'},
        {id: 0, name:'Alle'}
      ],
      initial_val: 1
    },
    {
      type:"date",
      key: "begin",
      search_in: {
        key:"start"
      },
      initial_val: "",
      date_is: "start"
    },
    {
      type:"date",
      key: "ende",
      search_in: {
        key:"ende"
      },
      initial_val: "",
      date_is:"end"
    }
  ]
}
}
export const data = [
  {
      "id": 8023,
      "start": "2023-08-14",
      "ende": "2023-08-20",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-09-10T10:02:10.129Z",
      "updated_at": "2023-01-18T09:14:07.658Z",
      "mitarbeiter": {
          "id": 417,
          "name": "Catharina Lenz",
          "planname": "Lenz C",
          "accountInfo": {
              "dienstEmail": "Catharina.Lenz@med.uni-heidelberg.de",
              "user_id": 44
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8023,
              "weiteres": "Ende: 2023-08-25 zu 2023-08-20",
              "kommentar": "",
              "created_at": "2023-01-18T09:14:07.640Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8023,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-09-12T07:22:39.380Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8159,
      "start": "2023-08-28",
      "ende": "2023-09-08",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-09-28T12:10:04.290Z",
      "updated_at": "2023-01-19T10:35:04.405Z",
      "mitarbeiter": {
          "id": 52,
          "name": "Martin Klever",
          "planname": "Klever M",
          "accountInfo": {
              "dienstEmail": "Martin.Klever@med.uni-heidelberg.de",
              "user_id": 58
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8159,
              "weiteres": "Beginn: 2023-08-21 zu 2023-08-28</br>",
              "kommentar": "",
              "created_at": "2023-01-19T10:35:04.383Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8159,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-11-08T10:50:31.353Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8168,
      "start": "2023-05-17",
      "ende": "2023-05-31",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-01T10:46:22.543Z",
      "updated_at": "2023-02-16T08:48:34.017Z",
      "mitarbeiter": {
          "id": 363,
          "name": "Mozhgan Shakeri",
          "planname": "Shakeri M",
          "accountInfo": {
              "dienstEmail": "Mozhgan.ShakeriHosseinabad@med.uni-heidelberg.de",
              "user_id": 372
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8168,
              "weiteres": "Beginn: 2023-05-25 zu 2023-05-17</br>",
              "kommentar": "",
              "created_at": "2023-02-16T08:48:34.002Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8168,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-06T13:58:36.149Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8169,
      "start": "2023-01-02",
      "ende": "2023-01-03",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-01T12:12:03.030Z",
      "updated_at": "2022-12-08T13:54:04.017Z",
      "mitarbeiter": {
          "id": 591,
          "name": "Martin Müller",
          "planname": "Müller M",
          "accountInfo": {
              "dienstEmail": "Martin.Mueller@med.uni-heidelberg.de",
              "user_id": null
          }
      },
      "antragstyp": {
          "id": 3,
          "name": "Freizeitausgleich"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8169,
              "weiteres": "Ende: 2023-01-05 zu 2023-01-03",
              "kommentar": "",
              "created_at": "2022-12-08T13:54:04.006Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8169,
              "weiteres": "Antragsart: Urlaub zu Freizeitausgleich</br>",
              "kommentar": "",
              "created_at": "2022-11-25T13:16:05.715Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8169,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-10-04T12:52:02.097Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8233,
      "start": "2023-05-08",
      "ende": "2023-05-10",
      "abgesprochen": "",
      "kommentar": "TEE-Grundkurs",
      "created_at": "2022-10-12T11:15:24.011Z",
      "updated_at": "2022-12-08T10:51:31.968Z",
      "mitarbeiter": {
          "id": 224,
          "name": "Manuel Obermaier",
          "planname": "Obermaier M",
          "accountInfo": {
              "dienstEmail": "Manuel.Obermaier@med.uni-heidelberg.de",
              "user_id": 85
          }
      },
      "antragstyp": {
          "id": 2,
          "name": "Fortbildung"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8233,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-08T10:51:31.960Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8176,
      "start": "2023-05-12",
      "ende": "2023-05-12",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-04T09:15:53.167Z",
      "updated_at": "2023-01-10T10:01:40.989Z",
      "mitarbeiter": {
          "id": 468,
          "name": "Julia Bongiovanni",
          "planname": "Bongiovanni J",
          "accountInfo": {
              "dienstEmail": "Julia.Bongiovanni@med.uni-heidelberg.de",
              "user_id": null
          }
      },
      "antragstyp": {
          "id": 4,
          "name": "Dienstreise"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8176,
              "weiteres": "Antragsart: Fortbildung zu Dienstreise</br>Beginn: 2023-03-17 zu 2023-05-12</br>Ende: 2023-03-17 zu 2023-05-12",
              "kommentar": "",
              "created_at": "2023-01-10T10:01:40.972Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8176,
              "weiteres": "",
              "kommentar": "Hallo Julia,\r\num welche Fortbildung geht es denn?\r\nBitte immer das Formular ausfüllen und beifügen.\r\nLG Kristina",
              "created_at": "2022-11-08T07:46:54.849Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 5,
                  "name": "Rücksprache",
                  "color": "purple"
              }
          }
      ]
  },
  {
      "id": 8208,
      "start": "2023-10-02",
      "ende": "2023-10-02",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-09T15:35:52.716Z",
      "updated_at": "2022-10-09T15:35:52.716Z",
      "mitarbeiter": {
          "id": 455,
          "name": "Dania Fischer",
          "planname": "Fischer D",
          "accountInfo": {
              "dienstEmail": "Dania.Fischer@med.uni-heidelberg.de",
              "user_id": 458
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 1,
          "name": "In Bearbeitung",
          "color": "yellow"
      },
      "antraege_history": []
  },
  {
      "id": 8209,
      "start": "2023-10-19",
      "ende": "2023-10-20",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-09T15:36:14.239Z",
      "updated_at": "2022-12-17T14:37:25.714Z",
      "mitarbeiter": {
          "id": 455,
          "name": "Dania Fischer",
          "planname": "Fischer D",
          "accountInfo": {
              "dienstEmail": "Dania.Fischer@med.uni-heidelberg.de",
              "user_id": 458
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8209,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T14:37:25.704Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8223,
      "start": "2023-06-22",
      "ende": "2023-06-23",
      "abgesprochen": "",
      "kommentar": "Online Workshop der Universität, benötigt für APL-Verfahren.",
      "created_at": "2022-10-11T12:38:12.898Z",
      "updated_at": "2022-12-17T15:36:03.754Z",
      "mitarbeiter": {
          "id": 70,
          "name": "Aleksandar Zivkovic",
          "planname": "Zivkovic A",
          "accountInfo": {
              "dienstEmail": "Aleksandar.Zivkovic@med.uni-heidelberg.de",
              "user_id": 53
          }
      },
      "antragstyp": {
          "id": 4,
          "name": "Dienstreise"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8223,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T15:36:03.747Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8210,
      "start": "2023-10-23",
      "ende": "2023-11-03",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-09T15:36:37.475Z",
      "updated_at": "2022-12-08T08:52:30.394Z",
      "mitarbeiter": {
          "id": 455,
          "name": "Dania Fischer",
          "planname": "Fischer D",
          "accountInfo": {
              "dienstEmail": "Dania.Fischer@med.uni-heidelberg.de",
              "user_id": 458
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8210,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-08T08:52:30.387Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8211,
      "start": "2023-12-27",
      "ende": "2023-12-29",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-09T15:37:01.351Z",
      "updated_at": "2023-02-03T13:39:14.905Z",
      "mitarbeiter": {
          "id": 455,
          "name": "Dania Fischer",
          "planname": "Fischer D",
          "accountInfo": {
              "dienstEmail": "Dania.Fischer@med.uni-heidelberg.de",
              "user_id": 458
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8211,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2023-02-03T13:39:14.888Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8234,
      "start": "2023-03-20",
      "ende": "2023-03-24",
      "abgesprochen": "OA Lichtenstern",
      "kommentar": "",
      "created_at": "2022-10-12T17:35:21.257Z",
      "updated_at": "2022-10-12T17:35:21.257Z",
      "mitarbeiter": {
          "id": 380,
          "name": "Iris Ritter",
          "planname": "Ritter I",
          "accountInfo": {
              "dienstEmail": "Iris.Ritter@med.uni-heidelberg.de",
              "user_id": 408
          }
      },
      "antragstyp": {
          "id": 3,
          "name": "Freizeitausgleich"
      },
      "antragsstatus": {
          "id": 1,
          "name": "In Bearbeitung",
          "color": "yellow"
      },
      "antraege_history": []
  },
  {
      "id": 8235,
      "start": "2023-03-27",
      "ende": "2023-04-16",
      "abgesprochen": "OA Lichtenstern",
      "kommentar": "",
      "created_at": "2022-10-12T17:36:27.600Z",
      "updated_at": "2022-10-12T17:36:27.600Z",
      "mitarbeiter": {
          "id": 380,
          "name": "Iris Ritter",
          "planname": "Ritter I",
          "accountInfo": {
              "dienstEmail": "Iris.Ritter@med.uni-heidelberg.de",
              "user_id": 408
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 1,
          "name": "In Bearbeitung",
          "color": "yellow"
      },
      "antraege_history": []
  },
  {
      "id": 8244,
      "start": "2023-06-21",
      "ende": "2023-06-23",
      "abgesprochen": "",
      "kommentar": "Ehrenamtliches delegiertes Laienmitglied der Ev.-meth. Kirche (entspricht der Synode der ev. Landeskirche)",
      "created_at": "2022-10-13T09:32:39.386Z",
      "updated_at": "2023-02-03T12:40:09.916Z",
      "mitarbeiter": {
          "id": 44,
          "name": "Tilmann Gruhlke",
          "planname": "Gruhlke T",
          "accountInfo": {
              "dienstEmail": "Tilmann.Gruhlke@med.uni-heidelberg.de",
              "user_id": 15
          }
      },
      "antragstyp": {
          "id": 3,
          "name": "Freizeitausgleich"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8244,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2023-02-03T12:40:09.899Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8255,
      "start": "2023-02-16",
      "ende": "2023-02-17",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-14T07:30:26.697Z",
      "updated_at": "2023-01-12T08:00:32.191Z",
      "mitarbeiter": {
          "id": 466,
          "name": "Victoria Albertsmeier",
          "planname": "Albertsmeier V",
          "accountInfo": {
              "dienstEmail": "Victoria.Albertsmeier@med.uni-heidelberg.de",
              "user_id": null
          }
      },
      "antragstyp": {
          "id": 2,
          "name": "Fortbildung"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8255,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2023-01-12T08:00:32.171Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8255,
              "weiteres": "",
              "kommentar": "Liebe Frau Albertsmeier,\r\num welche Fortbildung geht es denn?\r\nKönnten Sie bitte das Formular beifügen?\r\nVG Kristina Moroz",
              "created_at": "2022-11-08T07:31:55.754Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 5,
                  "name": "Rücksprache",
                  "color": "purple"
              }
          }
      ]
  },
  {
      "id": 8259,
      "start": "2023-08-28",
      "ende": "2023-09-08",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-14T08:03:41.728Z",
      "updated_at": "2022-12-08T09:07:14.814Z",
      "mitarbeiter": {
          "id": 4,
          "name": "Cornelius Busch",
          "planname": "Busch Co",
          "accountInfo": {
              "dienstEmail": "Cornelius.Busch@med.uni-heidelberg.de",
              "user_id": null
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8259,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-08T09:07:14.808Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8264,
      "start": "2023-05-30",
      "ende": "2023-06-09",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-14T10:24:14.303Z",
      "updated_at": "2022-12-08T10:07:38.177Z",
      "mitarbeiter": {
          "id": 59,
          "name": "Brigitta Lönard",
          "planname": "Lönard B",
          "accountInfo": {
              "dienstEmail": "Brigitta.Loenard@med.uni-heidelberg.de",
              "user_id": 143
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8264,
              "weiteres": "Beginn: 2023-06-01 zu 2023-05-30</br>",
              "kommentar": "",
              "created_at": "2022-12-08T10:07:38.170Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8257,
      "start": "2023-04-28",
      "ende": "2023-04-28",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-14T07:47:02.868Z",
      "updated_at": "2022-12-17T14:53:05.575Z",
      "mitarbeiter": {
          "id": 285,
          "name": "Mascha Fiedler",
          "planname": "Fiedler M",
          "accountInfo": {
              "dienstEmail": "Mascha.Fiedler@med.uni-heidelberg.de",
              "user_id": 316
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8257,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T14:53:05.568Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8268,
      "start": "2023-07-24",
      "ende": "2023-07-25",
      "abgesprochen": "",
      "kommentar": "Wenn möglich bitte FZA Mo-Di nach Dienstreise über das Wochenende",
      "created_at": "2022-10-14T18:39:15.760Z",
      "updated_at": "2023-02-03T13:15:40.781Z",
      "mitarbeiter": {
          "id": 224,
          "name": "Manuel Obermaier",
          "planname": "Obermaier M",
          "accountInfo": {
              "dienstEmail": "Manuel.Obermaier@med.uni-heidelberg.de",
              "user_id": 85
          }
      },
      "antragstyp": {
          "id": 3,
          "name": "Freizeitausgleich"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8268,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2023-02-03T13:15:40.759Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8272,
      "start": "2023-10-02",
      "ende": "2023-10-02",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-15T07:11:15.052Z",
      "updated_at": "2022-10-15T07:11:15.052Z",
      "mitarbeiter": {
          "id": 44,
          "name": "Tilmann Gruhlke",
          "planname": "Gruhlke T",
          "accountInfo": {
              "dienstEmail": "Tilmann.Gruhlke@med.uni-heidelberg.de",
              "user_id": 15
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 1,
          "name": "In Bearbeitung",
          "color": "yellow"
      },
      "antraege_history": []
  },
  {
      "id": 8275,
      "start": "2023-06-05",
      "ende": "2023-06-09",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-15T10:55:39.191Z",
      "updated_at": "2022-12-17T15:34:59.355Z",
      "mitarbeiter": {
          "id": 70,
          "name": "Aleksandar Zivkovic",
          "planname": "Zivkovic A",
          "accountInfo": {
              "dienstEmail": "Aleksandar.Zivkovic@med.uni-heidelberg.de",
              "user_id": 53
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8275,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T15:34:59.349Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8276,
      "start": "2023-08-14",
      "ende": "2023-09-08",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-15T10:56:27.792Z",
      "updated_at": "2022-12-17T15:31:35.518Z",
      "mitarbeiter": {
          "id": 70,
          "name": "Aleksandar Zivkovic",
          "planname": "Zivkovic A",
          "accountInfo": {
              "dienstEmail": "Aleksandar.Zivkovic@med.uni-heidelberg.de",
              "user_id": 53
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8276,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T15:31:35.509Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8282,
      "start": "2023-03-16",
      "ende": "2023-03-17",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-16T15:28:45.610Z",
      "updated_at": "2022-12-17T15:06:27.073Z",
      "mitarbeiter": {
          "id": 10,
          "name": "Sascha Klemm",
          "planname": "Klemm S",
          "accountInfo": {
              "dienstEmail": "sascha.klemm@med.uni-heidelberg.de",
              "user_id": 139
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8282,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T15:06:27.067Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8296,
      "start": "2024-01-03",
      "ende": "2024-01-04",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-16T21:31:52.852Z",
      "updated_at": "2023-02-16T08:32:51.705Z",
      "mitarbeiter": {
          "id": 170,
          "name": "Christiane Kreuter",
          "planname": "Kreuter C",
          "accountInfo": {
              "dienstEmail": "Christiane.Kreuter@med.uni-heidelberg.de",
              "user_id": 25
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 3,
          "name": "Nicht Genehmigt",
          "color": "red"
      },
      "antraege_history": [
          {
              "antraege_id": 8296,
              "weiteres": "",
              "kommentar": "Liebe Frau Dr. Kreuter, \r\nkönnten Sie bitte die Anträge für 2024 in zweiter Hälfte des Jahres stellen?\r\nWir haben noch kein Programm für 2024. Vielen Dank!\r\nLG Kristina Moroz",
              "created_at": "2023-02-16T08:32:51.688Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 3,
                  "name": "Nicht Genehmigt",
                  "color": "red"
              }
          }
      ]
  },
  {
      "id": 8317,
      "start": "2023-03-27",
      "ende": "2023-04-02",
      "abgesprochen": "",
      "kommentar": "Resturlaub",
      "created_at": "2022-10-17T12:20:33.906Z",
      "updated_at": "2023-01-13T13:18:55.706Z",
      "mitarbeiter": {
          "id": 197,
          "name": "Sarah Dehne",
          "planname": "Dehne S",
          "accountInfo": {
              "dienstEmail": "Sarah.Dehne@med.uni-heidelberg.de",
              "user_id": 222
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8317,
              "weiteres": "Ende: 2023-04-03 zu 2023-04-02",
              "kommentar": "",
              "created_at": "2023-01-13T13:18:55.690Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8317,
              "weiteres": "Beginn: 2023-03-20 zu 2023-03-27</br>",
              "kommentar": "",
              "created_at": "2022-11-21T10:42:32.394Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 5,
                  "name": "Rücksprache",
                  "color": "purple"
              }
          },
          {
              "antraege_id": 8317,
              "weiteres": "",
              "kommentar": "Liebe Frau Dehne,\r\nes würde bis 2.04. gehen.\r\nBitte um Rückmeldung.\r\nVG Kristina Moroz",
              "created_at": "2022-11-08T07:54:25.083Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 5,
                  "name": "Rücksprache",
                  "color": "purple"
              }
          }
      ]
  },
  {
      "id": 8330,
      "start": "2023-05-30",
      "ende": "2023-06-09",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-18T09:59:42.636Z",
      "updated_at": "2022-12-17T14:52:24.835Z",
      "mitarbeiter": {
          "id": 24,
          "name": "Sebastian Decker",
          "planname": "Decker S",
          "accountInfo": {
              "dienstEmail": "Sebastian.Decker@med.uni-heidelberg.de",
              "user_id": 182
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8330,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-17T14:52:24.829Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8331,
      "start": "2023-08-21",
      "ende": "2023-09-08",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-18T10:00:48.350Z",
      "updated_at": "2022-12-08T09:07:51.563Z",
      "mitarbeiter": {
          "id": 24,
          "name": "Sebastian Decker",
          "planname": "Decker S",
          "accountInfo": {
              "dienstEmail": "Sebastian.Decker@med.uni-heidelberg.de",
              "user_id": 182
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8331,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-12-08T09:07:51.557Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8332,
      "start": "2023-01-24",
      "ende": "2023-01-24",
      "abgesprochen": "",
      "kommentar": "Wichtiger Termin beim Arzt",
      "created_at": "2022-10-18T10:18:02.625Z",
      "updated_at": "2023-01-18T09:19:48.361Z",
      "mitarbeiter": {
          "id": 458,
          "name": "Marlon Rutsch",
          "planname": "Rutsch M",
          "accountInfo": {
              "dienstEmail": "Marlon.Rutsch@med.uni-heidelberg.de",
              "user_id": 461
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8332,
              "weiteres": "Beginn: 2023-01-27 zu 2023-01-24</br>Ende: 2023-01-27 zu 2023-01-24",
              "kommentar": "",
              "created_at": "2023-01-18T09:19:48.350Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8332,
              "weiteres": "Beginn: 2023-01-09 zu 2023-01-27</br>Ende: 2023-01-09 zu 2023-01-27",
              "kommentar": "",
              "created_at": "2023-01-02T10:02:14.913Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8332,
              "weiteres": "",
              "kommentar": "",
              "created_at": "2022-11-07T11:13:27.062Z",
              "mitarbeiter": {
                  "id": 12,
                  "name": "Christoph Lichtenstern",
                  "planname": "Lichtenstern C"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          }
      ]
  },
  {
      "id": 8350,
      "start": "2023-06-14",
      "ende": "2023-06-16",
      "abgesprochen": "",
      "kommentar": "",
      "created_at": "2022-10-19T17:36:55.108Z",
      "updated_at": "2022-12-08T12:05:16.333Z",
      "mitarbeiter": {
          "id": 718,
          "name": "Hans Thomas Hölzer",
          "planname": "Hölzer H",
          "accountInfo": {
              "dienstEmail": "hansthomas.hoelzer@med.uni-heidelberg.de",
              "user_id": null
          }
      },
      "antragstyp": {
          "id": 1,
          "name": "Urlaub"
      },
      "antragsstatus": {
          "id": 2,
          "name": "Genehmigt",
          "color": "lightgreen"
      },
      "antraege_history": [
          {
              "antraege_id": 8350,
              "weiteres": "Beginn: 2023-06-15 zu 2023-06-14</br>Ende: 2023-06-19 zu 2023-06-16",
              "kommentar": "",
              "created_at": "2022-12-08T12:05:16.322Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 2,
                  "name": "Genehmigt",
                  "color": "lightgreen"
              }
          },
          {
              "antraege_id": 8350,
              "weiteres": "",
              "kommentar": "15-16.06. geht, 19.06. nicht mehr. Oder die volle Woche",
              "created_at": "2022-12-08T10:59:54.072Z",
              "mitarbeiter": {
                  "id": 529,
                  "name": "Kristina Moroz",
                  "planname": "Moroz K"
              },
              "antragsstatus": {
                  "id": 3,
                  "name": "Nicht Genehmigt",
                  "color": "red"
              }
          }
      ]
  },
  {
    "id": 9359,
    "start": "2023-02-17",
    "ende": "2023-02-19",
    "abgesprochen": "",
    "kommentar": "",
    "created_at": "2023-01-08T13:08:34.089+01:00",
    "updated_at": "2023-01-23T10:55:45.589+01:00",
    "mitarbeiter": {
        "id": 590,
        "name": "Martin Lenz",
        "planname": "Lenz M",
        "accountInfo": {
            "dienstEmail": "Martin.Lenz@med.uni-heidelberg.de",
            "user_id": null
        }
    },
    "antragstyp": {
        "id": 1,
        "name": "Urlaub"
    },
    "antragsstatus": {
        "id": 3,
        "name": "Nicht Genehmigt",
        "color": "red"
    },
    "antraege_history": [
        {
            "antraege_id": 9359,
            "weiteres": "",
            "kommentar": "",
            "created_at": "2023-01-23T10:55:45.567+01:00",
            "mitarbeiter": {
                "id": 529,
                "name": "Kristina Moroz",
                "planname": "Moroz K"
            },
            "antragsstatus": {
                "id": 3,
                "name": "Nicht Genehmigt",
                "color": "red"
            }
        }
    ]
  }
];

export const dataObj = data.reduce((acc, curr) => {
  acc[curr.id] = curr;
  return acc;
}, {});
