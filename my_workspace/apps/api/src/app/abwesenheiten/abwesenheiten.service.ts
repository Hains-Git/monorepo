import { Injectable } from '@nestjs/common';

import { _addWeeks, _subWeeks, newDate, processData } from '@my-workspace/utils';
import {
  getAbwesenheitenSettings,
  getAbwesenheitenByYear,
  getAbwesenheitenCounters,
  getAllAbwesenheitenSpalten,
  getEinteilungenOhneBedarf,
  getKalenderMarkierungByDateRange
} from '@my-workspace/prisma_cruds';

import { addCountsValue, createDates } from './helper';

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
      const userSettingsAbwesenheiten = await getAbwesenheitenSettings(userId);
      const counters = await getAbwesenheitenCounters(userId);
      const awColumnNames = await getAllAbwesenheitenSpalten();
      const abwesentheiten = await getAbwesenheitenByYear(year);
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

    const einteilungen = await getEinteilungenOhneBedarf({ von: dateStart, bis: dateEnd });
    const dateRange: Date[] = [];
    const dateRangeDate = newDate(dateStart);
    const dates = {};
    while (dateRangeDate <= dateEnd) {
      const currentDate = newDate(dateRangeDate);
      dateRange.push(currentDate);
      await createDates({ day: currentDate, dates });
      dateRangeDate.setDate(currentDate.getDate() + 1);
    }

    const kalendermarkierungen = await getKalenderMarkierungByDateRange(dateStart, dateEnd);

    result['einteilungen'] = einteilungen;
    result['dates'] = dates;
    result['urlaubssaldi'] = {};
    result['kalendermarkierung'] = kalendermarkierungen;

    return result;
  }
}
