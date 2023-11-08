import { useNavigate } from 'react-router-dom';
import { FcEditImage, FcEmptyTrash, FcLink } from 'react-icons/fc';

import { formatDateKrTime } from '../../utils/date';
import styles from './CalendarDetail.module.scss';

export default function CalendarDetail({ calendar, onDelete }) {
  const { calendarId, title, creator, startDate, endDate, createdAt } =
    calendar;
  const navigate = useNavigate();

  function handleEdit(calendarId) {
    navigate(`/custom/base-info/${calendarId}`);
  }

  function handleShareLink(calendarId) {
    navigate(`/calendars/${calendarId}/share`);
  }

  return (
    <>
      <li className={styles.calendar}>
        <p className={`${styles.list__column} ${styles.title}`}>{title}</p>
        <p className={`${styles.list__column} ${styles.creator}`}>{creator}</p>
        <p className={`${styles.list__column} ${styles.startDate}`}>
          {formatDateKrTime(startDate)}
        </p>
        <p className={`${styles.list__column} ${styles.endDate}`}>
          {formatDateKrTime(endDate)}
        </p>
        <p className={`${styles.list__column} ${styles.createdAt}`}>
          {createdAt ? formatDateKrTime(createdAt) : '생성중📝'}
        </p>
        <div className={`${styles.list__column} ${styles.tools}`}>
          <button onClick={() => handleEdit(calendarId)}>
            <FcEditImage className={styles.icon} />
          </button>
          <button onClick={() => onDelete(calendarId)}>
            <FcEmptyTrash className={styles.icon} />
          </button>
          <button onClick={() => handleShareLink(calendarId)}>
            <FcLink className={styles.icon} />
          </button>
        </div>
      </li>
    </>
  );
}
