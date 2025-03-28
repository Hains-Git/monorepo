import { Injectable } from '@nestjs/common';

import { _addWeeks, _subWeeks, newDate, processData } from '@my-workspace/utils';
import { _abwesenheiten, _diensteinteilung, _kalender_markierung } from '@my-workspace/prisma_cruds';

import { addCountsValue, createDates } from './helper';
import { Urlaubssaldi } from '@my-workspace/models';

@Injectable()
export class AbwesenheitenService {
  async getAbwesenheitsData(body) {
    const result = {};

    const dateView = `${body.date_view}T12:00:00.000Z`;
    const leftSideDate = `${body.left_side_date}T12:00:00.000Z`;
    const year = newDate(leftSideDate).getFullYear();
    const init = body.init;
    const direction = body.direction;
    const userId = body.user_id;

    let dateStart = _subWeeks(dateView, 2);
    let dateEnd = _addWeeks(dateView, 10);

    if (init) {
      const userSettingsAbwesenheiten = await _abwesenheiten.getAbwesenheitenSettings(userId);
      const counters = await _abwesenheiten.getAbwesenheitenCounters(userId);
      const awColumnNames = await _abwesenheiten.getAllAbwesenheitenSpalten();
      const abwesentheiten = await _abwesenheiten.getAbwesenheitenByYear(year);
      const awHash = processData('mitarbeiter_id', abwesentheiten);
      const awCounterPoDienst = await addCountsValue(counters);

      result['settings'] = userSettingsAbwesenheiten;
      result['counters'] = processData('id', counters);
      result['abwesentheiten'] = { [year]: awHash };
      result['aw_counter_po_dienst'] = awCounterPoDienst;
      result['aw_column_names'] = processData('db_key', awColumnNames);
    } else {
      if (direction === 'past') {
        dateStart = _subWeeks(dateView, 6);
        dateEnd = newDate(dateView);
      } else {
        dateStart = newDate(dateView);
        dateEnd = _addWeeks(dateView, 6);
      }
    }

    const einteilungen = await _diensteinteilung.getEinteilungenOhneBedarf({
      von: dateStart,
      bis: dateEnd
    });
    const dateRange: Date[] = [];
    const dateRangeDate = newDate(dateStart);
    const dates = {};
    console.time('while');
    while (dateRangeDate <= dateEnd) {
      const currentDate = newDate(dateRangeDate);
      dateRange.push(currentDate);
      await createDates({ day: currentDate, dates });
      dateRangeDate.setDate(currentDate.getDate() + 1);
    }
    console.timeEnd('while');

    const kalendermarkierungen = await _kalender_markierung.getKalenderMarkierungByDateRange(
      dateStart,
      dateEnd
    );

    result['einteilungen'] = einteilungen;
    result['dates'] = dates;
    result['urlaubssaldi'] = {};
    result['kalendermarkierung'] = kalendermarkierungen;

    return result;
  }

  async getSaldi(body: { start: string; ende: string }) {
    const start = newDate(body.start);
    const ende = newDate(body.ende);
    const result = await Urlaubssaldi.getSaldi(start, ende);
    return result;
  }
}
