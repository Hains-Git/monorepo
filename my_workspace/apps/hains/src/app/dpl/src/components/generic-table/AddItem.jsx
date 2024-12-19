import React, { useState } from 'react';

function AddItem({ child, clicked }) {
  if (child.type === 'checkbox') {
    return (
      <input
        type="checkbox"
        className={child.className}
        name={child.name}
        onChange={(e) => {
          clicked(e, child);
        }}
      />
    );
  }
  if (child.type === 'btn') {
    return (
      <button
        type="button"
        onClick={(e) => clicked(e, child)}
      >
        {child.icon}
      </button>
    );
  }
  return null;
}

export default AddItem;
