import { format } from 'date-fns';
import { prismaHains } from '../prisma-hains';
import { checkDate } from './zeitraumkategorie';

class PlanerDate {
  private static WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  private static MONTHS = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
  ];

  private static feiertage: Record<string, any> = {};
  private static last_week: Record<string, number> = {};

  week_counter: number;
  week_day: string;
  local_date_string: string;
  id: string;
  month: string;
  month_nr: number;
  is_weekend: boolean;
  weekend: string;
  full_date: Date | string;
  week_day_nr: number;
  week: number;
  day_of_year: number;
  feiertag: any;
  label: string;
  day: number;
  year: number;
  date_id: string;
  date_nr: number;
  celebrate: string;
  last_week: number;
  einteilungen: Record<string, any>;
  rotationen: any[];
  wuensche: any[];
  bedarf: any[];
  zeitraumkategorien: any[];
  bedarfseintraege: any[];
  by_dienst: Record<string, any>;
  by_mitarbeiter: Record<string, any>;
  kws_vormonat: any[];
  static prismaDb = prismaHains();

  constructor(date: Date, week_counter = 0, zeitraumkategorien: any[] = []) {
    this.einteilungen = {};
    this.rotationen = [];
    this.wuensche = [];
    this.bedarf = [];
    this.bedarfseintraege = [];
    this.zeitraumkategorien = [];
    this.by_dienst = {};
    this.by_mitarbeiter = {};
    this.last_week = 0;
    this.week_counter = week_counter;
    this.week_day = PlanerDate.WEEKDAYS[date.getDay()];
    this.local_date_string = date.toLocaleDateString('de-DE');
    this.id = date.toISOString().split('T')[0];
    this.month_nr = date.getMonth() + 1;
    this.month = PlanerDate.MONTHS[date.getMonth()];
    this.is_weekend = date.getDay() === 0 || date.getDay() === 6;
    this.weekend = this.is_weekend ? 'wochenende' : '';
    this.full_date = format(date, 'yyyy-MM-dd');
    this.week_day_nr = date.getDay();
    this.week = this.getWeekNumber(date);
    this.day_of_year = this.getDayOfYear(date);
    this.feiertag = '';
    this.label = `${this.week_day} ${date.getDate()}. ${this.month}`;
    this.day = date.getDate();
    this.year = date.getFullYear();
    this.date_id = this.id;
    this.date_nr = Number(this.id.split('-').join(''));
    this.celebrate = '';
    this.kws_vormonat = [];
    PlanerDate.getFeiertag(date).then((_feiertag) => {
      if (_feiertag) {
        this.feiertag = {
          name: _feiertag.name,
          day: _feiertag.tag,
          month: _feiertag.monat,
          full_date: _feiertag.datum,
        };
        this.celebrate = 'feiertag';
      }
      this.checkLastWeek();
      this.addZeitraumkategorien(zeitraumkategorien);
    });
  }

  pdfClass(): string {
    if (this.feiertag) {
      return 'holiday';
    } else if (this.is_weekend) {
      return 'weekend';
    }
    return '';
  }

  static async calcFeiertage(year: number) {
    const yearStr = year.toString();

    PlanerDate.feiertage[yearStr] = {
      '1': [
        {
          name: 'Neujahr',
          day: 1,
          month: 1,
          full_date: `${yearStr}-01-01`,
        },
        {
          name: 'Heilige Drei Könige',
          day: 6,
          month: 1,
          full_date: `${yearStr}-01-06`,
        },
      ],
      '2': [],
      '3': [],
      '4': [],
      '5': [
        {
          name: 'Tag der Arbeit',
          day: 1,
          month: 5,
          full_date: `${yearStr}-05-01`,
        },
      ],
      '6': [],
      '7': [],
      '8': [],
      '9': [],
      '10': [
        {
          name: 'Tag der deutschen Einheit',
          day: 3,
          month: 10,
          full_date: `${yearStr}-10-03`,
        },
      ],
      '11': [
        {
          name: 'Allerheiligen',
          day: 1,
          month: 11,
          full_date: `${yearStr}-11-01`,
        },
      ],
      '12': [
        {
          name: 'Heiligabend',
          day: 24,
          month: 12,
          full_date: `${yearStr}-12-24`,
        },
        {
          name: 'Erster Weihnachtstag',
          day: 25,
          month: 12,
          full_date: `${yearStr}-12-25`,
        },
        {
          name: 'Zweiter Weihnachtstag',
          day: 26,
          month: 12,
          full_date: `${yearStr}-12-26`,
        },
        {
          name: 'Silvester',
          day: 31,
          month: 12,
          full_date: `${yearStr}-12-31`,
        },
      ],
    };

    /*
     Weiberfastnacht: -52,
     Rosenmontag: -48,
     Fastnachtsdienstag: -47,
     Aschermittwoch: -46,
     Gründonnerstag: -3,
    */
    const tagesDifferenzen: Record<string, number> = {
      Karfreitag: -2,
      Karsamstag: -1,
      Ostersonntag: 0,
      Ostermontag: 1,
      'Christi Himmelfahrt': 39,
      Pfingstsonntag: 49,
      Pfingstmontag: 50,
      Fronleichnam: 60,
    };

    const ostern = PlanerDate.osterSonntag(year);

    for (const [name, differenz] of Object.entries(tagesDifferenzen)) {
      const osterDatum = new Date(
        ostern.getTime() + differenz * 24 * 60 * 60 * 1000
      );
      const feiertag = {
        name: name,
        day: osterDatum.getDate(),
        month: osterDatum.getMonth() + 1,
        full_date: osterDatum.toISOString().split('T')[0],
      };
      const monthKey = feiertag.month.toString();
      if (!PlanerDate.feiertage[yearStr][monthKey]) {
        PlanerDate.feiertage[yearStr][monthKey] = [];
      }
      PlanerDate.feiertage[yearStr][monthKey].push(feiertag);

      const now = new Date();
      await PlanerDate.prismaDb.feiertages.create({
        data: {
          name: feiertag.name,
          tag: feiertag.day,
          monat: feiertag.month,
          datum: feiertag.full_date,
          created_at: now,
          updated_at: now,
          jahr: osterDatum.getFullYear(),
        },
      });
    }
  }

  static osterSonntag(jahr: number): Date {
    const a = jahr % 19;
    const d = (19 * a + 24) % 30;
    let tag = d + ((2 * (jahr % 4) + 4 * (jahr % 7) + 6 * d + 5) % 7);
    if (tag === 35 || (tag === 34 && d === 28 && a > 10)) {
      tag -= 7;
    }
    const osterDatum = new Date(jahr, 2, 22); // 22.03.XXXX
    osterDatum.setDate(osterDatum.getDate() + tag);
    return osterDatum;
  }

  static async getFeiertag(date: Date) {
    const yearStr = date.getFullYear();
    const exist = await PlanerDate.prismaDb.feiertages.findFirst({
      where: {
        jahr: yearStr,
      },
    });

    if (!exist) {
      await PlanerDate.calcFeiertage(yearStr);
    }

    const feiertag = await PlanerDate.prismaDb.feiertages.findFirst({
      where: {
        datum: date,
      },
    });

    return feiertag || '';
  }

  private checkLastWeek() {
    const yearKey = this.year.toString();
    if (!PlanerDate.last_week[yearKey]) {
      PlanerDate.last_week[yearKey] = 52;
    }
    const lastDay = new Date(this.year, 11, 31);
    if (this.getWeekNumber(lastDay) === 53) {
      PlanerDate.last_week[yearKey] += 1;
    }
    this.last_week = PlanerDate.last_week[yearKey];
  }

  private addZeitraumkategorien(zeitraumkategorien: any[] = []) {
    zeitraumkategorien.forEach((zeitraumkategorie) => {
      if (checkDate(this, zeitraumkategorie)) {
        this.zeitraumkategorien.push(zeitraumkategorie.id);
      }
    });
  }

  private getWeekNumber(dirtyDate: Date) {
    const date = new Date(dirtyDate);
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return (
      1 +
      Math.round(
        ((date.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff =
      date.getTime() -
      start.getTime() +
      (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }
}

export default PlanerDate;
