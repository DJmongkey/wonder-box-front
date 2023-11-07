import { useParams } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import useFormInput from '../hooks/useFormInput';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import { useAuthContext } from '../context/AuthContext';
import useFetchData from '../hooks/useFetchData';
import { redirectErrorPage } from '../errors/handleError';
import ERRORS from '../errors/errorMessage';
import styles from './StyleForm.module.scss';

export default function StyleForm() {
  const [image, setImage] = useState('');
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
  });

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

        await fetchData(fetchUrl, fetchMethod, {}, uploadData);

        navigate(`/custom/preview/${calendarId}`);
      }
      if (!user && calendarId) {
        const existingValue = JSON.parse(localStorage.getItem(calendarId));

        existingValue.style = newStyle;

        localStorage.setItem(calendarId, JSON.stringify(existingValue));

        navigate('/signup');
      }
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
        <div className={styles.sub__title}>Preview</div>
        <div
          className={styles.preview__container}
          style={{
            backgroundImage: image ? `url(${image})` : 'none',
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
            <div style={{ backgroundColor: bgColor, color, fontFamily: font }}>
              1
            </div>
            <div style={{ backgroundColor: bgColor, color, fontFamily: font }}>
              2
            </div>
            <div style={{ backgroundColor: bgColor, color, fontFamily: font }}>
              3
            </div>
          </div>
        </div>
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
                accept="image/*"
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
        <div className={styles.button__container}>
          <Button onClick={handleClick} customMove={styles.moveBtn}>
            이전
          </Button>
          <Button type="submit" customMove={styles.moveBtn}>
            저장 후 공유 링크 받기
          </Button>
        </div>
      </form>
    </div>
  );
}
