import styles from './Modal.module.scss';

export default function Modal({ children, isOpen, className }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles.modal_overlay}>
      <div className={`${styles.modal_content} ${className}`}>{children}</div>
    </div>
  );
}
