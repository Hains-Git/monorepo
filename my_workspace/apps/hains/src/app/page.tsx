import Button from './client/Button';
import styles from './page.module.css';

export default function Index() {
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">HALLO</div>
        <Button clientId={process.env.CLIENT_ID || ''} clientSecret={process.env.CLIENT_SECRET || ''} />
      </div>
    </div>
  );
}
