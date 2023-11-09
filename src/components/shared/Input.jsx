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
  subText,
  checkedOption,
  accept,
  isDisabled = false,
  placeholder,
}) {
  function renderInputByType() {
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
              disabled={isDisabled}
              placeholder={placeholder}
            />
          </div>
        );
      case 'textarea':
        return (
          <div className={`${className} ${styles.textareaInput}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <textarea id={id} name={name} value={value} onChange={onChange} />
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
        );
      case 'file':
        return (
          <div className={`${className} ${styles.fileInput}`}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
              type="file"
              id={id}
              name={name}
              accept={accept}
              onChange={onChange}
              required={isRequired}
              disabled={isDisabled}
            />
          </div>
        );
      case 'color':
        return (
          <input
            type="color"
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={className}
          />
        );
      default:
        return null;
    }
  }
  return renderInputByType();
}
