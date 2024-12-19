import React from 'react';

function Rotation({ rotation, contingent, rotationsplan }) {
  // const rotationClass = rotation["collision"] ? "cct-rotation collision" : "cct-rotation";
  let rotationClass = '';
  switch (rotation.prioritaet) {
    case 1:
      rotationClass = 'first';
      break;
    case 2:
      rotationClass = 'second';
      break;
    case 3:
      rotationClass = 'third';
      break;
    case 4:
      rotationClass = 'fourth';
      break;
  }
  const title = `Mitarbeiter: ${rotation.mitarbeiter.planname} \n${rotation.vonDateString} - ${rotation.bisDateString}\n${rotation.kontingent.name}\nPrioritaet: ${rotation.prioritaet}`;

  return (
    <div
      className={`cct-rotation ${rotationClass}`}
      data-rotation={`${rotation.id}-${rotation.kontingent_id}-${rotation.mitarbeiter_id}`}
      data-rotationdate={`${rotation.von}:${rotation.bis}`}
      title={title}
      style={{
        left: `${rotation.left}px`,
        right: `${rotation.right}px`,
        top: `${rotation.top * 30 + 6}px`
      }}
    >
      <span className="cct-rotation">
        {rotationsplan.timeline.view === 'contingent'
          ? rotation.mitarbeiter.planname
          : rotation.kontingent.name}
      </span>
    </div>
  );
}

export default Rotation;
