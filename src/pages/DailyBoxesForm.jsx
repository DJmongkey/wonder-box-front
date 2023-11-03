import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import DailyBox from '../components/DailyBox/DailyBox';
import { useAuthContext } from '../context/AuthContext';
import Button from '../components/shared/Button';
import { calculateDateDiffer, formatDate } from '../utils/date';
import styles from './DailyBoxesForm.module.scss';
import Modal from '../components/shared/Modal';

const BASE_INFO_URL = 'http://localhost:3030/calendars';

export default function DailyBoxesForm() {
  const [localStartDate, setLocalStartDate] = useState('');
  const [localEndDate, setLocalEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [dailyBoxes, setDailyBoxes] = useState([]);
  const [localDailyBoxes, setDailyLocalDailyBoxes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const totalDays =
    calculateDateDiffer(startDate || localStartDate, endDate || localEndDate) +
    1;

  const { calendarId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const accessToken = localStorage.getItem('accessToken') || '';

  function openModal() {
    if (
      dailyBoxes.every((box) => !box) ||
      localDailyBoxes.every((box) => !box)
    ) {
      setIsModalOpen(true);
      setIsOpen(!isOpen);
    }
  }

  useEffect(() => {
    if (!calendarId) {
      navigate('/notfound');
    }

    if (!user) {
      const id = JSON.parse(localStorage.getItem(calendarId));

      if (id) {
        setLocalStartDate(id.startDate);
        setLocalEndDate(id.endDate);
      }

      const dailyBoxData = JSON.parse(localStorage.getItem('dailyBoxes')) || [];
      setDailyLocalDailyBoxes(dailyBoxData);
    }
  }, [calendarId]);

  useEffect(() => {
    if (user) {
      if (!accessToken) {
        navigate('/notfound');
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
          setCreatedAt(createdAt);
        } catch (error) {
          setError(
            error.message ||
              '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
          );
        }

        async function getAllBoxes() {
          try {
            if (!accessToken) {
              navigate('/notfound');
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
    navigate(`/custom/base-info/${calendarId}`);
  }

  function handleNextClick() {
    navigate(`/custom/style/${calendarId}`);
  }
  function generateUniqueKey(index) {
    const uuid = crypto.randomUUID();
    return `${uuid}-${index}`;
  }

  return (
    <>
      <div className={styles.dailyBoxes_container}>
        {Array.from({ length: totalDays }).map((_, index) => (
          <DailyBox
            index={index}
            key={generateUniqueKey(index)}
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
          <Button customMove={styles.moveBtn} onClick={openModal}>
            다음
            {isOpen ? (
              <Modal isOpen={isOpen}>
                <p>
                  아무것도 입력하지 않은 날짜에는 임의의 사진이 보여집니다.
                  그래도 저장하시겠습니까?
                </p>
                <button onClick={handleNextClick}>예</button>
                <button onClick={() => setIsOpen(false)}>아니요</button>
              </Modal>
            ) : null}
          </Button>
        </div>
      </div>
    </>
  );
}
