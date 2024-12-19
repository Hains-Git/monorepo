import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { getChart } from './chart';
import { bsColors } from '../../../styles/basic';

function CustomComposedChart({ responsiveContainer, chart, data, id }) {
  const getLegend = () => {
    const result = [];
    if (!chart?.dataSettings) return result;
    for (const key in chart.dataSettings) {
      if (!chart.dataSettings[key]?.filterHandler) continue;
      result.push(
        <label
          key={key}
          htmlFor={`${id}-${key}`}
          className="statistc-legend-label"
        >
          <input
            id={`${id}-${key}`}
            type="checkbox"
            checked={!chart.dataSettings[key].filter}
            onChange={chart.dataSettings[key]?.filterHandler}
          />
          <span
            className="span-point"
            style={{
              backgroundColor: chart.dataSettings[key].fill || bsColors.primary
            }}
          />
          {chart.dataSettings[key].label}
        </label>
      );
    }

    return result;
  };

  return (
    <>
      <div className="custom-composed-chart-legend">{getLegend()}</div>
      <ResponsiveContainer
        width={responsiveContainer.width || 400}
        height={responsiveContainer.height || 300}
        debounce={responsiveContainer.debounce || 200}
      >
        {getChart(chart, data, id)}
      </ResponsiveContainer>
    </>
  );
}

export default CustomComposedChart;
