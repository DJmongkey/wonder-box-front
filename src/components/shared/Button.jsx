import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

export default function Button({
  children,
  to,
  type = 'button',
  onClick,
  disabled,
  customClass,
  customLink,
  customMove,
}) {
  const className = [
    styles.button,
    disabled ? `disabled ${styles['button--disabled']}` : '',
    customClass || '',
    customLink ? `${styles['link']} ${customLink}` : '',
    customMove ? `${styles['moveBtn']} ${customMove}` : '',
  ].join(' ');

  return (
    <>
      {to && (
        <Link
          to={to}
          className={className}
          onClick={!disabled ? onClick : (e) => e.preventDefault()}
        >
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
