import { keinTeamName } from "../../tools/helper";
import { isObject } from "../../tools/types";

/**
 * Schnittstelle um Statistiken zu ermitteln
 */
class Statistiken {
  /**
   * Berechnet das Soll und das Ist
   * @param {Object} m
   * @param {Object} date
   * @param {Object} dienst
   * @param {Object} feld
   * @param {Boolean} addDefaultIst
   * @returns Object
   */
  countArbeitszeit(m, date, feld, addDefaultIst = false) {
    const result = {
      Soll: 0.0,
      Ist: 0.0,
      Bereitschaft: 0.0,
      Rufbereitschaft: 0.0
    };
    const arbeitszeit = feld?.arbeitszeit;
    if (m?.getSollStunden && date?.id) {
      const time = m.getSollStunden(date.id, true);
      result.Soll += time;
      if(addDefaultIst && !arbeitszeit 
        && !m?.hasEinteilungenAm?.(date?.id) 
        && !m?.hasAusgleichsFreiAm?.(date.id)) {
        result.Ist = time;
      }
    }
    if (arbeitszeit) {
      result.Ist += arbeitszeit?.Ist || 0.0;
      result.Bereitschaft += arbeitszeit?.Bereitschaft || 0.0;
      result.Rufbereitschaft += arbeitszeit?.Rufbereitschaft || 0.0;
    }
    return result;
  }

  /**
   * Zählt die Werte eines Keys der Wochenbilanz einer Mitarbeiterin aus dem Vormonat zusammen.
   * @param {Object} wochenbilanzen
   * @param {Object} mitarbeiter
   * @param {Array} keys
   * @returns Number
   */
  countArbeitszeitVormonat(wochenbilanzen, mitarbeiter, keys) {
    const values = {};
    if (mitarbeiter?.id && keys?.forEach) {
      wochenbilanzen?._each?.((wb) => {
        const wbMitarbeiter = wb?.[mitarbeiter.id];
        wbMitarbeiter && keys.forEach((key) => {
          if (values[key] === undefined) values[key] = 0.0;
          const float = parseFloat(wbMitarbeiter?.[key]);
          if (!Number.isNaN(float)) {
            values[key] += float;
          }
        });
      });
    }
    return values;
  }

  /**
   * Ermittelt die Urlaubsstatistik
   * @param {Object} mitarbeiter
   * @param {Object} date
   * @param {Object} feld
   * @param {String} defaultName
   * @param {Object} initTeamBedarf
   * return Object
   */
  countForUrlaubsstatistik(mitarbeiter, date, einteilungen, defaultName = "Kein Team", teamBedarfe = false) {
    const getTeamBedarf = (team) => {
      const teamName = team ? team.name : defaultName;
      const teamBedarf = teamBedarfe?.[teamName] || team?.defaultBedarf || {
        Bedarf: 0,
        Min: 0,
        Opt: 0,
        Einteilung: 0,
        Krank: 0,
        Urlaub: 0,
        Sonstig: 0,
        Verfuegbar: 0,
        ID: 0,
        label: teamName
      };
      return teamBedarf;
    }

    const addToFunktionen = (teamBedarf) => {
      if (!teamBedarf?.Funktionen) teamBedarf.Funktionen = {};
      const f = mitarbeiter?.funktion || {
        id: 0,
        order: -1,
        planname: "Keine"
      };
      if (!teamBedarf.Funktionen[f.id]) {
        teamBedarf.Funktionen[f.id] = {
          count: 0, label: f.planname, order: f.prio, id: f.id
        };
      }
      teamBedarf.Funktionen[f.id].count += 1;
    };

    const mitarbeiterTeam = date?.id && mitarbeiter?.getPrioTeamAm?.(date?.id);
    const isAktiv = date?.id ? mitarbeiter?.aktivAm?.(date?.id) : mitarbeiter?.aktiv;
    if (einteilungen?.length) {
      // Mitarbeiter mit Einteilungen sind nicht für ihr Team verfügbar.
      // Einteilung wird dem Team des Dienstes zugerechnet
      einteilungen.forEach((feld) => {
        const teamBedarf = getTeamBedarf(feld?.dienst?.hasBedarf 
          ? feld?.dienst?.team
          : mitarbeiterTeam);
        let key = "Einteilung";
        if (feld.dienst?.stundennachweis_krank) {
          key = "Krank";
        } else if (feld.dienst?.stundennachweis_urlaub) {
          key = "Urlaub";
        } else if (feld.dienst?.stundennachweis_sonstig) {
          key = "Sonstig";
        }
        teamBedarf[key] += 1;
      });
    } else if(isAktiv) {
      // Mitarbeiter ohne Einteilung an diesem Tag, ist für sein Prio-Team verfügbar
      const teamBedarf = getTeamBedarf(mitarbeiterTeam);
      teamBedarf.Verfuegbar += 1;
      // console.log(mitarbeiter.planname, date.label, teamBedarf.Verfuegbar, teamBedarf.label)
      addToFunktionen(teamBedarf);
    }

    return teamBedarfe;
  }

  /**
   * Berechnet das Saldo aus dem TeamBedarf
   * @param {Object} value
   * @param {Object} teams
   * @param {String} tag
   * @returns Object
   */
  getUrlaubssaldo(value, teams, tag = false) {
    const teamKrankPuffer = teams?.[value.ID]?.getKrankPuffer?.(tag) || 0;
    let puffer = teamKrankPuffer - value.Krank;
    // let puffer = 0 - value.Krank;
    // Wenn Krank > Puffer oder Unbesetzter Bedarf < 1, dann braucht es keinen Puffer
    if (puffer < 0) puffer = 0;
    else if (value.Bedarf < 1) puffer = 0;
    return {
      saldo: value.Verfuegbar - value.Bedarf - puffer,
      puffer,
      teamKrankPuffer
    };
  }

  /**
   * Erstellt den Title für das Urlaubssaldo
   * @param {Object} teamSaldo 
   * @param {String} teamName 
   * @param {Number} puffer 
   * @param {Array} titleBase 
   * @returns Array [{ txt: title1 }, {txt: title2 }, ...]
   */
  createUrlaubssaldoTitle(teamStatistik, teamName = "ERROR", saldo = 0, puffer = 0, titleBase = [], teamKrankPuffer = 0) { 
    const title = [
      ...titleBase,
      {
        txt: `Team: ${teamName}`
        + `\n(1) Verfügbare Mitarbeiter: ${teamStatistik.Verfuegbar}`
        + `\n(2) Unbesetzter Bedarf: ${teamStatistik.Bedarf}`
        + `\n(3) Puffer: ${puffer}`
        + `\n(4) Gesamtbedarf: ${teamStatistik.Min} + ${teamStatistik.Opt} = ${teamStatistik.Min + teamStatistik.Opt}`
        + `\n(5) Krank-Puffer-Team: ${teamKrankPuffer}`
      },
      {
        txt: `Ergebnis = (1) - (2) - (3)\n`
        + `Ergebnis: ${teamStatistik.Verfuegbar} - ${teamStatistik.Bedarf} - ${puffer} = ${saldo}`
      },
      {
        txt: `Einteilungen:\nKrank: ${teamStatistik.Krank},`
        + ` Urlaub: ${teamStatistik.Urlaub}, Sonstiges: ${teamStatistik.Sonstig},`
        + ` Rest: ${teamStatistik.Einteilung}`
      }
    ];
    if (isObject(teamStatistik?.Funktionen)) {
      title.push({
        txt: `Verfügbare Mitarbeiter nach Funktion:\n${
          Object.values(teamStatistik.Funktionen)
            .map(({ count, label }) => `${label}: ${count}`)
            .join(", ")}`
      });
    }
    if (isObject(teamStatistik.Substitutionen)) {
      Object.entries(teamStatistik.Substitutionen)
        .forEach((arr) => {
          title.push({
            txt: `Substitution ${arr[0]}:\n${
              Object.values(arr[1])
                .map(({ count, label }) => `${label}: ${count > 0 ? `+${count}` : count}`)
                .join(", ")}`
          });
        });
    }
    return title;
  }

  /**
   * Verteilt Mitarbeiter ohne Team
   * und überschüssige Mitarbeiter aus dem Default-Team auf die restlichen Teams
   * @param {Object} sum
   * @param {String} defaultTeam
   * @param {Object} teams
   * @param {String} tag
   */
  verteilenUrlaubsStatistikTeams(sum, defaultTeam, teams = false, tag = false) {
    if (sum[keinTeamName]) {
      if (this.verteilenUrlaubsStatistik(
        sum[keinTeamName],
        sum,
        sum[defaultTeam],
        teams,
        tag
      )) {
        if (sum[keinTeamName].Saldo === 0) delete sum[keinTeamName];
      }
      this.verteilenUrlaubsStatistik(
        sum[defaultTeam],
        sum,
        sum[defaultTeam],
        teams,
        tag
      );
    }
  }

  /**
   * Verteilt die Team-Bedarfe aus der Urlaubsstatistik
   * @param {Object} from
   * @param {Object} teamBedarfe
   * @param {Object} defaultTeam
   * @param {Object} teams
   * @param {String} tag
   * @returns True, wenn from und defaultTeam gleich sind.
   */
  verteilenUrlaubsStatistik(from, teamBedarfe, defaultTeam, teams = false, tag = false) {
    if (from?.Funktionen && defaultTeam) {
      from.Saldo = this.getUrlaubssaldo(from, teams, tag).saldo;
      if (from.Saldo > 0) {
        const substract = (f, diff, label) => {
          let value = diff;
          // Saldo nur bis auf 0 verteilen
          if (from.Saldo - diff < 0) {
            value += from.Saldo - diff;
          }
          from.Verfuegbar -= value;
          f.count -= value;
          from.Saldo = this.getUrlaubssaldo(from, teams, tag).saldo;
          if (!from.Substitutionen) from.Substitutionen = {};
          if (!from.Substitutionen[label]) from.Substitutionen[label] = {};
          const sub = from.Substitutionen[label];
          if (!sub[f.id]) sub[f.id] = { ...f, count: 0 };
          sub[f.id].count -= value;

          return value;
        };
        const add = (f, team, diff) => {
          const value = substract(f, diff, team.Label);
          if (value <= 0) return;
          team.Verfuegbar += value;
          team.Saldo = this.getUrlaubssaldo(team, teams, tag).saldo;
          if (!team.Funktionen) team.Funktionen = {};
          if (!team.Funktionen[f.id]) team.Funktionen[f.id] = { ...f, count: 0 };
          team.Funktionen[f.id].count += value;
          if (!team.Substitutionen) from.Substitutionen = {};
          if (!team.Substitutionen[from.Label]) team.Substitutionen[from.Label] = {};
          const sub = team.Substitutionen[from.Label];
          if (!sub[f.id]) sub[f.id] = { ...f, count: 0 };
          sub[f.id].count += value;
        };

        const checkFunktionen = (team, f) => team?.acceptedFunktionen?.includes?.(f.id);

        const _teams = Object.values(teamBedarfe).filter((t) => {
          t.Saldo = this.getUrlaubssaldo(t, teams, tag).saldo;
          const isNotKeinTeamAndNotFrom = t.ID > 0 && t.ID !== from.ID;
          return isNotKeinTeamAndNotFrom && t?.acceptedFunktionen?.length && t.Saldo < 0;
        });
        for (const fId in from.Funktionen) {
          const f = from.Funktionen[fId];
          let next = 0;
          let restTeam = defaultTeam;
          _teams.sort((a, b) => a.Saldo - b.Saldo);
          while (next < _teams.length && f.count > 0 && from.Saldo > 0) {
            const team = _teams[next];
            const check = checkFunktionen(team, f);
            if (check) {
              if (!checkFunktionen(restTeam, f)) restTeam = team;
              if (team.Saldo < 0) {
                let diff = f.count;
                if (team.Saldo + diff > 0) {
                  diff -= team.Saldo + diff;
                }
                add(f, team, diff);
              }
            }
            next++;
          }
          if (f.count < 0) console.log("Error: F.Count < 0", from, f.count);
          if (from.Saldo <= 0) break;
          else if (f.count > 0 && from !== defaultTeam) {
            add(f, restTeam, f.count);
          }
        }
        if (from.Saldo < 0) console.log("Error: From-Team hat ein Saldo < 0.", from, from.Saldo);
      }
    }
    return from !== defaultTeam;
  }

  /**
   * Erstellt eine Statistik über die Einteilungen der Mitarbeiter.
   * @param {Object} mitarbeiter
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterEinteilungenBar(mitarbeiter, callback = false) {
    const data = [];
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        Dienstplan: 0,
        Urlaubsplan: 0
      };
      const einteilungen = m?.getAllEinteilungen?.();
      einteilungen?.forEach?.((feld) => {
        const key = feld?.dienst?.hasBedarf ? "Dienstplan" : "Urlaubsplan";
        const add = callback ? callback(m, feld) : true;
        if (add) {
          obj[key] += 1;
        }
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die Einteilungen der Mitarbeiter.
   * @param {Object} mitarbeiter
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterArbeitszeitenBar(mitarbeiter, callback = false, addDefaultIst = false, addSoll = false) {
    const data = [];
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        unit: "Std."
      };
      obj.Volldienst = 0;
      obj.Bereitschaft = 0;
      obj.Rufbereitschaft = 0;
      if(addDefaultIst) obj["Default Volldienst"] = 0;
      if (addSoll) obj.Soll = 0;
      const {
        soll,
        ist
      } = m?.getArbeitszeitSoll?.((date) => {
        const check = callback ? callback({mitarbeiter: m, date}) : true;
        if(!check) return false;
        const einteilungen = m?.getEinteilungenNachTag?.(date.id);
        einteilungen?.forEach?.((feld) => {
          const add = callback ? callback({mitarbeiter: m, feld}) : true;
          const arbeitzeit = feld?.dienst?.hasBedarf && feld?.arbeitszeit;
          if (add && arbeitzeit) {
            obj.Volldienst = arbeitzeit?.Ist || 0;
            obj.Bereitschaft = arbeitzeit?.Bereitschaft || 0;
            obj.Rufbereitschaft = arbeitzeit?.Rufbereitschaft || 0;
          }
        });
        return check;
      }) || {
        soll: 0,
        ist: 0
      };
      const keys = [
        "Volldienst",
        "Bereitschaft", 
        "Rufbereitschaft"
      ];
      if(addDefaultIst) {
        obj["Default Volldienst"] = ist;
        keys.push("Default Volldienst");
      }
      if (addSoll) {
        obj.Soll = soll;
        keys.push("Soll");
      }
      keys.forEach((key) => {
        if(!obj[key]) return;
        obj[key] = parseFloat(obj[key].toFixed(2));
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die Einteilungen der Mitarbeiter.
   * @param {Object} mitarbeiter
   * @param {Array} arbeitszeittypen
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterArbeitszeitenTypenBar(mitarbeiter, arbeitszeittypen, callback = false) {
    const data = [];
    const typen = {};
    arbeitszeittypen?.forEach?.((typ) => {
      typen[typ.name] = 0.0;
    });
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        ...typen
      };
      m?.eachArbeitszeittyp?.((typ, felder, einteilungsMonat) => {
        const add = callback ? callback(m, einteilungsMonat, typ, felder) : true;
        if (add && felder?.reduce && obj[typ.name] !== undefined) {
          obj[typ.name] += felder.reduce((total, feld) => total + (feld?.arbeitszeittypValue
            ? feld.arbeitszeittypValue(typ) : 0), 0.0);
        }
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die Einteilungen der Mitarbeiter in Nachtdienste.
   * @param {Object} mitarbeiter
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterNachtdienstEinteilungenBar(mitarbeiter, callback = false) {
    const data = [];
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        Nachtdienste: 0
      };
      const einteilungen = m?.getNachtDienste?.();
      einteilungen?.forEach?.((feld) => {
        const add = callback ? callback(m, feld) : true;
        if (add) {
          obj.Nachtdienste += 1;
        }
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die eingeteilten Wochenenden im Dienstplan.
   * @param {Object} mitarbeiter
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterWochenendenDPLBar(mitarbeiter, callback = false) {
    const data = [];
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        Wochenenden: 0
      };
      m?.eachArbeitszeittyp && m?.eachEinteilungsMonat?.((einteilungsMonat) => {
        const add = callback ? callback(m, einteilungsMonat) : true;
        const wochenenden = einteilungsMonat?.dienstplan?.wochenenden;
        if (add && wochenenden) {
          obj.Wochenenden += Object.values(wochenenden).length;
        }
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die Einteilungen der Mitarbeiter.
   * @param {Object} mitarbeiter
   * @param {Function} callback
   * @returns Array
   */
  mitarbeiterWochentageDPLBar(mitarbeiter, callback = false) {
    const data = [];
    mitarbeiter?._each?.((m) => {
      const obj = {
        name: m?.cleanedPlanname || "Unbekannt",
        mitarbeiter: m,
        Wochentage: 0,
        Wochenenden: 0,
        Feiertage: 0
      };
      const einteilungen = m?.getAllEinteilungen?.();
      einteilungen?.forEach?.((feld) => {
        const add = callback ? callback(m, feld) : true;
        if (add && feld?.dienst?.hasBedarf) {
          const key = feld?.isWeekend ? "Wochentage" : "Wochenenden";
          obj[key] += 1;
          if (feld?.date?.isFeiertag) {
            obj.Feiertage += 1;
          }
        }
      });
      data.push(obj);
    });
    return data;
  }

  /**
   * Erstellt eine Statistik über die Konflikte der Einteilungen der Mitarbeiter.
   * @param {Object} mitarbeiter
   * @param {Array} arbeitszeittypen
   * @param {Function} callback
   * @returns Array
   */
  konflikteBar(mitarbeiter, arbeitszeittypen, callback = false) {
    const data = {
      Abwesend: {
        name: "Abwesend",
        Anzahl: 0,
        felder: []
      },
      Mehrfacheinteilungen: {
        name: "Mehrfacheinteilungen",
        Anzahl: 0,
        felder: []
      },
      Ueberschneidungen: {
        name: "Überschneidungen",
        Anzahl: 0,
        felder: []
      },
      Wochenende: {
        name: "Wochenende",
        Anzahl: 0,
        felder: []
      },
      Freigaben: {
        name: "Freigaben",
        Anzahl: 0,
        felder: []
      },
      Team: {
        name: "Team",
        Anzahl: 0,
        felder: []
      },
      Dienstgruppe: {
        name: "Dienstgruppe",
        Anzahl: 0,
        felder: []
      },
      Fordert_Dienstgruppe: {
        name: "Fordert_Dienstgruppe",
        Anzahl: 0,
        felder: []
      },
      Fordert_Dienstgruppe_Vorher: {
        name: "Fordert_Dienstgruppe_Vorher",
        Anzahl: 0,
        felder: []
      }
    };
    arbeitszeittypen?.forEach?.((typ) => {
      if (typ?.min || typ?.max) {
        data[typ.name] = {
          name: typ.name,
          Anzahl: 0,
          felder: []
        };
      }
    });
    mitarbeiter?._each?.((m) => {
      const einteilungen = m?.getAllEinteilungen?.();
      einteilungen?.forEach?.((feld) => {
        const add = callback ? callback(m, feld) : true;
        const feldKonflikte = add && feld?.getKonflikt?.(false)?.konflikte;
        if (!isObject(feldKonflikte)) return false;
        for (const key in feldKonflikte) {
          if (data[key]) {
            data[key].Anzahl += 1;
            data[key].felder.push(feld);
          } else {
            data[key] = {
              name: key,
              Anzahl: 1,
              felder: [feld]
            };
          } 
        }
        return false;
      });
    });
    return Object.values(data);
  }

  /**
   * Liefert die Daten für die Wünsche-Erfüllung
   * @param {Object} mitarbeiter
   * @param {Funtion} callback
   */
  wuenscheErfuelltBar(wuensche, callback = false) {
    const data = [
      {
        name: "Erfüllt",
        Anzahl: 0,
        wuensche: []
      },
      {
        name: "Nicht Erfüllt",
        Anzahl: 0,
        wuensche: []
      },
      {
        name: "Nicht Eingeteilt",
        Anzahl: 0,
        wuensche: []
      }
    ];
    const addToData = (i, w) => {
      data[i].Anzahl += 1;
      data[i].wuensche.push(w);
    };
    wuensche?._each?.((w) => {
      const add = callback ? callback(w?.mitarbeiter, w) : true;
      if (!add) return false;
      const result = w?.checkErfuellt;
      const erfuellt = result?.erfuellt?.length;
      const nichtErfuellt = result?.nichtErfuellt?.length;
      if (erfuellt || nichtErfuellt) {
        if (erfuellt) {
          addToData(0, w);
        }
        if (nichtErfuellt) {
          addToData(1, w);
        }
      } else {
        addToData(2, w);
      }
    });
    return data;
  }

  /**
   * Liefert die Daten für die Einteilungen in Rotation
   * @param {Object} mitarbeiter
   * @param {Function} callback
   */
  inRotationenBar(mitarbeiter, callback = false) {
    const data = [
      {
        name: "In Rotation",
        Anzahl: 0,
        felder: []
      },
      {
        name: "Nicht in Rotation",
        Anzahl: 0,
        felder: []
      }
    ];
    mitarbeiter?._each?.((m) => {
      const einteilungen = m?.getAllEinteilungen?.();
      einteilungen?.forEach?.((feld) => {
        const add = callback ? callback(m, feld) : true;
        if (add) {
          const inRot = m.isInDienstTeam(feld?.dienstId || 0, feld?.tag || false);
          const key = inRot ? 0 : 1;
          data[key].Anzahl += 1;
          data[key].felder.push(feld);
        }
      });
    });
    return data;
  }
}

export default Statistiken;
