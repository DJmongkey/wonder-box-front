import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import ShareBox from '../components/shareBox/ShareBox';
import Loading from '../components/shared/Loading';
import useFormInput from '../hooks/useFormInput';
import { redirectErrorPage } from '../errors/handleError';
import styles from './SharedCalendar.module.scss';

export default function SharedCalendar() {
  const { calendarId } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const { formData, updateFormData } = useFormInput({
    calendar: {},
    dailyBoxes: [],
    style: {},
    boxes: {},
  });

  const { calendar, dailyBoxes, style, boxes } = formData;
  const { title, options } = calendar;
  const { titleFont, titleColor, backgroundColor, borderColor, image } = style;

  useEffect(() => {
    async function getShareLink() {
      try {
        setIsLoading(true);

        const url = `/calendars/${calendarId}/share`;
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        setIsLoading(false);

        const { calendar, dailyBoxes } = data;
        const { style } = calendar;
        const { box } = style;

        updateFormData({ calendar, dailyBoxes, style, boxes: box });
      } catch (error) {
        setIsLoading(false);
        redirectErrorPage(navigate, error);
      }
    }

    getShareLink();
  }, [calendarId]);

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <div
        className={styles.calendar}
        style={{
          backgroundImage: image ? `url(${image})` : 'none',
        }}
      >
        <header>
          <Link to="/" className={styles.wonderBox__logo}>
            MY WonderBox
          </Link>
        </header>
        <section className={styles.wonderBox__container}>
          <div
            className={styles.wonderBox__title}
            style={{
              backgroundColor,
            }}
          >
            <div
              style={{
                color: titleColor,
                border: `3px dotted ${borderColor}`,
                fontFamily: titleFont,
              }}
              className={styles.wonderBox__title__inside}
            >
              {title}
            </div>
          </div>
          {dailyBoxes.map((box, index) => (
            <ShareBox
              key={box._id}
              content={box.content}
              index={index}
              date={box.date}
              box={boxes}
              options={options}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
