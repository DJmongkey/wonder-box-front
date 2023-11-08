import styles from './StylePreview.module.scss';

export default function StylePreview({ formData, previewImage }) {
  const {
    titleColor,
    titleFont,
    borderColor,
    backgroundColor,
    image,
    color,
    bgColor,
    font,
  } = formData;

  return (
    <>
      <div className={styles.sub__title}>Preview</div>
      <div
        className={styles.preview__container}
        style={{
          backgroundImage: previewImage ? `url(${previewImage})` : 'none',
        }}
      >
        <div
          style={{
            color: titleColor,
            borderColor,
            backgroundColor,
            fontFamily: titleFont,
          }}
          className={styles.preview__title}
        >
          Title
        </div>
        <div className={styles.preview__date}>
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              style={{ backgroundColor: bgColor, color, fontFamily: font }}
            >
              {number}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
