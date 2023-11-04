import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import useFetchData from '../hooks/useFetchData';
import useFormInput from '../hooks/useFormInput';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import { calculateDateDiffer, formatDate } from '../utils/date';
import { redirectErrorPage } from '../errors/handleError';
import ERRORS from '../errors/errorMessage';
import styles from './BaseInfoForm.module.scss';

export default function BaseInfoForm() {
  const { user } = useAuthContext();
  const { calendarId } = useParams();

  const { fetchData, isLoading, setIsLoading, error, navigate } =
    useFetchData();

  const [isLoaded, setIsLoaded] = useState(false);

  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    updateFormData,
  } = useFormInput({
    title: '',
    creator: '',
    startDate: '',
    endDate: '',
    options: '',
  });

  const { title, creator, startDate, endDate, options } = formData;

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const payload = { title, creator, startDate, endDate, options };

    try {
      if (user) {
        const fetchMethod = calendarId ? 'PUT' : 'POST';
        const fetchUrl = calendarId
          ? `/calendars/${calendarId}/base-info`
          : `/calendars`;
        const fetchHeaders = {
          'Content-Type': 'application/json',
        };

        const data = await fetchData(
          fetchUrl,
          fetchMethod,
          fetchHeaders,
          JSON.stringify(payload),
        );

        const postCalendarId = await data.calendarId;

        navigate(`/custom/daily-boxes/${calendarId || postCalendarId}`);
      }

      if (!user) {
        const localCalendarId = calendarId || Date.now();
        payload.calendarId = localCalendarId;

        if (!calendarId) {
          const existingId = localStorage.getItem('id');

          if (existingId) {
            localStorage.removeItem(existingId);
          }

          localStorage.setItem('id', localCalendarId);
        }
        setIsLoading(true);

        const localData = JSON.stringify(payload);

        setTimeout(() => {
          localStorage.setItem(localCalendarId, localData);
          setIsLoading(false);
          navigate(`/custom/daily-boxes/${localCalendarId}`);
        }, 1000);
      }
    } catch (error) {
      redirectErrorPage(navigate, error);
    }
  }

  useEffect(() => {
    async function getBaseInfo() {
      try {
        const url = `/calendars/${calendarId}/base-info`;
        const data = await fetchData(url, 'GET', {}, null);

        const { title, creator, startDate, endDate, options } = data.calendar;

        updateFormData({
          title,
          creator,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          options: options[0],
        });
        setIsLoaded(true);
      } catch (error) {
        redirectErrorPage(navigate, error);
      }
    }

    function getLocalBaseInfo(calendarId) {
      const localCalendarId = localStorage.getItem('id');

      if (localCalendarId !== calendarId) {
        redirectErrorPage(navigate, undefined, ERRORS.AUTH.UNAUTHORIZED, 401);
      }
      const localBaseInfo = JSON.parse(localStorage.getItem(localCalendarId));

      if (localBaseInfo) {
        const { title, creator, startDate, endDate, options } = localBaseInfo;

        updateFormData({
          title,
          creator,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          options,
        });
      }
    }

    if (calendarId && !isLoaded) {
      if (user) {
        getBaseInfo();
      } else {
        getLocalBaseInfo(calendarId);
      }
      setIsLoaded(true);
    }
  }, [calendarId, user]);

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <form onSubmit={handleSubmit} noValidate>
        <section className={styles.baseInfoForm}>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={handleInputChange}
            label="WonderBox 이름"
            className={styles.input__block}
          />
          {formErrors.title && (
            <div className={styles.error}>{formErrors.title}</div>
          )}

          <Input
            id="creator"
            name="creator"
            value={creator}
            onChange={handleInputChange}
            label="보내는 사람"
            className={styles.input__block}
          />
          {formErrors.creator && (
            <div className={styles.error}>{formErrors.creator}</div>
          )}
          <div className={styles.input__block__date}>
            <Input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={handleInputChange}
              label="WonderBox 기간"
              className={styles.input__date}
              subText="부터"
            />
            <Input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={handleInputChange}
              className={styles.input__date}
              subText="까지"
            />
            <div className={styles.total}>
              총 <span>{calculateDateDiffer(startDate, endDate)}일</span>
            </div>
          </div>
          {(formErrors.startDate || formErrors.endDate) && (
            <div className={styles.error}>
              {formErrors.startDate || formErrors.endDate}
            </div>
          )}
          <Input />
          <div className={styles.options}>
            <Input
              type="radio"
              id="current"
              name="options"
              value="current"
              onChange={handleInputChange}
              label="실제 해당 날짜가 되어야만 열 수 있다."
              checkedOption={options === 'current'}
            />
            <Input
              type="radio"
              id="sequence"
              name="options"
              value="sequence"
              onChange={handleInputChange}
              label="날짜 순서라면 실제 시간 상관없이 열 수 있다."
              checkedOption={options === 'sequence'}
            />
            <Input
              type="radio"
              id="anytime"
              name="options"
              value="anytime"
              onChange={handleInputChange}
              label="날짜, 시간 상관없이 마음대로 열 수 있다."
              checkedOption={options === 'anytime'}
            />
          </div>
          {formErrors.options && (
            <div className={styles.error}>{formErrors.options}</div>
          )}
        </section>
        {error && <div className={styles.error}>{error}</div>}
        <Button customMove={styles.moveBtn} type="submit">
          다음
        </Button>
      </form>
    </div>
  );
}
