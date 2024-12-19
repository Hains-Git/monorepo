import React from 'react';
import styles from './faq.module.css';

function FAQElement({ faq }) {
  return (
    <div className={styles.faq_element}>
      <p className={styles.faq_question}>{`Frage: ${faq.question}`}</p>
      <div className={styles.faq_answer}>
        <p>Antwort:</p>
        {faq.answer.split('\n').map((el, i) => (
          <p key={`list_${faq.id}_${i}`}>{el}</p>
        ))}
      </div>
    </div>
  );
}

export default FAQElement;
