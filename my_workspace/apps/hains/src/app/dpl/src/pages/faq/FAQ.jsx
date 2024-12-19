import React, { useState } from 'react';
import Panel from '../../components/utils/panel/Panel';
import Spinner from '../../components/utils/spinner/Spinner';
import { debounce, wait } from '../../tools/debounce';
import FAQElement from './FAQElement';
import { FAQS } from './FAQs';
import styles from './faq.module.css';

const FAQs = FAQS();

function FAQ({ user, appModel }) {
  const [faqsList, setFaqsList] = useState(FAQs);
  const [value, setValue] = useState('');
  const loader = (text) => <Spinner showText text={text} />;

  const filterFAQS = debounce((value) => {
    const thisValue = value.toLowerCase().trim();
    setFaqsList(() =>
      thisValue === ''
        ? FAQs
        : FAQs.filter(
            ({ question, answer }) =>
              question.toLowerCase().includes(thisValue) ||
              answer.toLowerCase().includes(thisValue)
          )
    );
  }, wait);

  return (
    <Panel>
      {user && appModel ? (
        <div className={styles.faq_container}>
          <div className={styles.faq_head}>
            <div className={styles.faq_mail}>
              <p className={styles.faq_mail_hinweis}>
                Die Antworten auf die Fragen sind nur Anhaltspunkte, um
                Fehlerursachen ggf. selbst beseitigen zu können. Es besteht
                immer die Möglichkeit, dass sich bei der Weiterentwicklung der
                Software Fehler einschleichen, welche erst im Betrieb der
                Software auffallen und dann nachträglich korrigiert werden
                müssen.
              </p>
              <p className={styles.faq_mail_main}>
                Gerne kannst du dich bei unbeantworteten Fragen, Fehlerhinweisen
                oder Vorschlägen für wichtige Funktionen beim HAINS-Team melden:
              </p>
              <a href="mailto:hains.anae@med.uni-heidelberg.de">
                HAINS.ANAE@med.uni-heidelberg.de
              </a>
            </div>
            <div className={styles.faq_search}>
              <input
                onChange={(evt) => {
                  evt.stopPropagation();
                  const newValue = evt.target.value;
                  setValue(() => newValue);
                  filterFAQS(newValue);
                }}
                title="Dursuche das FAQ nach bestimmten Schlüsselworten"
                placeholder="Suche"
                value={value}
              />
            </div>
          </div>
          <div className={styles.faq_list}>
            {faqsList.map((f, i) => (
              <FAQElement faq={f} key={`${f.id}_${i}`} />
            ))}
          </div>
        </div>
      ) : (
        loader('Daten werden geladen...')
      )}
    </Panel>
  );
}

export default FAQ;
