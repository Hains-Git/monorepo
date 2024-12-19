import React, {
} from 'react';

import SelectGrid from './SelectGrid'

const TableCol = ({
  rowIx, 
  colIx,
  tdName,
  options,
  onChangeSelect,
  setTableCoordinates,
  setShowTablePopup,
  setSettingsBtn,
}) => {

  function getBackgroundColor(){
    let color = '#ffffff';
    options.find(item => {
      const hasColor = item.colors[tdName];
      if(hasColor) {
        color = hasColor;
        return true;
      }
      return false
    });
    return color;
  }

  return(
    <td style={{backgroundColor: getBackgroundColor()}}>
      <SelectGrid 
        options={options} 
        rowIx={rowIx} 
        colIx={colIx} 
        onChangeSelect={onChangeSelect}
        setTableCoordinates={setTableCoordinates}
        setShowTablePopup={setShowTablePopup}
        selectedVal={tdName} 
        setSettingsBtn={setSettingsBtn}
      />
    </td>
  )
}
export default TableCol;
