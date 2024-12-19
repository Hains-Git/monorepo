import { UseTooltip } from '../../hooks/use-tooltip';

function Cell({ title = '', color = '', children, tag = 'td', date, className = '', id = '' }) {
  const [onOver, onOut] = UseTooltip(title);
  const html =
    tag === 'td' ? (
      <td
        id={id}
        className={className}
        data-date={date}
        onMouseOut={onOut}
        onMouseOver={onOver}
        // style={{ backgroundColor: color, borderColor: color }}
      >
        {children}
      </td>
    ) : (
      <th
        id={id}
        className={className}
        data-date={date}
        onMouseOut={onOut}
        onMouseOver={onOver}
        // style={{
        //   backgroundColor: color,
        //   borderColor: color
        // }}
      >
        {children}
      </th>
    );
  return html;
}
export default Cell;
