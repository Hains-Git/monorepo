import React from 'react';

import Input from './form/Input';
import Select from './form/Select';
import { DataContext } from '../../context/mitarbeiterinfo/DataProvider';

import { TMerkmal, TMitarbeiterMerkmal } from '../../helper/api_data_types';

type TProps = {
  merkmal: TMerkmal;
  mitarbeiterMerkmal: TMitarbeiterMerkmal | undefined;
};

function getRadioFieldbox(merkmal: TMerkmal, mitarbeiterMerkmal: TMitarbeiterMerkmal | undefined) {
  const mMerkmal = mitarbeiterMerkmal?.[merkmal.id];

  return (
    <fieldset>
      <legend>{merkmal?.name}</legend>
      <div>
        {merkmal?.merkmal_options?.map((opt: any, index: number) => (
          <Input
            key={`${opt.wert}-${index}`}
            label={opt?.wert}
            name={`merkmal[${merkmal?.id}]`}
            type="radio"
            value={opt?.wert}
            isChecked={mMerkmal?.wert === opt?.wert}
          />
        ))}
      </div>
    </fieldset>
  );
}

function getRadioFieldboxWithText(merkmal: TMerkmal, mitarbeiterMerkmal: TMitarbeiterMerkmal | undefined) {
  const mMerkmal = mitarbeiterMerkmal?.[merkmal.id];
  return (
    <fieldset>
      <legend>{merkmal?.name}</legend>
      <div>
        {merkmal?.merkmal_options?.map((opt: any, index: number) => (
          <Input
            key={`${opt.wert}-${index}`}
            label={opt?.wert}
            name={`merkmal[${merkmal?.id}]`}
            type="radio"
            value={opt?.wert}
            isChecked={mMerkmal?.wert === opt?.wert}
          />
        ))}
      </div>
      <Input label="" value={mMerkmal?.freitext || ''} name={`merkmal_freitext[${merkmal?.id}]`} />
    </fieldset>
  );
}

function getField(merkmal: TProps['merkmal'], mitarbeiterMerkmal: TProps['mitarbeiterMerkmal']) {
  let field = null;

  const mMerkmal = mitarbeiterMerkmal?.[merkmal.id];
  const isChecked = mMerkmal?.wert === merkmal?.name;

  if (merkmal?.typ === 'checkbox') {
    field = (
      <Input
        label={merkmal?.name}
        name={`merkmal[${merkmal?.id}]`}
        value={merkmal?.name}
        type="checkbox"
        showHidden
        isChecked={isChecked}
      />
    );
  }
  if (merkmal?.typ === 'textbox') {
    field = (
      <div>
        <legend>{merkmal?.name}</legend>
        <Input label="" value={mMerkmal?.wert || ''} name={`merkmal[${merkmal?.id}]`} />
      </div>
    );
  }
  if (merkmal?.typ === 'selectbox') {
    field = (
      <div>
        <legend>{merkmal?.name}</legend>
        <Select
          label=""
          data={merkmal?.merkmal_options}
          keyExtractor="wert"
          optionText="wert"
          name={`merkmal[${merkmal?.id}]`}
          value={mMerkmal?.wert}
        />
      </div>
    );
  }
  if (merkmal?.typ === 'selectbox_with_text') {
    field = (
      <div>
        <legend>{merkmal?.name}</legend>
        <div>
          <Select
            label=""
            data={merkmal?.merkmal_options}
            keyExtractor="wert"
            optionText="wert"
            name={`merkmal[${merkmal?.id}]`}
            value={mMerkmal?.wert}
          />
          <Input
            label=""
            placeholder="Zusatztext"
            value={mMerkmal?.freitext || ''}
            name={`merkmal_freitext[${merkmal?.id}]`}
          />
        </div>
      </div>
    );
  }

  if (merkmal?.typ === 'radiobox') {
    field = getRadioFieldbox(merkmal, mitarbeiterMerkmal);
  }
  if (merkmal?.typ === 'radiobox_with_text') {
    field = getRadioFieldboxWithText(merkmal, mitarbeiterMerkmal);
  }
  return field;
}

function MerkmalItem({ merkmal, mitarbeiterMerkmal }: TProps) {
  const { user } = React.useContext(DataContext);
  if (!user?.is_admin || !user?.is_verwaltung) {
    return <p>No Access</p>;
  }
  return getField(merkmal, mitarbeiterMerkmal);
}
export default MerkmalItem;
