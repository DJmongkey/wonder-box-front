import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';

import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import StylePreview from '../components/style/StylePreview';
import StyleEditor from '../components/style/StyleEditor';

import { useAuthContext } from '../context/AuthContext';
import useFormInput from '../hooks/useFormInput';
import useFetchData from '../hooks/useFetchData';
import ERRORS from '../errors/errorMessage';
import { redirectErrorPage } from '../errors/handleError';
import styles from './StyleForm.module.scss';

const defaultStyle = {
  titleFont: 'Playpen Sans',
  titleColor: '#fffaff',
  borderColor: '#f8f0ff',
  backgroundColor: '#0d8c5b',
  image: '',
  imageFile: null,
  font: 'Playpen Sans',
  color: '#ffffff',
  bgColor: '#b50d0d',
  sharedUrl: '',
};

export default function StyleForm() {
  const [existingStyleData, setExistingStyleData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuthContext();
  const { calendarId } = useParams();

  const localCalendarId = localStorage.getItem('id');

  const { fetchData, isLoading, setIsLoading, navigate, error } =
    useFetchData();

  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    updateFormData,
    inputTypes,
    previewImage,
    setPreviewImage,
    handleRemoveFile,
  } = useFormInput(defaultStyle);

  const {
    titleFont,
    titleColor,
    borderColor,
    backgroundColor,
    image,
    imageFile,
    font,
    color,
    bgColor,
    sharedUrl,
  } = formData;

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      if (user) {
        const fetchMethod = existingStyleData ? 'PUT' : 'POST';
        const fetchUrl = `/calendars/${calendarId}/style`;
        const uploadData = new FormData();

        uploadData.append('titleFont', titleFont || defaultStyle.titleFont);
        uploadData.append('titleColor', titleColor || defaultStyle.titleColor);
        uploadData.append(
          'backgroundColor',
          backgroundColor || defaultStyle.backgroundColor,
        );
        uploadData.append(
          'borderColor',
          borderColor || defaultStyle.borderColor,
        );
        uploadData.append('image', imageFile || image);
        uploadData.append('box[font]', font || defaultStyle.font);
        uploadData.append('box[color]', color || defaultStyle.color);
        uploadData.append('box[bgColor]', bgColor || defaultStyle.bgColor);

        const data = await fetchData(fetchUrl, fetchMethod, {}, uploadData);

        updateFormData({ sharedUrl: data.sharedUrl });

        if (localCalendarId) {
          localStorage.removeItem(localCalendarId);
          localStorage.removeItem('id');
        }

        setIsOpen(true);
      }

      if (!user) {
        const newStyle = {
          titleFont,
          titleColor,
          borderColor,
          backgroundColor,
          image: imageFile || image,
          box: {
            font,
            color,
            bgColor,
          },
        };

        const localCalendar = JSON.parse(localStorage.getItem(localCalendarId));

        setIsLoading(true);

        localCalendar.style = newStyle;

        setTimeout(() => {
          localStorage.setItem(localCalendarId, JSON.stringify(localCalendar));

          setIsLoading(false);
          setIsOpen(true);
        }, 1000);
      }
    } catch (error) {
      redirectErrorPage(navigate, error);
    }
  }

  useEffect(() => {
    async function getStyle() {
      try {
        const data = await fetchData(
          `/calendars/${calendarId}/style`,
          'GET',
          { 'Content-Type': 'application/json' },
          null,
        );

        if (Object.keys(data.style).length === 0) {
          updateFormData(defaultStyle);
        } else {
          const {
            titleFont,
            titleColor,
            borderColor,
            backgroundColor,
            image,
            box,
          } = data.style;
          setPreviewImage(image);

          updateFormData({
            titleFont,
            titleColor,
            borderColor,
            backgroundColor,
            image,
            font: box.font,
            color: box.color,
            bgColor: box.bgColor,
          });

          setExistingStyleData(true);
        }
        if (localCalendarId) {
          getLocalData();
        }
      } catch (error) {
        redirectErrorPage(navigate, error);
      }
    }

    function getLocalStyle(calendarId) {
      if (localCalendarId !== calendarId) {
        redirectErrorPage(navigate, undefined, ERRORS.AUTH.UNAUTHORIZED, 401);
      }
      getLocalData();
    }

    if (user) {
      getStyle();
    } else {
      getLocalStyle(calendarId);
    }
  }, [calendarId, user]);

  function handleCopyClipBoard(text) {
    navigator.clipboard.writeText(text);
  }

  function getLocalData() {
    const localCalendar = JSON.parse(localStorage.getItem(localCalendarId));

    if (localCalendar && localCalendar.style) {
      const { titleFont, titleColor, borderColor, backgroundColor, image } =
        localCalendar.style;

      const { font, color, bgColor } = localCalendar.style.box;

      if (image) {
        setPreviewImage(image);
      } else {
        setPreviewImage('');
      }

      updateFormData({
        titleFont,
        titleColor,
        borderColor,
        backgroundColor,
        image,
        font,
        color,
        bgColor,
      });
    }
  }

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <form onSubmit={handleSubmit} noValidate>
        <StylePreview formData={formData} previewImage={previewImage} />
        <StyleEditor
          formData={formData}
          formErrors={formErrors}
          handleInputChange={handleInputChange}
          user={user}
          previewImage={previewImage}
          inputTypes={inputTypes}
          handleRemoveFile={handleRemoveFile}
        />
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.button__container}>
          <Link
            to={`/custom/daily-boxes/${calendarId}`}
            className={styles.moveBtn}
          >
            이전
          </Link>
          <Button type="submit" customMove={styles.moveBtn}>
            저장 후 공유 링크 받기
          </Button>
        </div>
      </form>
      {isOpen && (
        <Modal isOpen={isOpen} className={styles.modal__share}>
          {user ? (
            <>
              <span
                className={styles.icon__close}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <IoClose />
              </span>
              <div className={styles.notice}>
                <p className={styles.modal__share__title}>공유 링크</p>
                <p className={styles.modal__share__link}>{sharedUrl}</p>
                <p
                  className={styles.modal__share__link__copy}
                  onClick={() => handleCopyClipBoard(sharedUrl)}
                >
                  복사하기
                </p>
              </div>
              <Link to="/" className={styles.moveBtn}>
                메인 페이지로 이동
              </Link>
            </>
          ) : (
            <>
              <span
                className={styles.icon__close}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <IoClose />
              </span>
              <div className={styles.guide_text}>
                <span>
                  <strong>로그인</strong>을 하셔야 편집된 WonderBox 공유 링크를
                  받을 수 있습니다.
                </span>
                <p>
                  <strong>지금까지의 정보는 저장</strong>이 되어 로그인/회원가입
                  후 다시 편집하지 않아도 현재 정보로 공유 링크를 받으실 수
                  있습니다.
                </p>
              </div>
              <Link to="/login" className={styles.moveBtn}>
                로그인
              </Link>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
