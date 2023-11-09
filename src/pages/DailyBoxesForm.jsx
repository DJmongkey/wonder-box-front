import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import Modal from '../components/shared/Modal';
import Button from '../components/shared/Button';
import DailyBox from '../components/DailyBox/DailyBox';

import useFetchData from '../hooks/useFetchData';
import useFormInput from '../hooks/useFormInput';
import { useAuthContext } from '../context/AuthContext';
import { useFormContext } from '../context/FormContext';
import ERRORS from '../errors/errorMessage';
import styles from './DailyBoxesForm.module.scss';
import Loading from '../components/shared/Loading';
import { redirectErrorPage } from '../errors/handleError';

export default function DailyBoxesForm() {
  const { calendarId } = useParams();
  const { user } = useAuthContext();
  const { setIsDailyBoxesValid } = useFormContext();

  const { fetchData, navigate, isLoading, setIsLoading } = useFetchData();

  const { formData, validateForm, updateFormData } = useFormInput({
    startDate: '',
    endDate: '',
    dailyBoxes: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  function hasContent(box) {
    const { content } = box;

    return (
      content &&
      (content.text || content.image || content.video || content.audio)
    );
  }

  function openModal() {
    if (formData.dailyBoxes.every((box) => !hasContent(box))) {
      setIsOpen((prevIsOpen) => !prevIsOpen);
    } else if (validateForm()) {
      setIsDailyBoxesValid(true);
      navigate(`/custom/style/${calendarId}`);
    }
  }

  useEffect(() => {
    async function getAllBoxes() {
      try {
        const url = `/calendars/${calendarId}/daily-boxes`;
        const data = await fetchData(
          url,
          'GET',
          { 'Content-Type': 'application/json' },
          null,
        );

        setIsLoading(true);

        const { dailyBoxes } = data;

        updateFormData({
          startDate: dailyBoxes[0].date,
          endDate: dailyBoxes[dailyBoxes.length - 1].date,
          dailyBoxes,
        });
        setIsLoading(false);
      } catch (error) {
        redirectErrorPage(navigate, error);
      }
    }

    function getAllLocalBoxes(calendarId) {
      const localCalendarId = localStorage.getItem('id');

      if (localCalendarId !== calendarId) {
        redirectErrorPage(navigate, undefined, ERRORS.AUTH.UNAUTHORIZED, 401);
      }

      const localCalendar = JSON.parse(localStorage.getItem(localCalendarId));

      if (localCalendar) {
        const { startDate, endDate, dailyBoxes } = localCalendar;

        updateFormData({
          startDate,
          endDate,
          dailyBoxes,
        });
      }
    }

    if (user) {
      getAllBoxes();
    } else {
      getAllLocalBoxes(calendarId);
      setIsLoading(false);
    }
  }, [calendarId]);

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <div className={styles.dailyBoxes__container}>
        {formData.dailyBoxes.map((box) => (
          <DailyBox
            key={box._id || box.id}
            dailyBoxId={box._id || box.id}
            date={box.date}
            content={box.content}
          />
        ))}
      </div>
      <div className={styles.button__block}>
        <Link to={`/custom/base-info/${calendarId}`}>
          <Button customMove={styles.moveBtn}>이전</Button>
        </Link>
        <div className={styles.moveBtn} onClick={openModal}>
          다음
        </div>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} className={styles.modal__notice}>
          <p>아무것도 입력하지 않은 날짜에는 임의의 사진이 보여집니다.</p>
          <p>그래도 저장하시겠습니까?</p>
          <div className={styles.button__block}>
            <Link to={`/custom/style/${calendarId}`}>
              <Button
                customMove={styles.moveBtn}
                onClick={() => setIsDailyBoxesValid(true)}
              >
                예
              </Button>
            </Link>
            <Button
              customMove={styles.moveBtn}
              onClick={() => setIsOpen(false)}
            >
              아니요
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
