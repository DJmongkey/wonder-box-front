import { useEffect } from 'react';

import styles from './Notification.module.scss';

export default function Notification({ type, message, time = 4000, onHide }) {
  const displayTime = time < 4000 ? 4000 : time;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onHide) {
        onHide();
      }
    }, displayTime);

    return () => clearTimeout(timer);
  }, [displayTime, onHide]);

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
