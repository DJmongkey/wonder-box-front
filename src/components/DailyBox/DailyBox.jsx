import { useNavigate, useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { plusDay } from '../../utils/date';
import { useAuthContext } from '../../context/AuthContext';
import { useFormContext } from '../../context/FormContext';
import styles from './DailyBox.module.scss';

const BASE_INFO_URL = 'http://localhost:3030/calendars';
const PREVIEW_IMG =
  'https://img1.daumcdn.net/thumb/R1280x0.fpng/?fname=http://t1.daumcdn.net/brunch/service/user/6n45/image/vPp4Yy5ZpPK75WFv7uJKbcLBTM4.png';

export default function DailyBox({
  existingData,
  startDate,
  index,
  localStartDate,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoFile, setVideoFile] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState('내용을 입력해주세요');
  const [error, setError] = useState('');

  const accessToken = localStorage.getItem('accessToken');

  const { calendarId } = useParams();
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { setIsDailyBoxesValid } = useFormContext();

  const userDays = startDate && plusDay(startDate, index);
  const localDays = localStartDate && plusDay(localStartDate, index);

  const dailyBoxId = existingData && existingData._id;

  useEffect(() => {
    if (existingData) {
      setImageUrl(existingData.content.image || '');
      setMessage(existingData.content.text || '');
    }
  }, [existingData]);

  function openModal() {
    setIsModalOpen(true);
  }

  function handleInputChange(event, setStateFunction) {
    const { value } = event.target;
    setStateFunction(value);
  }

  function handleFileChange(event, setFile) {
    const file = event.target.files[0];
    setFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newContent = {
      image: imageUrl || imageFile || '',
      video: videoFile || '',
      text: message || '',
      audio: audioFile || '',
    };

    setIsModalOpen(false);

    if (!user) {
      if (calendarId) {
        const existingValue = JSON.parse(localStorage.getItem(calendarId));
        const dailyBoxes = existingValue.dailyBoxes || [];

        const newDailyBox = {
          dailyBoxId: Date.now().toString(),
          date: new Date(),
          content: newContent,
          isOpen: false,
        };

        dailyBoxes[index] = newDailyBox;
        existingValue.dailyBoxes = dailyBoxes;

        localStorage.setItem(calendarId, JSON.stringify(existingValue));
      }
    }

    if (user) {
      if (!accessToken) {
        navigate('/notfound');
      }

      try {
        const formData = new FormData();

        formData.append('date', userDays);
        formData.append(
          'content',
          new Blob([JSON.stringify(newContent)], { type: 'application/json' }),
        );
        formData.append('isOpen', 'false');
        formData.append('image', imageFile);
        formData.append('audio', audioFile);
        formData.append('video', videoFile);

        const res = await fetch(`${BASE_INFO_URL}/${calendarId}/daily-boxes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
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

        const { text, image, video, audio } = data.content;

        setMessage(text);
        setImageUrl(image);
        setVideoFile(video);
        setAudioFile(audio);
        setImageFile(image);
        setIsDailyBoxesValid(true);
      } catch (error) {
        setError(
          error.message ||
            '입력 내용 저장 중 오류가 발생했습니다. 다시 시도해 주세요.',
        );
      }
    }
  }

  return (
    <div className={styles.dailyBox_container}>
      <div className={styles.day} onClick={openModal}>
        {!user && localStartDate && localDays}
        {user && userDays}
      </div>
      <div onClick={openModal}>
        {imageUrl && <img src={imageUrl} alt="image" />}
        <div>{imageUrl ? null : message}</div>
      </div>
      {isModalOpen ? (
        <Modal isOpen={isModalOpen}>
          <form className={styles.modal_form} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="image">이미지</label>
              <img src={imageUrl || PREVIEW_IMG} alt="image" />
              {user ? (
                <>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={imageUrl}
                    onChange={(event) => handleInputChange(event, setImageUrl)}
                  />
                  <input
                    type="file"
                    id="image"
                    name="image"
                    onChange={(event) => handleFileChange(event, setImageFile)}
                    className={styles.disabledInput}
                  />
                </>
              ) : (
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={imageUrl}
                  onChange={(event) => handleInputChange(event, setImageUrl)}
                />
              )}
            </div>
            <div>
              <label htmlFor="message">메시지</label>
              <textarea
                onChange={() => handleInputChange(event, setMessage)}
                value={message}
              />
            </div>
            <div>
              <label htmlFor="video">동영상</label>
              <input
                type="file"
                id="video"
                name="video"
                onChange={(event) => handleFileChange(event, setVideoFile)}
                disabled={!user}
                className={styles.disabledInput}
              />
            </div>
            <div>
              <label htmlFor="video">동영상</label>
              <input
                type="file"
                id="audio"
                name="audio"
                onChange={(event) => handleFileChange(event, setAudioFile)}
                disabled={!user}
                className={styles.disabledInput}
              />
            </div>
            <Button type="submit">저장</Button>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
