import React from 'react';
import Popup from '../popup/Popup';
import Tab from '../tab/Tab';

function Info({ parent = false }) {
  return parent ? (
    <Tab button={false} parent={parent}>
      <Popup parent={parent} />
    </Tab>
  ) : null;
}

export default Info;
