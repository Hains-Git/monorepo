import './zoom.css';
import { FaEquals, FaMinus, FaPlus, FaUndo } from 'react-icons/fa';
import CustomButton from '../custom_buttons/CustomButton';

function Zoom({ changeSize, undo }) {
  return (
    <div className="zoom-btns">
      <CustomButton
        className="as_icon"
        dataInfo="-"
        spinner={{ show: true }}
        clickHandler={changeSize}
      >
        <FaMinus />
      </CustomButton>
      <CustomButton
        className="as_icon"
        dataInfo="="
        spinner={{ show: true }}
        clickHandler={changeSize}
      >
        <FaEquals />
      </CustomButton>
      <CustomButton
        className="as_icon"
        dataInfo="+"
        spinner={{ show: true }}
        clickHandler={changeSize}
      >
        <FaPlus />
      </CustomButton>
      {undo ? (
        <CustomButton className="as_icon" clickHandler={undo}>
          <FaUndo />
        </CustomButton>
      ) : null}
    </div>
  );
}

export default Zoom;
