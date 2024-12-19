import React from 'react';
import FormConflictListItem from './FormConflictListItem';

function FormConflict({ formConflict }) {
  const getConflicMsg = (tag) => {
    const result = [];
    formConflict.renderConflict(tag, (message) => {
      if (result.length) result.push(' ');
      result.push(
        <FormConflictListItem
          className={message.className}
          message={message}
          key={`${tag}-${message.typ}`}
        />
      );
    });
    formConflict.conflicts[tag].wuensche.msg.forEach((msg) => {
      if (result.length) result.push(' ');
      result.push(
        <FormConflictListItem
          message={msg}
          className={formConflict.conflicts[tag].wuensche.labelClasses}
          key={`${tag}-${msg.typ}`}
        />
      );
    });
    return result;
  };

  return (
    <div className="conflict-messages">
      <p>
        <strong>Konflikte:</strong>
      </p>
      {Object.keys(formConflict.conflicts)?.map((tag) => {
        return (
          <div key={tag} className={formConflict.conflicts[tag].className}>
            {formConflict.conflicts[tag]?.className?.length ? (
              <p>
                {`${tag}: `}
                {getConflicMsg(tag)}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
export default FormConflict;
