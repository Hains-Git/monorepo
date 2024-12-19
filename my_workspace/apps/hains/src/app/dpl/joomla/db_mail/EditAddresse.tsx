import React, { useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import {
  MailerAddresse,
  MailerData,
  defaultAddresse
} from '../helper/mailer_context_types';
import CustomButton from '../components/utils/custom-button/CustomButton';
import { OAuthContext } from '../context/OAuthProvider';
import { deepClone, numericLocaleCompare } from '../helper/util';
import styles from './app.module.css';

function EditAddresse({
  mailerAddresses,
  setData
}: {
  mailerAddresses: MailerAddresse[];
  setData: (data: MailerData) => void;
}) {
  const { user, hainsOAuth, returnError } = React.useContext(OAuthContext);
  const [selectedAddresss, setSelectedAddresss] =
    React.useState<MailerAddresse>(deepClone(defaultAddresse));

  useEffect(() => {
    return () => {
      setSelectedAddresss(() => deepClone(defaultAddresse));
    };
  }, [mailerAddresses, user, hainsOAuth]);

  if (!user?.is_admin || !hainsOAuth) return null;
  return (
    <div className={styles.edit_addresse}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          const formData = new FormData(evt.currentTarget);
          const data = {
            id: parseInt(formData.get('id') as string, 10),
            name: formData.get('name') as string,
            addresse: formData.get('addresse') as string
          };
          hainsOAuth
            .api('edit_mailer_addresse', 'post', data)
            .then((res: MailerData) => {
              setData(res);
              setSelectedAddresss(() => deepClone(defaultAddresse));
            }, returnError);
        }}
      >
        <label>
          Wähle eine Mail-Adresse zum Bearbeiten
          <select
            name="id"
            onChange={(evt) =>
              setSelectedAddresss(() => {
                const id = parseInt(evt.target.value, 10);
                const mailerAddresse = mailerAddresses.find(
                  (address) => address.id === id
                );
                return deepClone(mailerAddresse || defaultAddresse);
              })
            }
            value={selectedAddresss?.id || 0}
          >
            <option value="0">Neu</option>
            {mailerAddresses
              .sort((a, b) => numericLocaleCompare(a.name, b.name))
              .map((address) => (
                <option
                  key={address.id}
                  title={address.addresse}
                  value={address.id}
                >
                  {address.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Name
          <input
            type="text"
            required
            name="name"
            onChange={(evt) => {
              setSelectedAddresss((prev) => {
                return { ...prev, name: evt.target.value };
              });
            }}
            value={selectedAddresss?.name || ''}
          />
        </label>
        <label>
          Addresse
          <input
            type="email"
            required
            onChange={(evt) => {
              setSelectedAddresss((prev) => {
                return { ...prev, addresse: evt.target.value };
              });
            }}
            name="addresse"
            value={selectedAddresss?.addresse || ''}
          />
        </label>
        <CustomButton type="submit">
          <FaSave />
        </CustomButton>
      </form>
    </div>
  );
}

export default EditAddresse;
