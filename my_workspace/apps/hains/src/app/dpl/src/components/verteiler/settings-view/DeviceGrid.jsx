import React, {
  useState,
  useEffect
} from 'react';


const DeviceGrid = ({name, setGrid, gridVal}) => {
  const [rows, setRows] = useState(gridVal.rows || 0);
  const [cols, setCols] = useState(gridVal.cols || 0);

  const changeRows = (length) => {
    const grid = {}
    for(let i = 0; i < length; i++) {
      grid[i] = gridVal.hasOwnProperty("grid") ?
        gridVal.grid[i] || '. '.repeat(cols).trim() : 
        '. '.repeat(cols).trim();
    }
    return grid;
  }

  const changeCols = (length, gridItem) => {
    const strArr = gridItem.split(" ");
    const newCols = []
    for(let i = 0; i < length; i++) {
      const col = strArr[i] || '.'
      newCols.push(col);
    }
    return newCols.join(" ")
  }

  const onChangeRow = evt => {
    const val = Number(evt.target.value);
    setRows(() => val);
    const newGridItems = changeRows(val);
    const newGridTemplate = {
      ...gridVal,
      rows: val,
      grid : newGridItems
    }
    setGrid(() => newGridTemplate);
  }

  const onChangeCol = evt => {
    const val = Number(evt.target.value);
    setCols(() => val);
    const newGridItems = {}
    const obj = gridVal.hasOwnProperty("grid") ? gridVal.grid : {};
    Object.keys(obj).forEach(key => {
      const newCols = changeCols(val, gridVal.grid[key])
      newGridItems[key] = newCols;
    });
    const newGridTemplate = {
      ...gridVal,
      cols: val,
      grid : newGridItems
    }
    setGrid(() => newGridTemplate);
  }

  return(
    <div className={`device-${name.toLowerCase()}`}>
      <p>{name}</p>
      <fieldset className='group'>
        <fieldset>
          <label>Zeilen:</label>
          <input 
            type='number' 
            value={rows} 
            name='row' 
            className='row' 
            min='0'
            onChange={onChangeRow}
          />
        </fieldset>
        <fieldset>
          <label>Spalten:</label>
          <input 
            type='number' 
            value={cols} 
            name='col' 
            className='col' 
            min='0'
            onChange={onChangeCol}
          />
        </fieldset>
      </fieldset>
    </div>
  )
}
export default DeviceGrid;
