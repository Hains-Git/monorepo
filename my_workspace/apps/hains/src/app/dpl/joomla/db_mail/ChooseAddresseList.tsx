import React, { useEffect } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa';
import ChooseAddresse from './ChooseAddresse';
import {
  defaultAddresse,
  MailerAddresse
} from '../helper/mailer_context_types';
import CustomButton from '../components/utils/custom-button/CustomButton';
import { numericLocaleCompare } from '../helper/util';
import styles from './app.module.css';
import { UseMounted } from '../hooks/use-mounted';

function ChooseAddresseList({
  label,
  name,
  mailerAddresses,
  values
}: {
  label: string;
  name: string;
  mailerAddresses: MailerAddresse[];
  values: MailerAddresse[];
}) {
  const [selected, setSelected] = React.useState<MailerAddresse[]>([]);
  const mounted = UseMounted();

  useEffect(() => {
    mounted &&
      setSelected(() =>
        values.sort((a, b) => numericLocaleCompare(a.name, b.name))
      );
    return () => {
      setSelected(() => []);
    };
  }, [mounted, values, mailerAddresses, label, name]);

  return (
    <div className={styles.choose_addresse_list}>
      <p>{label}:</p>
      <div>
        {selected.map((s, i) => (
          <ChooseAddresse
            key={i}
            label=""
            name={name}
            mailerAddresses={mailerAddresses}
            id={s.id}
            onChange={(value: number) => {
              if (!mounted) return defaultAddresse;
              const found = mailerAddresses.find((ma) => ma.id === value);
              setSelected((prev) => {
                const newSelected = [...prev];
                newSelected[i] = found || defaultAddresse;
                return newSelected;
              });
              return found || defaultAddresse;
            }}
          />
        ))}
        <CustomButton
          type="button"
          clickHandler={() => {
            setSelected((prev) => [...prev, defaultAddresse]);
          }}
        >
          <FaPlus />
        </CustomButton>
        <CustomButton
          type="button"
          clickHandler={() => {
            setSelected((prev) => prev.slice(0, prev.length - 1));
          }}
        >
          <FaMinus />
        </CustomButton>
      </div>
    </div>
  );
}

export default ChooseAddresseList;
