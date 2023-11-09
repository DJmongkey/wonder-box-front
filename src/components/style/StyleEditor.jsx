import { IoTrashBin } from 'react-icons/io5';

import Input from '../shared/Input';
import styles from './StyleEditor.module.scss';

export default function StyleEditor({
  formData,
  formErrors,
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
    image,
    font,
    color,
    bgColor,
  } = formData;

  return (
    <section className={styles.editor__container}>
      <div className={styles.sub__title}>WonderBox 캘린더 이름</div>
      {(formErrors.titleFont ||
        formErrors.titleColor ||
        formErrors.backgroundColor ||
        formErrors.borderColor) && (
        <div className={styles.error}>
          {formErrors.titleFont ||
            formErrors.titleColor ||
            formErrors.backgroundColor ||
            formErrors.borderColor}
        </div>
      )}
      <div className={styles.custom__container}>
        <div className={styles.custom__box}>
          <Input
            id="titleFont"
            name="titleFont"
            value={titleFont}
            label="글씨체"
            onChange={handleInputChange}
            className={styles.input__wrapper__font}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            id="titleColor"
            name="titleColor"
            value={titleColor}
            label="글씨색"
            onChange={handleInputChange}
            className={styles.input__wrapper}
          />
          <Input
            type="color"
            name="titleColor"
            value={titleColor}
            onChange={handleInputChange}
            className={styles.color__picker}
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
            className={styles.input__wrapper}
          />
          <Input
            type="color"
            name="backgroundColor"
            value={backgroundColor}
            onChange={handleInputChange}
            className={styles.color__picker}
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
            className={styles.input__wrapper}
          />
          <Input
            type="color"
            name="borderColor"
            value={borderColor}
            onChange={handleInputChange}
            className={styles.color__picker}
          />
        </div>
      </div>
      {(formErrors.font || formErrors.color || formErrors.bgColor) && (
        <div className={styles.error}>
          {formErrors.font || formErrors.color || formErrors.bgColor}
        </div>
      )}
      <div className={styles.custom__date__container}>
        <div className={styles.sub__title}>날짜</div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            id="font"
            name="font"
            value={font}
            label="글씨체"
            onChange={handleInputChange}
            className={styles.input__wrapper__font}
          />
        </div>
        <div className={styles.custom__box}>
          <Input
            type="text"
            id="color"
            name="color"
            value={color}
            label="글씨색"
            onChange={handleInputChange}
            className={styles.input__wrapper}
          />
          <Input
            type="color"
            name="color"
            value={color}
            onChange={handleInputChange}
            className={styles.color__picker}
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
            className={styles.input__wrapper}
          />
          <Input
            type="color"
            name="bgColor"
            value={bgColor}
            onChange={handleInputChange}
            className={styles.color__picker}
          />
        </div>
      </div>
      <div className={styles.file__container}>
        <div className={styles.file__input}>
          <div className={styles.sub__title__bg}>전체 배경 사진 (필수)</div>
          <Input
            type="text"
            id="image"
            name="image"
            value={inputTypes.image === 'text' ? image : ''}
            onChange={handleInputChange}
            placeholder="이미지 URL"
            isDisabled={inputTypes.image === 'file'}
            isRequired={false}
            className={styles.file__box__url}
          />
          <Input
            type="file"
            id="imageFile"
            name="imageFile"
            accept=".jpg, .jpeg, .png, .gif"
            onChange={handleInputChange}
            isDisabled={(!user || inputTypes.image === 'text') && true}
            isRequired={false}
            className={styles.file__box__upload}
          />
          {!user && (
            <div className={styles.error}>
              비회원은 URL 첨부만 이용 가능 합니다
            </div>
          )}
        </div>
        {previewImage && (
          <div className={styles.preview__image}>
            <IoTrashBin
              className={styles.icon__delete}
              onClick={() => handleRemoveFile('image')}
            />
            <img src={previewImage} alt="배경 사진" />
          </div>
        )}
      </div>
      {formErrors.image && (
        <div className={styles.error}>{formErrors.image}</div>
      )}
    </section>
  );
}
