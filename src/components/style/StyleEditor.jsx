import Input from '../shared/Input';
import styles from './StyleEditor.module.scss';

export default function StyleEditor({
  formData,
  handleInputChange,
  user,
  image,
  setImage,
  imRef,
}) {
  const {
    titleFont,
    titleColor,
    backgroundColor,
    borderColor,
    font,
    color,
    bgColor,
  } = formData;

  function handleFileChange() {
    const file = imRef.current.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = function () {
      setImage(reader.result);
    };
  }
  return (
    <>
      <div className={styles.sub__title}>WonderBox 캘린더 이름</div>
      <div className={styles.custom__container}>
        <div className={styles.custom__box}>
          <Input
            id="titleFont"
            name="titleFont"
            value={titleFont}
            label="글씨체"
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            name="titleColor"
            value={titleColor}
            label="글씨 색상"
            onChange={handleInputChange}
          />
          <Input
            type="color"
            name="titleColor"
            value={titleColor}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            name="backgroundColor"
            value={backgroundColor}
            label="배경색"
            onChange={handleInputChange}
          />
          <Input
            type="color"
            name="backgroundColor"
            value={backgroundColor}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            name="borderColor"
            value={borderColor}
            label="선색"
            onChange={handleInputChange}
          />
          <Input
            type="color"
            name="borderColor"
            value={borderColor}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
      </div>
      <div className={styles.sub__title}>날짜</div>
      <div className={styles.custom__container}>
        <div>
          <div className={styles.custom__box}>
            <Input
              type="text"
              id="font"
              name="font"
              value={font}
              label="글씨체"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            id="color"
            name="color"
            value={color}
            label="글씨 색상"
            onChange={handleInputChange}
          />
          <Input
            type="color"
            id="color"
            name="color"
            value={color}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            name="bgColor"
            value={bgColor}
            label="배경색"
            onChange={handleInputChange}
          />
          <Input
            type="color"
            name="bgColor"
            value={bgColor}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
      </div>
      <div>
        <div className={styles.file__box}>
          <div>전체 배경 사진 업로드 (필수)</div>
          <label
            htmlFor="file"
            style={{
              backgroundImage: image ? `url(${image})` : 'none',
            }}
          >
            클릭 시 사진 업로드
          </label>
          {user ? (
            <input
              id="file"
              type="file"
              name="image"
              accept=".jpg, .jpeg, .png, .gif"
              onChange={handleFileChange}
              ref={imRef}
            />
          ) : (
            <Input
              id="image"
              type="text"
              name="image"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className={styles.file__box__url}
            />
          )}
        </div>
      </div>
    </>
  );
}
