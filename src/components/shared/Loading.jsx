import styles from './Loading.module.scss';

export default function Loading({ asOverlay }) {
  return (
    <div className={`${asOverlay && styles.loading__overlay}`}>
      <div className={styles.loading}></div>
      <p>Loading...</p>
    </div>
  );
}
