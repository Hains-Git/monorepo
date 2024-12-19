import { FaTrash } from 'react-icons/fa';
import styles from '../urlaubsliste.module.css';
import { UseRegisterKey } from '../../../hooks/use-register';
import CustomButton from '../../utils/custom_buttons/CustomButton';

function CounterList({ tablemodel, urlaubsliste }) {
  const counters = tablemodel.visibleCounters;

  const removeCounter = (id, setLoading) => {
    urlaubsliste.removeCounter(id, setLoading);
  };

  UseRegisterKey(
    'counterUpdate',
    urlaubsliste.push,
    urlaubsliste.pull,
    urlaubsliste
  );

  return (
    <div className={styles.counter_list}>
      {Object.values(counters).map((counter) => {
        return (
          <div key={`cid-${counter.id}`} className={styles.counter_item}>
            <p>Name: {counter?.planname}</p>
            <p>Desc: {counter?.description}</p>
            <p>Von: {counter?.von}</p>
            <p>Bis: {counter?.bis}</p>
            <p className={styles.remove_counter}>
              <CustomButton
                spinner={{ show: true }}
                clickHandler={(e, setLoading) =>
                  removeCounter(counter.id, setLoading)
                }
                className="as_icon"
              >
                <FaTrash color="rgba(178,35,34, 0.6)" />
              </CustomButton>
            </p>
          </div>
        );
      })}
    </div>
  );
}
export default CounterList;
