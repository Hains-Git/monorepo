import React, { useState } from "react";
import { UseRegister } from "../../../../hooks/use-register";
import Add from "./auswahl/Add";
import List from "./auswahl/List";
import FeldName from "./auswahl/FeldName";

function CustomFeldAuswahl({ customFelder }) {
  const update = UseRegister(
    customFelder?._push,
    customFelder?._pull,
    customFelder
  );
  const [show, setShow] = useState(0);

  if (!customFelder) return null;
  return (
    <div className="table-custom-feld-auswahl">
      <FeldName
        customFelder={customFelder}
        update={update}
      />
      <Add
        customFelder={customFelder}
        update={update}
        setShowParent={setShow}
        showParent={show}
      />
      <List
        customFelder={customFelder}
        update={update}
        setShowParent={setShow}
        showParent={show}
      />
    </div>
  );
}

export default CustomFeldAuswahl;
