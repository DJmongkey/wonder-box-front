import styles from './Input.module.scss';

export default function Input({
  type = 'text',
  id,
  name,
  value,
  onChange,
  label,
  isRequired = true,
  className,
  error,
  subText,
  checkedOption,
}) {
  function checkInputType() {
    switch (type) {
      case 'text':
        return (
          <div className={className}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
              type="text"
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              required={isRequired}
            />
          </div>
        );
      case 'date':
        return (
          <div className={`${className} ${styles.dateInput}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
              type="date"
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              required={isRequired}
            />
            <p>{subText}</p>
          </div>
        );
      case 'radio':
        return (
          <>
            <div className={`${className} ${styles.radioInput}`}>
              <input
                type="radio"
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={isRequired}
                checked={checkedOption}
              />
              {label && <label htmlFor={id}>{label}</label>}
            </div>
            {error && <div className={styles.error}>{error}</div>}
          </>
        );
      default:
        return null;
    }
  }
  return checkInputType();
}
