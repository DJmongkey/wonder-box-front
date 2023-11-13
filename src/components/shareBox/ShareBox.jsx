import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

import Modal from '../shared/Modal';
import Loading from '../shared/Loading';
import Notification from '../shared/Notification';
import useFormInput from '../../hooks/useFormInput';
import useFetchData from '../../hooks/useFetchData';
import useNotification from '../../hooks/useNotification';
import ERRORS from '../../errors/errorMessage';
import { formatDateKrTime, formatDateMMDD } from '../../utils/date';
import styles from './ShareBox.module.scss';

export default function ShareBox({ content, index, date, box, options }) {
  const initialValues = {
    text: '',
    imageFile: null,
    image: '',
    videoFile: null,
    video: '',
    audioFile: null,
    audio: '',
  };

  const {
    formData,
    updateFormData,
    previewImage,
    previewVideo,
    previewAudio,
    setPreviewImage,
    setPreviewVideo,
    setPreviewAudio,
  } = useFormInput(initialValues);

  const { font, color, bgColor } = box;

  const { isLoading, setIsLoading } = useFetchData();

  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dayCount, setDayCount] = useState(0);
  const { notification, showNotification, hideNotification } =
    useNotification();

  const displayedMedia = previewImage || previewVideo || previewAudio;

  const hasImage = previewImage || formData.image;
  const hasVideo = previewVideo || formData.video;
  const hasAudio = previewAudio || formData.audio;

  useEffect(() => {
    if (content.image) {
      setPreviewImage(content.image);
    } else {
      setPreviewImage('');
    }
    if (content.video) {
      setPreviewVideo(content.video);
    } else {
      setPreviewVideo('');
    }
    if (content.audio) {
      setPreviewAudio(content.audio);
    } else {
      setPreviewAudio('');
    }

    updateFormData({
      text: content.text || '',
      image: content.image || '',
      video: content.video || '',
      audio: content.audio || '',
    });
  }, [content]);

  function handleClickBox() {
    switch (options[0]) {
      case 'current':
        const todayDate = formatDateKrTime(Date.now());
        if (
          formatDateKrTime(date) === todayDate ||
          formatDateKrTime(date) < todayDate
        ) {
          setIsOpen(true);
          setIsBoxOpen(!isBoxOpen);
          setIsLoading(true);
        } else {
          showNotification('error', ERRORS.CALENDAR.NOT_TODAY);
        }
        break;
      case 'sequence':
        if (index === dayCount) {
          setIsOpen(true);
          setIsBoxOpen(!isBoxOpen);
        } else {
          showNotification('error', ERRORS.CALENDAR.MUST_SELECT_IN_ORDER);
        }

        if (isOpen) {
          setIsBoxOpen(!isBoxOpen);
          setIsLoading(true);
        }
        break;
      case 'anytime':
        setIsOpen(true);
        setIsBoxOpen(!isBoxOpen);
        setIsLoading(true);
        break;
      default:
        setIsOpen(!isOpen);
    }
    setIsLoading(false);
    setDayCount((count) => count + 1);
  }

  function handleModalClose() {
    setIsBoxOpen(false);
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
      <div
        className={styles.shareBox__container}
        style={{ backgroundColor: bgColor }}
        onClick={handleClickBox}
      >
        {isOpen ? (
          <div
            className={styles.shareBox__content}
            style={{ backgroundColor: bgColor, color, fontFamily: font }}
          >
            {hasImage ? (
              <img
                className={`${styles.preview__image} ${styles.preview}`}
                src={previewImage}
                alt="이미지 미리보기"
              />
            ) : hasVideo ? (
              <video
                className={`${styles.preview__video} ${styles.preview}`}
                width="400"
                height="240"
                controls
              >
                <source src={previewVideo} type="video/mp4" />
                <source src={previewVideo} type="video/webm" />
                <source src={previewAudio} type="video/ogg" />
                <source src={previewVideo} type="video/x-matroska" />
                <source src={previewVideo} type="video/quicktime" />
              </video>
            ) : hasAudio ? (
              <audio
                className={`${styles.preview__audio} ${styles.preview}`}
                controls
              >
                <source src={previewAudio} type="audio/mp3" />
                <source src={previewAudio} type="audio/mp4" />
                <source src={previewAudio} type="audio/mpeg" />
                <source src={previewAudio} type="audio/wav" />
                <source src={previewAudio} type="audio/ogg" />
              </audio>
            ) : (
              <div className={styles.shareBox__text__only}>{formData.text}</div>
            )}
            {displayedMedia && formData.text && (
              <div className={styles.shareBox__text__hover}>
                {formData.text}
              </div>
            )}
          </div>
        ) : (
          <div
            className={styles.date}
            style={{ backgroundColor: bgColor, color, fontFamily: font }}
          >
            {formatDateMMDD(date)}
          </div>
        )}
        {isLoading && <Loading />}
        {isBoxOpen && (
          <Modal isOpen={isOpen} className={styles.modal__contents}>
            <div className={styles.contents__wrapper}>
              <div onClick={handleModalClose} className={styles.icon__close}>
                <IoClose />
              </div>
              {hasImage && <img src={previewImage} alt="이미지" />}
              {hasVideo && (
                <video width="320" height="240" controls>
                  <source src={previewVideo} type="video/mp4" />
                  <source src={previewVideo} type="video/webm" />
                  <source src={previewAudio} type="video/ogg" />
                  <source src={previewVideo} type="video/x-matroska" />
                  <source src={previewVideo} type="video/quicktime" />
                </video>
              )}
              {hasAudio && (
                <audio controls>
                  <source src={previewAudio} type="audio/mp3" />
                  <source src={previewAudio} type="audio/mp4" />
                  <source src={previewAudio} type="audio/mpeg" />
                  <source src={previewAudio} type="audio/wav" />
                  <source src={previewAudio} type="audio/ogg" />
                </audio>
              )}
              <div className={styles.modal__text} style={{ fontFamily: font }}>
                {formData.text}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
}
