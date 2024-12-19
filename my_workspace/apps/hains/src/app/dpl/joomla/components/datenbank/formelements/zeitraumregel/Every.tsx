import React from 'react';

function Every({
  checked,
  toggleChecked,
  label,
  children
}: {
  checked: boolean;
  toggleChecked: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label aria-label={label}>
        <input type="checkbox" checked={checked} onChange={toggleChecked} />
        {label}
      </label>
      {children}
    </div>
  );
}

export default Every;
