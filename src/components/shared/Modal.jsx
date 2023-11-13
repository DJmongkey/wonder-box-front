import styles from './Modal.module.scss';

export default function Modal({ children, isOpen, className }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles.modal__overlay}>
      <div className={`${styles.modal__content} ${className}`}>{children}</div>
    </div>
  );
}
