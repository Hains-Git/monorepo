import React from 'react';

import { useHistory } from 'react-router-dom';
import styles from './generic-table.module.css';
import AddItem from './AddItem';

function GenericTableRow({
  opts = {},
  pageTableModel,
  dataRow,
  columns,
  convertStringToAccessor
}) {
  /* console.log('main:GenericTableRow:') */

  const history = useHistory();
  const childPosition = opts?.position;

  const clicked = (e, child) => {
    switch (child.type) {
      case 'checkbox':
        pageTableModel.evCheckbox(dataRow);
        break;
      case 'btn':
        pageTableModel.evBtn(dataRow);
        break;
    }
  };

  const onClickRow = (e) => {
    if (e.target.localName === 'a') return;
    if (
      e.target.localName === 'input' ||
      (e.target.localName === 'td' && e.target.className === 'add-comp')
    ) {
      return;
    }
    pageTableModel.evEditRow(dataRow, history);
  };

  const convertBreakTags = (text) => {
    if (!text) return null;
    const regex = /<br>|<br\/>|<\/br>|<br \/>/g;
    const newText = `${text}`;
    const textarr = newText.split(regex).filter((a) => a);
    return textarr;
  };

  const createHyperLink = (dateStr) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const linkTo = `${protocol}//${hostname}/dpl/abwesentheitsliste?date=${dateStr}`;
    return (
      <a rel="noreferrer" target="_blank" href={linkTo}>
        {dateStr}
      </a>
    );
  };

  return (
    <tr onClick={onClickRow}>
      {childPosition === 'first' && (
        <td className="add-comp">
          {opts?.childs.map((child, ix) => (
            <AddItem
              key={`add-item-row-${ix}-${child.type}-${dataRow.id}`}
              child={child}
              clicked={clicked}
            />
          ))}
        </td>
      )}
      {columns.map((column, ix) => {
        if (column?.hidden) return null;
        let bgColor = convertStringToAccessor(dataRow, column, 'bg_color');
        bgColor = bgColor !== null ? bgColor : 'transparent';

        const text = convertStringToAccessor(dataRow, column);
        const textArr = convertBreakTags(text);

        return (
          <td
            key={`col-b-${column.key}-${ix}`}
            className={`${styles.column} ${bgColor}`}
          >
            {textArr &&
              textArr.map((txt, ix) => {
                return (
                  <p style={{ backgroundColor: bgColor }} key={`${txt}-${ix}`}>
                    {column.key === 'start' ? createHyperLink(txt) : txt}
                  </p>
                );
              })}
          </td>
        );
      })}
      {childPosition === 'last' && (
        <td>
          {opts?.childs.map((child, ix) => (
            <AddItem
              key={`add-item-row-${ix}-${child.type}`}
              child={child}
              clicked={clicked}
            />
          ))}
        </td>
      )}
    </tr>
  );
}

export default React.memo(GenericTableRow);
