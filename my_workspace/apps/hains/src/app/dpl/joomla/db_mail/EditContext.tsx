/* eslint-disable no-template-curly-in-string */
import React, { useEffect } from 'react';
import { FaSave, FaTrash, FaUndo } from 'react-icons/fa';
import { TbMailSearch } from 'react-icons/tb';
import {
  MailerContext,
  MailerAddresse,
  MailerData,
  Context,
  defaultMailerContext
} from '../helper/mailer_context_types';
import { OAuthContext } from '../context/OAuthProvider';
import styles from './app.module.css';
import ContextOption from './ContextOption';
import ChooseAddresse from './ChooseAddresse';
import CustomButton from '../components/utils/custom-button/CustomButton';
import ChooseAddresseList from './ChooseAddresseList';
import { deepClone } from '../helper/util';
import { Reason } from '../helper/ts_types';

type PostData = {
  id: number;
  context: string;
  from_id: number;
  reply_to_id: number;
  to_ids: number[];
  cc_ids: number[];
  subject: string;
  body: string;
};

const getPostData = (formData: FormData): PostData => {
  const data: PostData = {
    id: 0,
    context: '',
    from_id: 0,
    reply_to_id: 0,
    to_ids: [],
    cc_ids: [],
    subject: '',
    body: ''
  };
  for (const key in data) {
    const arrKey = ['to_ids', 'cc_ids'].find((k) => k === key);
    const numberKey = ['id', 'from_id', 'reply_to_id'].find((k) => k === key);
    const value = arrKey ? formData.getAll(key) : formData.get(key);
    if (arrKey && Array.isArray(value)) {
      const idsKey = arrKey as 'to_ids' | 'cc_ids';
      data[idsKey] = value.map((v) => parseInt(v.toString(), 10));
    } else if (numberKey) {
      const nr_id = numberKey as 'id' | 'from_id' | 'reply_to_id';
      data[nr_id] = Number(value) || 0;
    } else {
      const str_key = key as 'subject' | 'body' | 'context';
      data[str_key] = value?.toString?.() || '';
    }
  }
  return data;
};

function EditContext({
  mailerContexts,
  mailerAddresses,
  contexts,
  id,
  setData
}: {
  mailerContexts: MailerContext[];
  mailerAddresses: MailerAddresse[];
  contexts: Context[];
  id: number;
  setData: (data: MailerData) => void;
}) {
  const { user, hainsOAuth, returnError } = React.useContext(OAuthContext);
  const [context, setContext] = React.useState<Context | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mailerContextId, setMailerContextId] = React.useState(0);
  const [mailerContext, setMailerContext] = React.useState<MailerContext>(
    deepClone(defaultMailerContext)
  );

  useEffect(() => {
    setContext(() => (contexts[id] ? deepClone(contexts[id]) : null));
    setMailerContextId(() => {
      const _mailerContext = mailerContexts.find(
        (mc) => mc.context === contexts[id].context
      );
      return _mailerContext ? _mailerContext.id : 0;
    });
    return () => {
      setContext(() => null);
      setMailerContextId(() => 0);
    };
  }, [contexts, mailerContexts, user, hainsOAuth, id]);

  useEffect(() => {
    if (context) {
      setMailerContext(() => {
        const _mailerContext = mailerContexts.find(
          (mc) => mc.context === context.context && mailerContextId === mc.id
        );
        return deepClone(_mailerContext || defaultMailerContext);
      });
    }
    return () => {
      setMailerContext(() => deepClone(defaultMailerContext));
    };
  }, [context, mailerContexts, mailerContextId]);

  const clearForm = () => {
    const form = document.querySelector('form');
    form && form.reset();
  };

  if (!user?.is_admin || !hainsOAuth) return <p>Keine Berechtigung</p>;
  if (!context) {
    return <p>Keine Mails in der Datenbank definiert vorhanden</p>;
  }
  if (!mailerAddresses.length) {
    return <p>Keine Mail Adressen vorhanden</p>;
  }

  return (
    <div className={styles.edit_context}>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          setIsLoading(() => true);
          const formData = new FormData(evt.currentTarget);
          const data = getPostData(formData);
          if (!data.context) {
            setIsLoading(() => false);
            alert('Kontext fehlt');
            return;
          }
          hainsOAuth.api('edit_mailer_context', 'post', data).then(
            (res: MailerData) => {
              setData(res);
              setContext((curr) => (curr ? deepClone(curr) : null));
              setIsLoading(() => false);
              clearForm();
            },
            (err: Reason) => {
              returnError(err);
              setIsLoading(() => false);
              clearForm();
            }
          );
        }}
      >
        <div>
          {context.options ? <ContextOption option={context.options} /> : null}
        </div>
        <div>
          <div>
            <p>Kontext: {context.context}</p>
            <input type="hidden" name="context" value={context.context} />
            <select
              onChange={(evt) =>
                setMailerContextId(() => parseInt(evt.target.value, 10))
              }
              name="id"
              value={mailerContextId}
            >
              {mailerContexts
                .filter((mc) => mc.context === context.context)
                .map((mc, i) => (
                  <option key={mc.id} value={mc.id}>
                    {mc.id ? i + 1 : '+'}
                  </option>
                ))}
            </select>
            <CustomButton
              type="submit"
              title="Änderungen speichern?"
              className="green"
              spinner={{ show: true, default: isLoading }}
            >
              <FaSave />
            </CustomButton>
            {mailerContext.id ? (
              <>
                <CustomButton
                  type="reset"
                  title="Änderungen verwerfen?"
                  clickHandler={(evt) => {
                    const ok = window.confirm(
                      'Soll die Änderungen verworfen werden?'
                    );
                    if (!ok) return;
                    setContext((curr) => (curr ? deepClone(curr) : null));
                  }}
                >
                  <FaUndo />
                </CustomButton>
                <CustomButton
                  type="button"
                  title="Mail Vorschau an deine E-Mail-Adresse senden?"
                  clickHandler={() => {
                    hainsOAuth.api('preview_mailer_context', 'get', {
                      id: mailerContext.id
                    });
                  }}
                >
                  <TbMailSearch />
                </CustomButton>
                <CustomButton
                  type="button"
                  title="Vorlage löschen?"
                  className="red"
                  clickHandler={(evt) => {
                    const ok = window.confirm(
                      'Soll die Vorlage gelöscht werden?'
                    );
                    if (!ok) return;
                    hainsOAuth
                      .api('delete_mailer_context', 'post', {
                        id: mailerContext.id
                      })
                      .then(
                        (data: MailerData) => {
                          setData(data);
                          setContext((curr) => (curr ? deepClone(curr) : null));
                          clearForm();
                        },
                        (err: Reason) => {
                          returnError(err);
                          clearForm();
                        }
                      );
                  }}
                >
                  <FaTrash />
                </CustomButton>
              </>
            ) : null}
          </div>
          <ChooseAddresse
            label="Absender"
            mailerAddresses={[...mailerAddresses]}
            id={mailerContext?.from_id || 0}
            name="from_id"
          />
          <ChooseAddresseList
            label="Empfänger"
            mailerAddresses={mailerAddresses}
            values={mailerContext.to || []}
            name="to_ids"
          />
          <ChooseAddresseList
            label="CC"
            mailerAddresses={mailerAddresses}
            values={mailerContext.cc || []}
            name="cc_ids"
          />
          <ChooseAddresse
            label="Antwort auf"
            mailerAddresses={[...mailerAddresses]}
            id={mailerContext?.reply_to_id || 0}
            name="reply_to_id"
          />
          <label>
            Betreff:
            <input
              type="text"
              name="subject"
              defaultValue={mailerContext?.subject || ''}
            />
          </label>
          <fieldset>
            <legend title="Mit $$Nr$$ können API Params übernommen werden. Mit $?Nr?${Text} wird der Text nur angezeigt, wenn das entsprechende API Params existiert. Mit $!Nr!${Text} wird der Text nur angezeigt, wenn das entsprechende API Params nicht existiert.">
              Nachricht:
            </legend>
            <textarea name="body" defaultValue={mailerContext?.body || ''} />
          </fieldset>
        </div>
      </form>
    </div>
  );
}

export default EditContext;
