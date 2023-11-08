import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import StylePreview from '../components/style/StylePreview';
import StyleEditor from '../components/style/StyleEditor';
import Modal from '../components/shared/Modal';
import { useAuthContext } from '../context/AuthContext';
import { useFormContext } from '../context/FormContext';
import useFormInput from '../hooks/useFormInput';
import useFetchData from '../hooks/useFetchData';
import ERRORS from '../errors/errorMessage';
import { redirectErrorPage } from '../errors/handleError';
import styles from './StyleForm.module.scss';

const defaultStyle = {
  titleFont: 'Open Sans',
  titleColor: '#f3eded',
  borderColor: '#9fbc0c',
  backgroundColor: '#9fbc0c',
  image: '',
  imageFile: null,
  font: 'Open Sans',
  color: '#f4efef',
  bgColor: '#9fbc0c',
  shareUrl: '',
};

export default function StyleForm() {
  const [existingStyleData, setExistingStyleData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuthContext();
  const { calendarId } = useParams();
  const { fetchData, isLoading, setIsLoading, navigate } = useFetchData();
  const { setIsStyleValid } = useFormContext();

  const {
    formData,
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
    shareUrl,
  } = formData;

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const newStyle = {
      titleFont,
      titleColor,
      backgroundColor,
      borderColor,
      image: imageFile || image,
      box: {
        font,
        color,
        bgColor,
      },
    };

    try {
      if (user) {
        const fetchMethod = existingStyleData ? 'PUT' : 'POST';
        const fetchUrl = `/calendars/${calendarId}/style`;
        const uploadData = new FormData();

        uploadData.append('titleFont', titleFont);
        uploadData.append('titleColor', titleColor);
        uploadData.append('backgroundColor', backgroundColor);
        uploadData.append('borderColor', borderColor);
        uploadData.append('image', imageFile || image);
        uploadData.append('box[font]', font);
        uploadData.append('box[color]', color);
        uploadData.append('box[bgColor]', bgColor);

        const data = await fetchData(fetchUrl, fetchMethod, {}, uploadData);

        updateFormData({ shareUrl: data.shareUrl });

        setIsStyleValid(true);
      }

      if (!user) {
        const localCalendarId = JSON.parse(localStorage.getItem('id'));
        const localCalendar = JSON.parse(localStorage.getItem(localCalendarId));

        setIsLoading(true);

        localCalendar.style = newStyle;

        setTimeout(() => {
          localStorage.setItem(localCalendarId, JSON.stringify(localCalendar));

          setIsLoading(false);
          setIsStyleValid(true);
        }, 1000);
      }
      setIsOpen(true);
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
      } catch (error) {
        redirectErrorPage(navigate, error);
      }
    }

    function getLocalStyle(calendarId) {
      const localCalendarId = localStorage.getItem('id');

      if (localCalendarId !== calendarId) {
        redirectErrorPage(navigate, undefined, ERRORS.AUTH.UNAUTHORIZED, 401);
      }

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

    if (user) {
      getStyle();
    } else {
      getLocalStyle(calendarId);
    }
  }, [calendarId, user]);

  return (
    <div>
      {isLoading && <Loading asOverlay />}
      <form onSubmit={handleSubmit}>
        <StylePreview formData={formData} previewImage={previewImage} />
        <StyleEditor
          formData={formData}
          handleInputChange={handleInputChange}
          user={user}
          previewImage={previewImage}
          inputTypes={inputTypes}
          handleRemoveFile={handleRemoveFile}
        />
        <div className={styles.button__container}>
          <Button onClick={() => navigate(-1)} customMove={styles.moveBtn}>
            이전
          </Button>
          <Button type="submit" customMove={styles.moveBtn}>
            저장 후 공유 링크 받기
          </Button>
        </div>
      </form>
      {isOpen && (
        <Modal isOpen={isOpen} className={styles.modal__share}>
          {user ? (
            <div>
              <div className={styles.modal__share__title}>공유 링크</div>
              <div className={styles.modal__share__link}>{shareUrl}</div>
              <Button to="/" customMove={styles.moveBtn}>
                메인 페이지로 이동
              </Button>
            </div>
          ) : (
            <div>
              <span>
                로그인을 하셔야 편집된 WonderBox 공유 링크를 받을 수 있습니다.
              </span>
              <div className={styles.guide_tex}>
                <strong>지금까지의 정보는 저장</strong>이 되어 로그인/회원가입
                후 다시 편집하지 않아도 현재 정보로 공유 링크를 받으실 수
                있습니다.
              </div>
              <Button to="/login" customMove={styles.moveBtn}>
                로그인
              </Button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
