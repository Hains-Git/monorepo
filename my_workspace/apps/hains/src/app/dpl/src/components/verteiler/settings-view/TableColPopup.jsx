import styles from './settings-view.module.css';

const tableOptions = [
  { key: 'add_col_left', text: '+ Spalte links ' },
  { key: 'add_col_right', text: '+ Spalte rechts ' },
  { key: 'add_row_top', text: '+ Zeile oben ' },
  { key: 'add_row_bottom', text: '+ Zeile unten ' },
  { key: 'remove_col', text: '- Spalte entfernen ' },
  { key: 'remove_row', text: '- Zeile entfernen ' }
];

const TableColPopup = ({
  tableCoordinates,
  showTablePopup,
  settingsBtn,
  setShowTablePopup,
  setTablePopupSettings
}) => {
  let left = 0;
  let top = 0;
  if (settingsBtn) {
    const tdNode = settingsBtn.parentNode.parentNode;
    const width = tdNode.offsetWidth;
    left = tdNode.offsetLeft + width - 260;
    top = tdNode.offsetTop + 30;
  }

  const clickItemOptions = (item) => {
    const config = {
      key: item.key,
      ...tableCoordinates
    };
    setTablePopupSettings(() => config);
    setShowTablePopup(() => false);
  };

  return (
    <div
      style={{ left, top }}
      className={`${styles.menu} ${showTablePopup ? styles.menu_show : ''}`}
    >
      <div className={styles.menu_close}>
        <span onClick={() => setShowTablePopup(() => false)}>X</span>
      </div>
      <ul>
        {tableOptions.map((item) => (
          <li
            className={styles.menu_item}
            onClick={() => clickItemOptions(item)}
            key={item.key}
          >
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TableColPopup;
