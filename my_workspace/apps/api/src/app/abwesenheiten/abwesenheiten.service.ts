import { Injectable } from '@nestjs/common';

import { _addWeeks, _subWeeks, processData } from '@my-workspace/utils';
import {
  getAbwesenheitenSettings,
  getAbwesenheitenByYear,
  getAbwesenheitenCounters,
  getAllAbwesenheitenSpalten,
  getEinteilungenOhneBedarf
} from '@my-workspace/prisma_hains';

import { addCountsValue } from './helper';

@Injectable()
export class AbwesenheitenService {
  async getAbwesenheitsData(body) {
    const result = {};
    const all_column_keys = [];
    const settings = {};
    let awCounterPoDienst = {};

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
      awCounterPoDienst = addCountsValue(counters);

      result['settings'] = userSettingsAbwesenheiten;
      result['counters'] = counters;
      result['abwesentheiten'] = { [year]: awHash };
      result['aw_counter_po_dienst'] = awCounterPoDienst;
      result['awColumnNames'] = processData('db_key', awColumnNames);
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
    result['einteilungen'] = einteilungen;
    result['urlaubssaldi'] = {};

    return body;
  }
}
