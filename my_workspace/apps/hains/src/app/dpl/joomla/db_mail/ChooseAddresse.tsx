import React, { useEffect } from 'react';
import {
  defaultAddresse,
  MailerAddresse
} from '../helper/mailer_context_types';
import { nonBreakSpace } from '../../src/tools/htmlentities';
import { deepClone } from '../helper/util';
import { UseMounted } from '../hooks/use-mounted';

function ChooseAddresse({
  label,
  name,
  mailerAddresses,
  onChange,
  id
}: {
  label: string;
  name: string;
  mailerAddresses: MailerAddresse[];
  onChange?: (value: number) => MailerAddresse;
  id?: number;
}) {
  const [selected, setSelected] = React.useState<MailerAddresse | null>(
    deepClone(defaultAddresse)
  );
  const mounted = UseMounted();

  const findById = (_id: number) => {
    const found = mailerAddresses.find((ma) => ma.id === _id);
    return found || deepClone(defaultAddresse);
  };

  useEffect(() => {
    mounted && setSelected(() => findById(id || 0));
    return () => {
      setSelected(() => deepClone(defaultAddresse));
    };
  }, [mounted, mailerAddresses, label, name, id]);

  return (
    <label>
      {label}
      {label ? ':' : ''}
      <select
        name={name}
        onChange={(evt) => {
          if (!mounted) return;
          const _id = parseInt(evt.target.value, 10);
          const found = onChange ? onChange(_id) : findById(_id);
          setSelected(() => found || deepClone(defaultAddresse));
        }}
        value={selected?.id || 0}
      >
        <option value="0">{nonBreakSpace}</option>
        {mailerAddresses.map((ma) => (
          <option key={ma.id} title={ma.addresse} value={ma.id}>
            {ma.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ChooseAddresse;
