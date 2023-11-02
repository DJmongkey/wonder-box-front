import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import DailyBox from '../components/DailyBox/DailyBox';
import { calculateDateDiffer, formatDate } from '../utils/date';
import styles from './DailyBoxesForm.module.scss';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/shared/Button';

const BASE_INFO_URL = 'http://localhost:3030/calendars';

export default function DailyBoxesForm() {
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [dailyBoxes, setDailyBoxes] = useState([]);
  const [localDailyBoxes, setDailyLocalDailyBoxes] = useState([]);

  const totalDays =
    calculateDateDiffer(startDate || localStartDate, endDate || localEndDate) +
    1;

  const { calendarId } = useParams();
  const navigator = useNavigate();
  const { user } = useAuthContext();

  const accessToken = localStorage.getItem('accessToken') || '';

  useEffect(() => {
    if (!calendarId) {
      navigator('/notfound');
    }

    if (!user) {
      const idList = JSON.parse(localStorage.getItem(calendarId));

      console.log(idList);

      if (idList) {
        setLocalStartDate(idList.startDate);
        setLocalEndDate(idList.endDate);
      }

      const dailyBoxData = JSON.parse(localStorage.getItem('dailyBoxes')) || [];
      setDailyLocalDailyBoxes(dailyBoxData);
    }
  }, [calendarId]);

  useEffect(() => {
    if (user) {
      if (!accessToken) {
        navigator('/notfound');
      }
      async function getBaseInfo() {
        try {
          if (!accessToken) {
            navigate('/notfound');
          }

          const res = await fetch(`${BASE_INFO_URL}/${calendarId}/base-info`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            navigate('/notfound', {
              state: {
                errorMessage: data.message,
                errorStatus: data.status,
              },
            });
          }

          const { startDate, endDate } = data.calendar;

          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);

          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
        } catch (error) {
          setError(
            error.message ||
              '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
          );
        }

        async function getAllBoxes() {
          try {
            if (!accessToken) {
              navigator('/notfound');
            }

            const res = await fetch(
              `${BASE_INFO_URL}/${calendarId}/daily-boxes`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            const data = await res.json();

            const { dailyBoxes } = data;

            if (!res.ok) {
              navigate('/notfound', {
                state: {
                  errorMessage: data.message,
                  errorStatus: data.status,
                },
              });
            }

            setDailyBoxes(dailyBoxes);
          } catch (error) {
            setError(
              error.message ||
                '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
            );
          }
        }
        getAllBoxes();
      }
      getBaseInfo();
    }
  }, [accessToken, calendarId, user]);

  function handlePreviousClick() {
    navigator(`/custom/base-info/${calendarId}`);
  }

  function handleNextClick() {
    navigator(`/custom/style/${calendarId}`);
  }
  console.log(localDailyBoxes);
  return (
    <>
      <div className={styles.dailyBoxes_container}>
        {Array.from({ length: totalDays }).map((_, index) => (
          <DailyBox
            index={index}
            key={index}
            localStartDate={localStartDate}
            startDate={startDate}
            existingData={
              user ? dailyBoxes[index] : localDailyBoxes[index] || null
            }
          />
        ))}
      </div>
      <div className={styles.button_container}>
        <div>
          <Button onClick={handlePreviousClick} customMove={styles.moveBtn}>
            이전
          </Button>
        </div>
        <div>
          <Button customMove={styles.moveBtn} onClick={handleNextClick}>
            다음
          </Button>
        </div>
      </div>
    </>
  );
}
