import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CalendarList() {
  const [calendars, setCalendars] = useState([]);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    async function getCalendarList() {
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/calendars`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await res.json();

        setCalendars(data.calendars);
      } catch (error) {
        console.error('캘린더 정보를 불러오는 중 에러가 발생했습니다.');
      }
    }

    getCalendarList();
  }, [accessToken]);

  function handleClickCalendar() {
    navigate(`/calendars/${calendars.calendarId}/share`);
    console.log('click');
  }

  return (
    <div>
      <h1>My WonderBox</h1>
      <ul>
        {calendars.map((calendar) => {
          const {
            calendarId: _id,
            title,
            creator,
            createdAt,
            startDate,
            endDate,
          } = calendar;

          return (
            <li key={_id}>
              <h3>{title}</h3>
              <p>{creator}</p>
              <p>{startDate}</p>
              <p>{endDate}</p>
              <p>{createdAt}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
