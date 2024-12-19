import { HiTemplate } from 'react-icons/hi';
import { IconContext } from 'react-icons';
import CustomButton from '../../utils/custom_buttons/CustomButton';
import styles from './vorlagen.module.css';

function VorlageAuswahlButton({
  toggleView = () => {},
  iconSizeMemo = {},
  className = '',
  addStyles = ''
}) {
  return (
    <div className={`${styles.vorlage_auswahl_btn} ${className}`}>
      <CustomButton
        className="as_icon"
        title="Vorlagen öffnen"
        addStyles={addStyles}
        id="vorlagen-btn"
        clickHandler={toggleView}
      >
        <IconContext.Provider value={iconSizeMemo}>
          <HiTemplate />
        </IconContext.Provider>
      </CustomButton>
    </div>
  );
}

export default VorlageAuswahlButton;
