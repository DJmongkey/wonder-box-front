import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import { calculateDateDiffer, formatDate, isDateValid } from '../utils/date';
import styles from './BaseInfoForm.module.scss';

const BASE_INFO_URL = 'http://localhost:3030/calendars';

export default function BaseInfoForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [options, setOptions] = useState('');
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [creatorError, setCreatorError] = useState('');
  const [durationError, setDurationError] = useState('');
  const [optionsError, setOptionsError] = useState('');

  const { user } = useAuthContext();

  const navigate = useNavigate();
  const { calendarId } = useParams();

  const stateSetters = {
    title: setTitle,
    creator: setCreator,
    startDate: setStartDate,
    endDate: setEndDate,
    options: setOptions,
  };

  const errorSetters = {
    title: setTitleError,
    creator: setCreatorError,
    startDate: setDurationError,
    endDate: setDurationError,
    options: setOptionsError,
  };

  const accessToken = localStorage.getItem('accessToken');

  function handleInputChange(event) {
    const { name, value } = event.target;

    stateSetters[name](value);
    errorSetters[name]('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let isValid = true;

    if (!title) {
      setTitleError('WonderBox 이름을 입력해주세요');
      isValid = false;
    }

    if (title.length < 2) {
      setTitleError('WonderBox 이름은 최소 2자 이상이어야 합니다.');
      isValid = false;
    }

    if (!creator) {
      setCreatorError('보내는 사람의 이름을 입력해주세요');
      isValid = false;
    }

    if (!startDate || !endDate) {
      setDurationError('기간을 설정해주세요');
      isValid = false;
    }

    if ((startDate || endDate) && !isDateValid(startDate, endDate)) {
      setDurationError('시작일은 종료일보다 과거여야 합니다(최소 2일 이상)');
      isValid = false;
    }

    if (!options) {
      setOptionsError('반드시 하나의 옵션을 선택해주세요');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const createdAt = new Date();

    const payload = { title, creator, startDate, endDate, options, createdAt };

    try {
      setIsLoading(true);

      if (user) {
        if (!accessToken) {
          navigate('/notfound');
        }

        const fetchUrl = calendarId
          ? `${BASE_INFO_URL}/${calendarId}/base-info`
          : BASE_INFO_URL;

        const fetchMethod = calendarId ? 'PUT' : 'POST';

        const res = await fetch(fetchUrl, {
          method: fetchMethod,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        const postCalendarId = await data.calendarId;

        if (!res.ok) {
          navigate('/notfound', {
            state: {
              errorMessage: data.message,
              errorStatus: data.status,
            },
          });
        }

        setIsLoading(false);
        navigate(`/custom/daily-boxes/${calendarId || postCalendarId}`);
      }

      if (!user) {
        const localCalendarId = calendarId || Date.now();
        payload.calendarId = localCalendarId;

        if (!calendarId) {
          if (!localStorage.getItem('idList')) {
            localStorage.setItem('idList', JSON.stringify([]));
          }

          const existingValue = JSON.parse(localStorage.getItem('idList'));

          existingValue.push(localCalendarId);
          localStorage.setItem('idList', JSON.stringify(existingValue));
        }

        const localData = JSON.stringify(payload);

        setTimeout(() => {
          localStorage.setItem(localCalendarId, localData);
          setIsLoading(false);
          navigate(`/custom/daily-boxes/${localCalendarId}`);
        }, 1000);
      }
    } catch (error) {
      setIsLoading(false);
      setError(
        error.message ||
          '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
      );
    }
  }

  if (calendarId) {
    useEffect(() => {
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

          const { title, creator, startDate, endDate, options } = data.calendar;

          const formattedStartDate = formatDate(startDate);
          const formattedEndDate = formatDate(endDate);

          setTitle(title);
          setCreator(creator);
          setStartDate(formattedStartDate);
          setEndDate(formattedEndDate);
          setOptions(options[0]);
        } catch (error) {
          setIsLoading(false);
          setError(
            error.message ||
              '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
          );
        }
      }

      if (user) {
        getBaseInfo();
      }

      if (!user) {
        const idList = JSON.parse(localStorage.getItem('idList'));
        const localId = idList[idList.length - 1].toString();
        const localBaseInfo = JSON.parse(localStorage.getItem(localId));

        const { title, creator, startDate, endDate, options, createdAt } =
          localBaseInfo;

        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        setTitle(title);
        setCreator(creator);
        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
        setOptions(options);
      }
    }, [calendarId]);
  }

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <form onSubmit={handleSubmit} noValidate>
        <section className={styles.baseInfoForm}>
          <div className={styles.input__block}>
            <label htmlFor="title">WonderBox 이름</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleInputChange}
              required
            />
          </div>
          {titleError && <div className={styles.error}>{titleError}</div>}
          <div className={styles.input__block}>
            <label htmlFor="creator">보내는 사람</label>
            <input
              type="text"
              id="creator"
              name="creator"
              value={creator}
              onChange={handleInputChange}
              required
            />
          </div>
          {creatorError && <div className={styles.error}>{creatorError}</div>}
          <div className={styles.input__block__date}>
            <label htmlFor="startDate">WonderBox 기간</label>
            <div className={styles.date}>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={startDate}
                onChange={handleInputChange}
                required
              />
              <p>부터</p>
            </div>
            <div className={styles.date}>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={endDate}
                onChange={handleInputChange}
                required
              />
              <p>까지</p>
            </div>
            <div className={styles.total}>
              총 <span>{calculateDateDiffer(startDate, endDate)}일</span>
            </div>
          </div>
          {durationError && <div className={styles.error}>{durationError}</div>}
          <div className={styles.options}>
            <div className={styles.option__block}>
              <input
                type="radio"
                name="options"
                id="current"
                value="current"
                onChange={handleInputChange}
                checked={options === 'current'}
              />
              <label htmlFor="current">
                실제 해당 날짜가 되어야만 열 수 있다.
              </label>
            </div>
            <div className={styles.option__block}>
              <input
                type="radio"
                name="options"
                id="sequence"
                value="sequence"
                onChange={handleInputChange}
                checked={options === 'sequence'}
              />
              <label htmlFor="sequence">
                날짜 순서라면 실제 시간 상관없이 열 수 있다.
              </label>
            </div>
            <div className={styles.option__block}>
              <input
                type="radio"
                name="options"
                id="anytime"
                value="anytime"
                onChange={handleInputChange}
                checked={options === 'anytime'}
              />
              <label htmlFor="anytime">
                날짜, 시간 상관없이 마음대로 열 수 있다.
              </label>
            </div>
          </div>
          {optionsError && <div className={styles.error}>{optionsError}</div>}
        </section>
        {error && <div className={styles.error}>{error}</div>}
        <Button customMove={styles.moveBtn} type="submit">
          다음
        </Button>
      </form>
    </div>
  );
}
