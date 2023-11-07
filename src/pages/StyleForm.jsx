import { useParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import useFormInput from '../hooks/useFormInput';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import StylePreview from '../components/style/StylePreview';
import StyleEditor from '../components/style/StyleEditor';
import Modal from '../components/shared/Modal';
import { useAuthContext } from '../context/AuthContext';
import useFetchData from '../hooks/useFetchData';
import { redirectErrorPage } from '../errors/handleError';
import ERRORS from '../errors/errorMessage';
import styles from './StyleForm.module.scss';

export default function StyleForm() {
  const [image, setImage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [existingStyleData, setExistingStyleData] = useState(false);

  const { user } = useAuthContext();
  const { calendarId } = useParams();

  const imRef = useRef();

  const { fetchData, isLoading, setIsLoading, navigate } = useFetchData();

  const { formData, handleInputChange, updateFormData } = useFormInput({
    titleFont: 'Open Sans',
    titleColor: '#f3eded',
    borderColor: '#9fbc0c',
    backgroundColor: '#9fbc0c',
    font: 'Open Sans',
    color: '#f4efef',
    bgColor: '#9fbc0c',
    shareUrl: '',
  });

  const {
    titleFont,
    titleColor,
    backgroundColor,
    borderColor,
    font,
    color,
    bgColor,
    shareUrl,
  } = formData;

  async function handleSubmit(event) {
    event.preventDefault();

    const boxStyle = {
      font,
      color,
      bgColor,
    };

    const newStyle = {
      titleFont,
      titleColor,
      backgroundColor,
      borderColor,
      image,
      box: boxStyle,
    };

    try {
      if (user) {
        const fetchMethod = existingStyleData ? 'PUT' : 'POST';
        const fetchUrl = `/calendars/${calendarId}/style`;
        const uploadData = new FormData();

        uploadData.append('titleFont', newStyle.titleFont);
        uploadData.append('titleColor', newStyle.titleColor);
        uploadData.append('backgroundColor', newStyle.backgroundColor);
        uploadData.append('borderColor', newStyle.borderColor);
        uploadData.append('image', imRef.current.files[0]);
        uploadData.append('box[font]', boxStyle.font);
        uploadData.append('box[color]', boxStyle.color);
        uploadData.append('box[bgColor]', boxStyle.bgColor);

        const data = await fetchData(fetchUrl, fetchMethod, {}, uploadData);

        updateFormData({
          shareUrl: data.shareUrl,
        });
      }

      if (!user && calendarId) {
        const existingValue = JSON.parse(localStorage.getItem(calendarId));

        existingValue.style = newStyle;

        localStorage.setItem(calendarId, JSON.stringify(existingValue));
      }
      setIsOpen(true);
    } catch (error) {
      redirectErrorPage(navigate, error);
    }
  }

  function handleClick() {
    navigate(-1);
  }

  useEffect(() => {
    setIsLoading(true);

    async function getStyle() {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/calendars/${calendarId}/style`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await res.json();

        if (!data.style) {
          const defaultStyle = {
            titleFont: 'Open Sans',
            titleColor: '#f3eded',
            borderColor: '#9fbc0c',
            backgroundColor: '#9fbc0c',
            font: 'Open Sans',
            color: '#f4efef',
            bgColor: '#9fbc0c',
          };
          updateFormData(defaultStyle);
          setImage('');
        } else {
          const styleArray = Array.isArray(data.style)
            ? data.style
            : [data.style];
          const styleData = styleArray[0];
          const { titleFont, titleColor, backgroundColor, borderColor, image } =
            styleData;

          const boxDataArray = styleArray.map((item) => item.box);
          const { font, color, bgColor } = boxDataArray[0];

          updateFormData({
            titleFont,
            titleColor,
            backgroundColor,
            borderColor,
            font,
            color,
            bgColor,
          });
          setImage(image);

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

      const localStyle = JSON.parse(localStorage.getItem(localCalendarId));

      if (localStyle && localStyle.style) {
        const { titleFont, titleColor, backgroundColor, borderColor, image } =
          localStyle.style;

        const { font, color, bgColor } = localStyle.style.box;

        updateFormData({
          titleFont,
          titleColor,
          backgroundColor,
          borderColor,
          bgColor,
          color,
          font,
        });

        setImage(image);
      }
    }

    if (calendarId && user) {
      getStyle();
      setIsLoading(false);
    } else {
      getLocalStyle(calendarId);
    }
    setIsLoading(false);
  }, [calendarId, user]);

  return (
    <div>
      {isLoading && <Loading asOverlay />}
      <form onSubmit={handleSubmit}>
        <StylePreview formData={formData} image={image} />
        <StyleEditor
          formData={formData}
          handleInputChange={handleInputChange}
          user={user}
          image={image}
          imRef={imRef}
          setImage={setImage}
        />
        <div className={styles.button__container}>
          <Button onClick={handleClick} customMove={styles.moveBtn}>
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
