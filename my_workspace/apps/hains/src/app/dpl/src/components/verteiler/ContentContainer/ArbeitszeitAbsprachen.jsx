import React from 'react';

function ArbeitszeitAbsprachen({ employee, tag, className = '' }) {
  const arbeitszeitAbsprachen = employee?.eachArbeitszeitAbspracheAm?.(
    tag,
    (absprache) => {
      return <p key={`absprachen-${absprache.id}`}>{absprache.title}</p>;
    }
  );

  if (!arbeitszeitAbsprachen?.length) return null;
  return (
    <div className={`arbeitszeit-absprachen-container ${className}`}>
      {arbeitszeitAbsprachen}
    </div>
  );
}

export default ArbeitszeitAbsprachen;
