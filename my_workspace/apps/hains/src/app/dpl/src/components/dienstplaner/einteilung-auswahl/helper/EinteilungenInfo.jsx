import React from 'react';
import Counter from './Counter';

function EinteilungenInfos({ einteilungen }) {
  const getCounter = () => {
    const arr = [];
    for (const key in einteilungen) {
      if (einteilungen[key]?.ignoreInCounter) continue;
      arr.push(<Counter el={einteilungen[key]} key={`counter_${key}`} />);
    }

    return arr.sort((a, b) => a - b);
  };

  if (!einteilungen) return null;
  return getCounter();
}

export default EinteilungenInfos;
