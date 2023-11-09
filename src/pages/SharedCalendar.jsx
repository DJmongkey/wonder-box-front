import { useParams } from 'react-router-dom';

import { useEffect } from 'react';
import ShareBox from '../components/shareBox/ShareBox';
import useFetchData from '../hooks/useFetchData';
import useFormInput from '../hooks/useFormInput';
import styles from './SharedCalendar.module.scss';

export default function SharedCalendar() {
  const { calendarId } = useParams();

  const { formData, updateFormData } = useFormInput({
    calendar: {},
    dailyBoxes: [],
    style: {},
    boxes: {},
  });
  const { fetchData } = useFetchData();

  const { calendar, dailyBoxes, style, boxes } = formData;

  const { title, options } = calendar;
  const { titleFont, titleColor, backgroundColor, borderColor, image } = style;

  useEffect(() => {
    async function getShareLink() {
      try {
        const data = await fetchData(
          `/calendars/${calendarId}/share`,
          'GET',
          {
            'Content-Type': 'application/json',
          },
          null,
        );

        const { calendar, dailyBoxes } = data;
        const { style } = calendar;
        const { box } = style;

        updateFormData({ calendar, dailyBoxes, style, boxes: box });
      } catch (error) {
        redirectErrorPage(navigate, error);
      }
    }

    getShareLink();
  }, [calendarId]);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: image ? `url(${image})` : 'none' }}
    >
      <div className={styles.wonderBox__title}>MY WonderBox</div>
      <div className={styles.wonderBox__container}>
        <div
          className={styles.wonderBox__title}
          style={{
            color: titleColor,
            backgroundColor,
            borderColor,
            fontFamily: titleFont,
          }}
        >
          <div className={styles.wonderBox__title__inside}>{title}</div>
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
      </div>
    </div>
  );
}
