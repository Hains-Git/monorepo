import React from "react";
import {
  Brush,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { bsColors } from "../../../styles/basic";
import { isNumber } from "../../../tools/types";

export const iterateFirstDataElement = (data, callback, ignoreNotNumbers = true) => {
  const firstElement = data?.[0];
  if (firstElement) {
    for (const key in firstElement) {
      const barData = firstElement[key];
      if (ignoreNotNumbers && !isNumber(barData)) continue;
      callback(barData, key);
    }
  }
};

export const getGraphAxisInfo = (chart) => {
  const tooltip = chart?.tooltip;
  const xAxis = chart?.xAxis;
  const yAxis = chart?.yAxis;
  return (
    <>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey={xAxis?.axisKey || false}
        tick={xAxis?.tick || false}
        tickCount={xAxis?.tickCount || 10}
        label={xAxis?.label || false}
        type={xAxis?.type || "number"}
        hide={!!xAxis?.hide}
        minTickGap={xAxis?.minTickGap || 0}
        allowDecimals={xAxis?.allowDecimals}
      />
      <YAxis
        dataKey={yAxis?.axisKey || false}
        tick={yAxis?.tick || false}
        tickCount={yAxis?.tickCount || 10}
        label={yAxis?.label || false}
        type={yAxis?.type || "number"}
        hide={!!yAxis?.hide}
        minTickGap={yAxis?.minTickGap || 0}
        allowDecimals={yAxis?.allowDecimals}
      />
      {tooltip ? <Tooltip content={tooltip} /> : <Tooltip />}
    </>
  );
};

export const getBrush = (brush, endIndex = 0) => brush && (
  <Brush
    dataKey={brush?.dataKey || "name"}
    height={brush?.height || 30}
    startIndex={brush?.startIndex || 0}
    endIndex={brush?.endIndex || endIndex}
    travellerWidth={brush?.travellerWidth || 15}
    stroke={brush?.stroke || bsColors.primary}
    y={brush?.y || 450}
    onChange={(index) => { brush?.updateIndex && brush?.updateIndex(index); }}
  />
);

export const getHorizontalAndVerticalReferenceLines = (referenceLines) => referenceLines?.map
    && referenceLines.map((line, i) => (line?.filter
      ? null
      : (
        <ReferenceLine
          key={`reference-line-${i}`}
          x={line?.x}
          y={line?.y}
          isFront={!!line?.isFront}
          stroke={line?.stroke || "red"}
          strokeWidth={line?.strokeWidth || 1}
          label={line?.label || ""}
        />
      )));
