import { Injectable } from '@nestjs/common';

import { _addWeeks, _subWeeks, processData } from '@my-workspace/utils';
import {
  getAbwesenheitenSettings,
  getAbwesenheitenByYear,
  getAbwesenheitenCounters,
  getAllAbwesenheitenSpalten,
  getEinteilungenOhneBedarf,
  getKalenderMarkierungByDateRange
} from '@my-workspace/prisma_hains';

import { addCountsValue, createDates } from './helper';
import { eachDayOfInterval } from 'date-fns';

@Injectable()
export class AbwesenheitenService {
  async getAbwesenheitsData(body) {
    const result = {};

    const dateView = body.date_view;
    const leftSideDate = body.left_side_date;
    const year = new Date(leftSideDate).getFullYear();
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
        dateEnd = new Date(dateView);
      } else {
        dateStart = new Date(dateView);
        dateEnd = _addWeeks(dateView, 6);
      }
    }

    const einteilungen = await getEinteilungenOhneBedarf({ von: dateStart, bis: dateEnd });
    const dateRange = eachDayOfInterval({ start: dateStart, end: dateEnd });

    const dates = {};

    dateRange.forEach((day) => {
      createDates({ day, dates });
    });

    const kalendermarkierungen = await getKalenderMarkierungByDateRange(dateStart, dateEnd);

    result['einteilungen'] = einteilungen;
    result['dates'] = dates;
    result['urlaubssaldi'] = {};
    result['kalendermarkierung'] = kalendermarkierungen;

    return result;
  }
}
