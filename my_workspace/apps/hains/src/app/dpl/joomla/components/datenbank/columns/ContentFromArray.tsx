import React from 'react';
import { getNestedAttr } from '../../../helper/util';

function ContentFromArray({
  elKey,
  arr,
  titleKey = '',
  callback = undefined,
  sort = undefined
}: {
  elKey: string;
  titleKey: string;
  arr: any[];
  callback?: (el: any, index: number) => string | React.JSX.Element;
  sort?: (a: any, b: any) => number;
}) {
  if (!Array.isArray(arr)) return '';
  if (sort) arr.sort(sort);
  return (
    <div>
      {arr.map((el, index) => (
        <p key={index} title={getNestedAttr(el, titleKey) || ''}>
          {getNestedAttr(el, elKey)}
          {callback ? callback(el, index) : ''}
        </p>
      ))}
    </div>
  );
}

export default ContentFromArray;
