import React from "react";
import { UseRegisterKey } from "../../../hooks/use-register";
import { iterateFirstDataElement } from "../../utils/composed-chart/helper";
import { nonBreakSpace } from "../../../tools/htmlentities";

function Table({ statistic }) {
  const data = statistic?.data;
  const chart = statistic?.chart;
  const brush = chart?.brush;
  UseRegisterKey("table", statistic?.push, statistic?.pull, statistic);

  const getStartAndEnd = () => ({
    start: brush?.startIndex || 0,
    end: brush?.endIndex
      || ((data?.length || 1) - 1)
  });

  const iterateData = (callback) => {
    const {
      start,
      end
    } = getStartAndEnd();
    for (let i = start; i <= end; i++) {
      const obj = data?.[i];
      if (obj) callback(obj, i);
    }
  };

  const getHead = () => {
    const cells = [<th key="default-head-cell">{nonBreakSpace}</th>];
    const key = brush?.dataKey || "name";
    iterateData((obj, i) => {
      if (obj[key]) {
        cells.push((
          <th key={`head-cell-${key}-${i}`}>
            <div className="statistic-table-names">
              <p>{obj[key]}</p>
            </div>
          </th>
        ));
      }
    });
    return <tr>{cells}</tr>;
  };

  const getBody = () => {
    const rows = [];
    const stackedIds = {};
    // Sammelt die StackedIds
    iterateFirstDataElement(data, (barData, key) => {
      const stackedId = chart?.dataSettings?.[key]?.stackedId;
      if (stackedId) {
        if (stackedIds[stackedId]) {
          stackedIds[stackedId].push(key);
        } else {
          stackedIds[stackedId] = [key];
        }
      }
    }, true);
    const unit = data?.[0]?.unit;
    // Erstellt die Zeilen für stacked Daten
    for (const key in stackedIds) {
      const dataKeys = stackedIds[key];
      if (dataKeys.length < 2) continue;
      const cells = [
        <th key={`default-stacked-body-cell-${key}`}>
          {`${key}${unit ? ` (${unit})` : ""}`}
        </th>
      ];
      iterateData((obj, i) => {
        const sum = dataKeys.reduce((total, dataKey) => total + obj[dataKey], 0);
        cells.push((
          <td key={`stacked-body-cell-${key}-${i}`}>
            {sum.toString()}
          </td>
        ));
      });
      rows.push(<tr key={`stacked-body-row-${key}`}>{cells}</tr>);
    }
    // Erstellt die Zeilen für jeden Daten-Key
    iterateFirstDataElement(data, (barData, key) => {
      const cells = [
        <th key={`default-body-cell-${key}`}>
          {`${key}${unit ? ` (${unit})` : ""}`}
        </th>
      ];
      iterateData((obj, i) => {
        cells.push((
          <td key={`body-cell-${key}-${i}`}>
            {obj[key].toString()}
          </td>
        ));
      });
      rows.push(<tr key={`body-row-${key}`}>{cells}</tr>);
    }, true);
    return rows;
  };

  if (!data) return null;
  return (
    <div className="dienstplan-statistic-table-table">
      <table>
        <tbody>{getBody()}</tbody>
        <tfoot>{getHead()}</tfoot>
      </table>
    </div>
  );
}

export default Table;
