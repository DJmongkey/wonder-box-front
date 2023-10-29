import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

export default function Button({
  children,
  to,
  type = 'button',
  onClick,
  disabled,
  customClass,
}) {
  const className = [
    styles.button,
    disabled ? styles['button--disabled'] : '',
    customClass || '',
  ].join(' ');

  return (
    <>
      {to && (
        <Link to={to} className={styles.button}>
          {children}
        </Link>
      )}
      {!to && (
        <button
          className={className}
          type={type}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </button>
      )}
    </>
  );
}
