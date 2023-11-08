import styles from './StylePreview.module.scss';

export default function StylePreview({ formData, previewImage }) {
  const {
    titleColor,
    titleFont,
    borderColor,
    backgroundColor,
    color,
    bgColor,
    font,
  } = formData;

  return (
    <section className={styles.preview__container}>
      <div className={styles.sub__title}>Preview</div>
      <div
        className={styles.preview}
        style={{
          backgroundImage: previewImage ? `url(${previewImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div
          style={{
            backgroundColor,
          }}
          className={styles.preview__title}
        >
          <div
            style={{
              color: titleColor,
              borderColor,
              fontFamily: titleFont,
            }}
            className={styles.preview__title__inside}
          >
            Title
          </div>
        </div>
        <div className={styles.preview__date}>
          {[1, 2, 3].map((number) => (
            <div
              className={styles.preview__date__box}
              key={number}
              style={{ backgroundColor: bgColor, color, fontFamily: font }}
            >
              {number}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
