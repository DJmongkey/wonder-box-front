import { useEffect } from 'react';

import styles from './Notification.module.scss';

export default function Notification({ type, message, time, onHide }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onHide) {
        onHide();
      }
    }, time + 1000);

    return () => clearTimeout(timer);
  }, [time, onHide]);

  function messageStyle() {
    switch (type) {
      case 'success':
        return styles.success;
      case 'error':
        return styles.error;
      default:
        return '';
    }
  }
  return (
    <div className={`${messageStyle()} ${styles.notification}`}>{message}</div>
  );
}
