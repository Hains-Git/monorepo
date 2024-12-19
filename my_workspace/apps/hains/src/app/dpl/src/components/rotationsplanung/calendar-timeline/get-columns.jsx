import React from 'react';

import Column from './column/column';

const GetColumns = ({
  rotationsplan, year = false, text = false
}) => Object.values(rotationsplan.timeline.years).map(
  (yearObj) => Object.values(yearObj.months).map((month) => (month.visible
    ? (
      <Column
        rotationsplan={rotationsplan}
        key={month.key}
        columnKey={month.columnKey}
        columnIndex={month.columnIndex}
        columnWidth={month.columnWidth}
        text={text ? month.displayMonth : text}
        year={year ? yearObj.year : year}
      >

        <div className="month-days" style={{ display: month.displayDays.visible ? 'flex' : 'none' }}>
          {
        month.displayDays.visible && Object.values(month.displayDays.days).map((day) => (
          <Column
            rotationsplan={rotationsplan}
            key={day.key}
            columnKey={day.columnKey}
            columnIndex={day.columnIndex}
            columnWidth={day.columnWidth}
            text={text ? day.dayNum : text}
            spanClass="day"
          />
        ))
      }
        </div>
      </Column>
    ) : null))
);

export default GetColumns;
