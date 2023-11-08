import { IoTrashBin } from 'react-icons/io5';

import Input from '../shared/Input';
import styles from './StyleEditor.module.scss';

export default function StyleEditor({
  formData,
  handleInputChange,
  user,
  previewImage,
  inputTypes,
  handleRemoveFile,
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
            id="titleColor"
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
            id="backgroundColor"
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
            id="borderColor"
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
            name="color"
            value={color}
            onChange={handleInputChange}
            className={styles.custom__box__color}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            id="bgColor"
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
          <Input
            type="file"
            id="imageFile"
            name="imageFile"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleInputChange}
            isDisabled={(!user || inputTypes.image === 'text') && true}
            className={styles.file__box__upload}
          />
          <Input
            type="text"
            id="image"
            name="image"
            value={inputTypes.image === 'text' ? formData.image : ''}
            onChange={handleInputChange}
            placeholder="URL을 입력해주세요"
            isDisabled={inputTypes.image === 'file'}
            className={styles.file__box__url}
          />
          {previewImage && (
            <div className={styles.preview__image}>
              <img src={previewImage} alt="배경 사진" />
              <IoTrashBin
                size="14"
                className={styles.icon__delete}
                onClick={() => handleRemoveFile('image')}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
