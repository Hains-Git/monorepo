import type { ComponentPropsWithoutRef } from 'react';
import React, { useState } from 'react';
import styles from '../../../mitarbeiterinfo/app.module.css';

interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  label: string;
  preName?: string;
  cssClass?: string;
  dataVal?: string;
  title?: string;
}

function Textarea({
  label,
  preName = '',
  dataVal = '',
  cssClass = '',
  title = '',
  ...rest
}: TextareaProps) {
  const [value, setValue] = useState(rest?.value);

  const createInputName = () => {
    const labelTrimmed = label.toLowerCase().trim();
    const _name = labelTrimmed.split(' ').join('_');
    let inputName = _name;
    if (rest?.name) {
      inputName = rest?.name;
    }
    if (preName) {
      inputName = `${preName}[${_name}]`;
    }
    if (rest?.name && preName) {
      inputName = `${preName}[${rest.name}]`;
    }
    return inputName;
  };

  return (
    <fieldset className={`${styles[cssClass] || ''}`}>
      <label title={title}>
        <span>{label}</span>
        {rest?.required ? '*' : ''}
        <textarea
          {...rest}
          value={value || ''}
          onChange={(e) => setValue(e.target.value)}
          name={createInputName()}
        />
      </label>
    </fieldset>
  );
}
export default Textarea;
