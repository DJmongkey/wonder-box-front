import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import CalendarDetail from '../components/calendarList/CalendarDetail';
import Notification from '../components/shared/Notification';
import useFetchData from '../hooks/useFetchData';
import useNotification from '../hooks/useNotification';
import ERRORS from '../errors/errorMessage';
import styles from './CalendarList.module.scss';

export default function CalendarList() {
  const { fetchData, error } = useFetchData();
  const [calendars, setCalendars] = useState([]);
  const { notification, showNotification, hideNotification } =
    useNotification();

  useEffect(() => {
    async function getCalendarList() {
      try {
        const data = await fetchData(
          '/calendars',
          'GET',
          { 'Content-Type': 'application/json' },
          null,
        );

        setCalendars(data.calendars);
      } catch (error) {
        showNotification('error', ERRORS.CALENDAR.FAILED_GET);
        console.error(error);
      }
    }

    getCalendarList();
  }, []);

  async function handleDelete(deletedCalendarId) {
    try {
      await fetchData(`/calendars/${deletedCalendarId}`, 'DELETE', {}, null);

      setCalendars(
        calendars.filter(
          (calendar) => calendar.calendarId !== deletedCalendarId,
        ),
      );

      showNotification('success', ERRORS.CALENDAR.DELETE_SUCCESS);
    } catch (error) {
      showNotification('error', ERRORS.CALENDAR.FAILED_DELETE);
      console.error(error);
    }
  }

  return (
    <>
      {notification.isShown && (
        <Notification
          type={notification.type}
          message={notification.message}
          onHide={hideNotification}
        >
          <p>{notification.message}</p>
        </Notification>
      )}
      {calendars.length === 0 ? (
        <div className={styles.no_calendar}>
          <div className={styles.error__no_calendar}>
            {ERRORS.CALENDAR.EMPTY_LIST}
          </div>
          <Link to="/custom/base-info" className={styles.link}>
            만들러가기
          </Link>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.calendarList__container}>
            <h1>My WonderBox 캘린더 리스트</h1>
            <div className={styles.divider}></div>
            <ul className={styles.calendars}>
              <li className={styles.calendars__header}>
                <p className={`${styles.list__column} ${styles.title}`}>
                  캘린더 이름
                </p>
                <p className={`${styles.list__column} ${styles.creator}`}>
                  보내는 사람 이름
                </p>
                <p className={`${styles.list__column} ${styles.startDate}`}>
                  시작일
                </p>
                <p className={`${styles.list__column} ${styles.endDate}`}>
                  종료일
                </p>
                <p className={`${styles.list__column} ${styles.createdAt}`}>
                  생성일
                </p>
                <div className={`${styles.list__column} ${styles.tools}`}>
                  <p>수정</p>
                  <p>삭제</p>
                  <p>공유</p>
                </div>
              </li>
              {calendars.map((calendar) => (
                <CalendarDetail
                  key={calendar.calendarId}
                  calendar={calendar}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
            {error && <div className={styles.error}>{error}</div>}
          </div>
        </div>
      )}
    </>
  );
}
