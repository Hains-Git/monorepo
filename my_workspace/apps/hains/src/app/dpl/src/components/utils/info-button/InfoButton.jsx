import { FaInfo } from 'react-icons/fa';
import CustomButton from '../custom_buttons/CustomButton';

function InfoButton({ title = '', parent, className }) {
  const handleClick = (evt, setLoading) => {
    evt.stopPropagation();
    parent?.setInfo?.(evt);
    setLoading?.(() => false);
  };

  if (!parent) return null;
  return (
    <CustomButton
      title={title}
      clickHandler={handleClick}
      className={className}
      style={{ padding: '2px 2px' }}
      spinner={{ show: true }}
    >
      <FaInfo size={9} />
    </CustomButton>
  );
}

export default InfoButton;
