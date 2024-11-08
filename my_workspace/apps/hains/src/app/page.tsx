// import Button from './client/Button';
import Button from './client/Button';
import styles from './page.module.css';
import { Input } from '@my-workspace/ui';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <Button />
            <Input />
            <h1>
              <span> Hello there, </span>
              Welcome Hains 👋
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
