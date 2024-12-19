import React from 'react';
import { Bar, ComposedChart, Rectangle, Scatter } from 'recharts';
import {
  getBrush,
  getGraphAxisInfo,
  getHorizontalAndVerticalReferenceLines,
  iterateFirstDataElement
} from './helper';
import { bsColors } from '../../../styles/basic';
import { shortwait, throttle } from '../../../tools/debounce';

const RenderScatter = (props) => {
  const { cx, cy, fill, xAxis } = props;
  const width = xAxis.bandSize;
  return (
    <Rectangle
      x={cx - width / 2}
      y={cy}
      fill={fill}
      width={xAxis.bandSize}
      height={1}
    />
  );
};

const getValues = (data, chart) => {
  const values = [];
  iterateFirstDataElement(
    data,
    (barData, key) => {
      const settings = chart?.dataSettings?.[key];
      if (settings?.filter) return false;
      switch (settings?.type) {
        case 'bar':
          values.push(
            <Bar
              key={key}
              dataKey={key}
              stackId={settings?.stackedId || key}
              fill={settings?.fill || bsColors.primary}
            />
          );
          break;
        case 'scatter':
          values.push(
            <Scatter
              key={key}
              fill={settings?.fill || bsColors.primary}
              shape={<RenderScatter />}
            />
          );
          break;
      }
    },
    true
  );

  return values;
};

export const getChart = (chart, data, id) => {
  const endIndex = (data?.length || 1) - 1;
  const throttledOnClick = chart?.onClick
    ? throttle(chart.onClick, shortwait)
    : null;
  return (
    <ComposedChart
      data={data}
      margin={
        chart?.margin || {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }
      }
      layout={chart?.layout || 'horizontal'}
      onClick={throttledOnClick}
      barCategoryGap={chart?.barCategoryGap || '5%'}
      barGap={chart?.barGap || '2%'}
    >
      {getGraphAxisInfo(chart)}
      {getValues(data, chart)}
      {getBrush(chart?.brush, endIndex)}
      {getHorizontalAndVerticalReferenceLines(chart?.referenceLines)}
    </ComposedChart>
  );
};
