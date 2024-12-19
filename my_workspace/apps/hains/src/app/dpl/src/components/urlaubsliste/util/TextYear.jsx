import { UseRegisterKey } from '../../../hooks/use-register';

function TextYear({ tablemodel }) {
  UseRegisterKey('viewYear', tablemodel.push, tablemodel.pull, tablemodel);
  return `${tablemodel.yearAw}`;
}
export default TextYear;
