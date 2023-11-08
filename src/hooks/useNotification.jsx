import { useState } from 'react';

export default function useNotification() {
  const [notification, setNotification] = useState({
    isShown: false,
    type: '',
    message: '',
  });

  function showNotification(type, message) {
    setNotification({
      isShown: true,
      type,
      message,
    });
  }

  function hideNotification(type, message) {
    setNotification({
      ...notification,
      isShown: false,
    });
  }

  return { notification, showNotification, hideNotification };
}
