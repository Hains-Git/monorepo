import { UseRegister } from '../../../hooks/use-register';
import WunschLabel from '../wunsch-label/WunschLabel';
import ContentContainer from './ContentContainer';

function ContentWithWunsch({ el, dienstplan, parent = false }) {
  UseRegister(el?._push, el?._pull, el);

  const wunsch = parent ? parent?.addWuensche && el?.wunsch : null;

  return (
    <div className="wunsch-label-container">
      <ContentContainer el={el} dienstplan={dienstplan} />
      {wunsch ? <WunschLabel wunsch={wunsch} /> : null}
    </div>
  );
}

export default ContentWithWunsch;
