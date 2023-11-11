import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoPlayCircleOutline,
  IoMicOutline,
  IoClose,
  IoTrashBin,
} from 'react-icons/io5';

import Modal from '../shared/Modal';
import Button from '../shared/Button';
import Input from '../shared/Input';
import Loading from '../shared/Loading';

import { useAuthContext } from '../../context/AuthContext';
import useFetchData from '../../hooks/useFetchData';
import useFormInput from '../../hooks/useFormInput';
import { redirectErrorPage } from '../../errors/handleError';
import { formatDateMMDD } from '../../utils/date';
import styles from './DailyBox.module.scss';

const initialValues = {
  text: '',
  imageFile: null,
  image: '',
  videoFile: null,
  video: '',
  audioFile: null,
  audio: '',
};

export default function DailyBox({ dailyBoxId, date, content }) {
  const {
    formData,
    formErrors,
    handleInputChange,
    validateForm,
    updateFormData,
    inputTypes,
    previewImage,
    previewVideo,
    previewAudio,
    setPreviewImage,
    setPreviewVideo,
    setPreviewAudio,
    handleRemoveFile,
  } = useFormInput(initialValues);

  const { fetchData, isLoading, setIsLoading, error, navigate } =
    useFetchData();

  const { calendarId } = useParams();
  const { user } = useAuthContext();

  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [originalContent, setOriginalContent] = useState(content);

  const displayedMedia = previewImage || previewVideo || previewAudio;

  const hasImage = previewImage || formData.image;
  const hasVideo = previewVideo || formData.video;
  const hasAudio = previewAudio || formData.audio;

  async function handleSubmit(event) {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      if (!user) {
        const localStorageId = JSON.parse(localStorage.getItem('id'));
        const localStorageCalendar = JSON.parse(
          localStorage.getItem(localStorageId),
        );

        const localStorageDailyBox = localStorageCalendar.dailyBoxes.find(
          (box) => box.id === dailyBoxId,
        );

        setIsLoading(true);

        if (localStorageDailyBox) {
          localStorageDailyBox.content = {
            ...localStorageDailyBox.content,
            image: formData.image,
            text: formData.text,
          };

          setTimeout(() => {
            localStorage.setItem(
              localStorageId,
              JSON.stringify(localStorageCalendar),
            );
            setIsLoading(false);
          }, 1000);
        }
        setIsBoxOpen(false);
      }

      if (user) {
        const formDataToSubmit = new FormData();
        setIsLoading(true);

        formDataToSubmit.append('dailyBoxId', dailyBoxId);
        formDataToSubmit.append('content[text]', formData.text);

        if (formData.imageFile) {
          formDataToSubmit.append('image', formData.imageFile);
        } else {
          formDataToSubmit.append('content[image]', formData.image || '');
        }

        if (formData.videoFile) {
          formDataToSubmit.append('video', formData.videoFile);
        } else {
          formDataToSubmit.append('content[video]', formData.video || '');
        }

        if (formData.audioFile) {
          formDataToSubmit.append('audio', formData.audioFile);
        } else {
          formDataToSubmit.append('content[audio]', formData.audio || '');
        }

        const isPost = !Object.keys(content);

        const fetchUrl = isPost
          ? `/calendars/${calendarId}/daily-boxes`
          : `/calendars/${calendarId}/daily-boxes/${dailyBoxId}`;

        const fetchMethod = isPost ? 'POST' : 'PUT';

        await fetchData(fetchUrl, fetchMethod, {}, formDataToSubmit);

        setIsLoading(false);
      }
    } catch (error) {
      redirectErrorPage(navigate, error);
    }

    setIsBoxOpen(false);
  }

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

  useEffect(() => {
    setOriginalContent(content);
  }, [content]);

  function handleClose() {
    updateFormData({
      text: originalContent.text || '',
      image: originalContent.image || '',
      video: originalContent.video || '',
      audio: originalContent.audio || '',
    });

    setPreviewImage(originalContent.image);
    setPreviewVideo(originalContent.video);
    setPreviewAudio(originalContent.audio);

    setIsBoxOpen(false);
  }

  return (
    <div
      className={styles.dailyBox__container}
      onClick={() => setIsBoxOpen(true)}
    >
      <header className={styles.dailyBox__header}>
        <p>{formatDateMMDD(date)}</p>
        <div className={styles.displayedMedia}>
          {formData.text && <IoDocumentTextOutline className={styles.icon} />}
          {(formData.image || previewImage) && (
            <IoImageOutline className={styles.icon} />
          )}
          {(formData.video || previewVideo) && (
            <IoPlayCircleOutline className={styles.icon} />
          )}
          {(formData.audio || previewAudio) && (
            <IoMicOutline className={styles.icon} />
          )}
        </div>
      </header>
      <div className={styles.dailyBox__contents}>
        {hasImage ? (
          <img src={previewImage} alt="이미지 미리보기" />
        ) : hasVideo ? (
          <video width="320" height="240" controls>
            <source src={previewVideo} type="video/mp4" />
            <source src={previewVideo} type="video/webm" />
            <source src={previewAudio} type="video/oog" />
            <source src={previewVideo} type="video/x-matroska" />
            <source src={previewVideo} type="video/quicktime" />
          </video>
        ) : hasAudio ? (
          <audio controls>
            <source src={previewAudio} type="audio/mpeg" />
            <source src={previewAudio} type="audio/mp4" />
            <source src={previewAudio} type="audio/mp3" />
            <source src={previewAudio} type="audio/wav" />
            <source src={previewAudio} type="audio/oog" />
          </audio>
        ) : (
          <div className={styles.text__preview}>{formData.text}</div>
        )}
        {displayedMedia && formData.text && (
          <div className={styles.text__preview__hover}>{formData.text}</div>
        )}
      </div>
      {isLoading && <Loading asOverlay />}
      {isBoxOpen && (
        <Modal isOpen={isBoxOpen} className={styles.modal__contents__form}>
          <form onSubmit={handleSubmit}>
            <header>
              <p>{formatDateMMDD(date)}</p>
              <span
                className={styles.icon__close}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
              >
                <IoClose />
              </span>
            </header>
            <section>
              {user ? (
                <p className={styles.notice}>
                  <strong>파일 또는 URL</strong> 한가지만 업로드 가능 합니다.
                </p>
              ) : (
                <p className={styles.notice}>
                  비회원은 <strong>텍스트와 이미지 URL</strong>만 업로드 가능
                  합니다.
                </p>
              )}
              <div className={styles.input__block}>
                <Input
                  type="text"
                  id="image"
                  name="image"
                  value={inputTypes.image === 'text' ? formData.image : ''}
                  label="이미지"
                  onChange={handleInputChange}
                  className={styles.input__url}
                  isRequired={false}
                  isDisabled={inputTypes.image === 'file'}
                  placeholder="URL을 입력해주세요"
                />
                <Input
                  type="file"
                  id="imageFile"
                  name="imageFile"
                  accept=".jpeg, .jpg, .png, .gif"
                  onChange={handleInputChange}
                  className={styles.input__file}
                  isRequired={false}
                  isDisabled={(!user || inputTypes.image === 'text') && true}
                />
                {formErrors.image ||
                  (formErrors.imageFile && (
                    <div className={styles.error}>
                      {formErrors.image || formErrors.imageFile}
                    </div>
                  ))}
                {previewImage && (
                  <div className={styles.preview__image}>
                    <img src={previewImage} alt="이미지" />
                    <IoTrashBin
                      size="14"
                      className={styles.icon__delete}
                      onClick={() => handleRemoveFile('image')}
                    />
                  </div>
                )}
              </div>
              <Input
                type="textarea"
                id="text"
                name="text"
                value={formData.text}
                label="메시지"
                onChange={handleInputChange}
                className={`${styles.input__block} ${styles.textarea__block}`}
              />
              <div className={styles.input__block}>
                <Input
                  type="text"
                  id="video"
                  name="video"
                  label="동영상"
                  value={inputTypes.video === 'text' ? formData.video : ''}
                  onChange={handleInputChange}
                  className={styles.input__url}
                  isRequired={false}
                  isDisabled={!user || (inputTypes.video === 'file' && true)}
                  placeholder="URL을 입력해주세요"
                />
                <Input
                  type="file"
                  id="videoFile"
                  name="videoFile"
                  accept=".mp4, .webm, .ogg, .mkv, .mov"
                  onChange={handleInputChange}
                  className={styles.input__file}
                  isRequired={false}
                  isDisabled={(!user || inputTypes.video === 'text') && true}
                />
                {formErrors.video ||
                  (formErrors.videoFile && (
                    <div className={styles.error}>
                      {formErrors.video || formErrors.videoFile}
                    </div>
                  ))}
                {previewVideo && (
                  <div className={styles.preview__video}>
                    <video width="430" height="240" controls>
                      <source src={previewVideo} type="video/mp4" />
                      <source src={previewVideo} type="video/webm" />
                      <source src={previewAudio} type="video/ogg" />
                      <source src={previewVideo} type="video/x-matroska" />
                      <source src={previewVideo} type="video/quicktime" />
                      해당 브라우저에서 비디오를 재생 할 수 없습니다.
                    </video>
                    <IoTrashBin
                      size="14"
                      className={styles.icon__delete}
                      onClick={() => handleRemoveFile('video')}
                    />
                  </div>
                )}
              </div>
              <div className={styles.input__block}>
                <Input
                  type="text"
                  id="audio"
                  name="audio"
                  label="오디오"
                  value={inputTypes.audio === 'text' ? formData.audio : ''}
                  onChange={handleInputChange}
                  className={styles.input__url}
                  isRequired={false}
                  isDisabled={(!user || inputTypes.audio === 'file') && true}
                  placeholder="URL을 입력해주세요"
                />
                <Input
                  type="file"
                  id="audioFile"
                  name="audioFile"
                  accept=".mp3, .mp4, .mpeg, .wav, .ogg"
                  onChange={handleInputChange}
                  className={styles.input__file}
                  isRequired={false}
                  isDisabled={(!user || inputTypes.audio === 'text') && true}
                />
                {formErrors.audio ||
                  (formErrors.audioFile && (
                    <div className={styles.error}>
                      {formErrors.audio || formErrors.audioFile}
                    </div>
                  ))}
                {previewAudio && (
                  <div className={styles.preview__audio}>
                    <audio controls>
                      <source src={previewAudio} type="audio/mp3" />
                      <source src={previewAudio} type="audio/mp4" />
                      <source src={previewAudio} type="audio/mpeg" />
                      <source src={previewAudio} type="audio/wav" />
                      <source src={previewAudio} type="audio/ogg" />
                      해당 브라우저에서 오디오 파일을 재생 할 수 없습니다.
                    </audio>
                    <IoTrashBin
                      className={styles.icon__delete}
                      onClick={() => handleRemoveFile('audio')}
                    />
                  </div>
                )}
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <Button type="submit">저장</Button>
            </section>
          </form>
        </Modal>
      )}
    </div>
  );
}
