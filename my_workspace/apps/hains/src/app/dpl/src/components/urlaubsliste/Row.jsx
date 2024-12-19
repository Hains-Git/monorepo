function Row({ children }) {
  const toggleClass = (evt) => {
    console.log(evt.target.closest('tr'));
    const tr = evt.target.closest('tr');
    if (tr.classList.contains('selected')) {
      tr.classList.remove('selected');
    } else {
      tr.classList.add('selected');
    }
  };
  return <tr onClick={toggleClass}>{children}</tr>;
}
export default Row;
