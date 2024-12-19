import Basic from "../../../models/basic";

const eachMock = (data, callback, filter) => {
  const result = {
    obj: {},
    arr: []
  };
  let i = -1;
  for(const id in data) {
    i++;
    if(filter?.(data[id], id, i) === false) continue;
    result.arr.push(data[id]);
    result.obj[id] = data[id];
    if(callback?.(data[id], id, i) === true) break;
  }
  return result;
}

export const appModelRotationsplan = {
  data: {
    mitarbeiters: {
      _each(callback, filter) { return eachMock(appModelRotationsplan.page.data.mitarbeiter, callback, filter); }
    },
    funktionen: {
      _each(callback, filter) { return eachMock(appModelRotationsplan.page.data.funktionen, callback, filter); }
    },
    kontingente: {
      _each(callback, filter) { return eachMock(appModelRotationsplan.page.data.kontingente, callback, filter); }
    }
  },
  page:{
    timeline:{
      onlyActiveEmployees: true,
      fullWidth:3000,
      view:"contingent",
      years: {
        2022: {
          key:"2022",
          year:"2022",
          months:{
            march:{
              columnIndex:3,
              columnKey: "2022-2",
              columnWidth: 250,
              displayMonth: "März",
              displayDays:{
                days:{
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {},
                  31 : {}
                }
              },
              key: "2022-march",
              left: 750,
              visible: true
            },
            april:{
              columnIndex:4,
              columnKey: "2022-3",
              columnWidth: 250,
              displayMonth: "April",
              displayDays:{
                days:{
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {}
                }
              },
              key: "2022-april",
              left: 1000,
              visible: true
            },
            may: {
              columnIndex: 5,
              columnKey: "2022-4",
              columnWidth: 250,
              displayMonth: "Mai",
              displayDays: {
                days : {
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {},
                  31 : {}
                }
              },
              key: "2022-mai",
              left: 1250,
              visible: true
            },
            june: {
              columnIndex: 6,
              columnKey: "2022-5",
              columnWidth: 250,
              displayMonth: "Juni",
              displayDays: {
                days : {
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {}
                }
              },
              key: "2022-juni",
              left: 1500,
              visible: true
            },
            august: {
              columnIndex: 8,
              columnKey: "2022-7",
              columnWidth: 250,
              displayMonth: "August",
              displayDays: {
                days : {
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {},
                  31 : {}
                }
              },
              key: "2022-august",
              left: 2000,
              visible: true
            },
            september: {
              columnIndex: 9,
              columnKey: "2022-8",
              columnWidth: 250,
              displayMonth: "September",
              displayDays: {
                days : {
                  1 : {},
                  2 : {},
                  3 : {},
                  4 : {},
                  5 : {},
                  6 : {},
                  7 : {},
                  8 : {},
                  9 : {},
                  10 : {},
                  11 : {},
                  12 : {},
                  13 : {},
                  14 : {},
                  15 : {},
                  16 : {},
                  17 : {},
                  18 : {},
                  19 : {},
                  20 : {},
                  21 : {},
                  22 : {},
                  23 : {},
                  24 : {},
                  25 : {},
                  26 : {},
                  27 : {},
                  28 : {},
                  29 : {},
                  30 : {}
                }
              },
              key: "2022-september",
              left: 2250,
              visible: true
            }
          }
        }
      }
    },
    data: {
      rotationen : {
        2814: {
          id:2814,
          mitarbeiter_id:472,
          kontingent_id:18,
          von:"2022-06-30",
          vonZahl:20220630,
          bis:"2022-09-30",
          bisZahl:20220930,
          prioritaet:null
        },
        2850: {
          id:2850,
          mitarbeiter_id:585,
          kontingent_id:21,
          von:"2022-05-01",
          vonZahl:20220501,
          bis:"2022-08-31",
          bisZahl:20220831,
          prioritaet:null
        },
        9999: {
          id:9999,
          mitarbeiter_id:999,
          kontingent_id:18,
          von:"2022-06-01",
          vonZahl:20220601,
          bis:"2022-06-30",
          bisZahl:20220630,
          prioritaet:null
        }
      },
      mitarbeiter: {
        585 : {
          id:585,
          aktiv:true,
          planname:"Schumann C",
          funktion_id:4,
          accountInfo: {},
          get _me() {return appModelRotationsplan.page.data.mitarbeiter[585]; }
        },
        999 : {
          id:999,
          aktiv:false,
          planname:"Testuser J",
          funktion_id:6,
          accountInfo: {},
          get _me() {return appModelRotationsplan.page.data.mitarbeiter[999]; }
        },
        419 : {
          id:419,
          aktiv:true,
          planname: "Krum L",
          funktion_id:4,
          accountInfo: {},
          get _me() {return appModelRotationsplan.page.data.mitarbeiter[419]; }
        },
        472 : {
          id:472,
          aktiv:true,
          planname:"Jacobi J",
          funktion_id:4,
          accountInfo: {},
          get _me() {return appModelRotationsplan.page.data.mitarbeiter[472]; }
        },
        506 : {
          id:506,
          aktiv:true,
          planname:"Stumpf M",
          funktion_id:4,
          accountInfo: {},
          get _me() {return appModelRotationsplan.page.data.mitarbeiter[506]; }
        }
      },
      kontingente:{
        18: {
          id: 18,
          kurzname:"COPOst",
          name:"CHIR Visceral",
          position:1620,
          get _me() {return appModelRotationsplan.page.data.kontingente[18]; }
        },
        21: {
          id:21,
          kurzname:"COPEG",
          name:"CHIR Urologie",
          position:1619,
          get _me() {return appModelRotationsplan.page.data.kontingente[21]; }
        }
      }
    }
  }
}

export const createInitialYears = () => {
  const curYear = new Date().getFullYear();
  const curMonth = new Date().getMonth();
  let prevMonth; let nextMonth;
  const rangeMonths = 4;

  const initialsYears = {
    [curYear]: { months: [] },
    [curYear-1]: { months:[] },
    [curYear+1]: { months:[] }
  }

  for (let i = 1; i <=rangeMonths; i++){
    if(curMonth - i < 0){
      prevMonth = (curMonth - i) + 12;
      initialsYears[curYear -1].months = [prevMonth, ...initialsYears[curYear -1].months];
    }
    else {
      prevMonth = curMonth - i;
      initialsYears[curYear].months = [prevMonth, ...initialsYears[curYear].months];
    }
  }

  initialsYears[curYear].months = [...initialsYears[curYear].months, curMonth];

  for (let i = 1; i <=rangeMonths; i++){
    if(curMonth + i > 11){
      nextMonth = (curMonth + i) - 12;
      initialsYears[curYear +1].months = [...initialsYears[curYear +1].months, nextMonth];
    }
    else {
      nextMonth = curMonth + i;
      initialsYears[curYear].months = [...initialsYears[curYear].months, nextMonth];
    }
  }

  //
  if(!initialsYears[curYear-1].months.length) delete initialsYears[curYear-1]
  if(!initialsYears[curYear+1].months.length) delete initialsYears[curYear+1]

  return initialsYears;
}

export const clearAppModelFromBasic = () => {
  if(Basic._appModel_ !== undefined) {
    delete Basic._appModel_;
  } 
}

export const initAppModelRotationsplanToBasic = () => {
  Basic._appModel_ = appModelRotationsplan;
}
