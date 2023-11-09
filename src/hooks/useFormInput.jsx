import { useState } from 'react';

import { validateInput } from '../errors/validateInput';
import ERRORS from '../errors/errorMessage';

export default function useFormInput(initialValues) {
  const [formData, setFormData] = useState(initialValues);
  const [formErrors, setFormErrors] = useState([]);
  const [inputTypes, setInputTypes] = useState({});
  const [previewImage, setPreviewImage] = useState('');
  const [previewVideo, setPreviewVideo] = useState('');
  const [previewAudio, setPreviewAudio] = useState('');

  function handleInputChange(event) {
    const { name, type, value, files } = event.target;
    const newInputTypes = { ...inputTypes };

    if (type === 'file') {
      const fileValue = files.length > 0 ? files[0] : null;

      const maxFileSize = {
        imageFile: 10 * 1024 * 1024,
        videoFile: 50 * 1024 * 1024,
        audioFile: 10 * 1024 * 1024,
      };

      if (fileValue && fileValue.size > maxFileSize[name]) {
        const limitFileSizeError = {
          imageFile: ERRORS.CALENDAR.LIMIT_MAX_SIZE_IMAGE,
          videoFile: ERRORS.CALENDAR.LIMIT_MAX_SIZE_VIDEO,
          audioFile: ERRORS.CALENDAR.LIMIT_MAX_SIZE_AUDIO,
        };

        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          [name]: limitFileSizeError[name],
        }));

        return;
      }

      const fileFieldName = name;
      const urlFieldName = name.replace('File', '');

      setFormData((prevFormData) => ({
        ...prevFormData,
        [urlFieldName]: fileValue ? '' : prevFormData[urlFieldName],
        [fileFieldName]: fileValue,
      }));

      newInputTypes[urlFieldName] = 'file';

      const previewSetter = {
        imageFile: setPreviewImage,
        videoFile: setPreviewVideo,
        audioFile: setPreviewAudio,
      };

      const setPreview = previewSetter[fileFieldName];

      if (setPreview) {
        setPreview(fileValue ? URL.createObjectURL(fileValue) : '');
      }
    } else {
      const textFieldName = name;
      const fileFieldName = `${name}File`;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [textFieldName]: value === undefined ? '' : value,
        [fileFieldName]: null,
      }));

      if (!value) {
        newInputTypes[textFieldName] = '';
      } else {
        newInputTypes[textFieldName] = 'text';
      }

      const previewSetter = {
        image: setPreviewImage,
        video: setPreviewVideo,
        audio: setPreviewAudio,
      };

      const setPreview = previewSetter[textFieldName];

      if (setPreview) {
        setPreview(value);
      }
    }

    setInputTypes(newInputTypes);

    if (['startDate', 'endDate'].includes(name)) {
      setFormErrors((prevFormErrors) => ({
        ...prevFormErrors,
        startDate: '',
        endDate: '',
      }));
    }

    const error = validateInput(name, value, {
      ...formData,
      [name]: value,
    });

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: error,
    }));
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key], formData);
      if (error) {
        isValid = false;
        newErrors[key] = error;
      }
    });

    setFormErrors(newErrors);

    return isValid;
  }

  function updateFormData(newData) {
    setFormData(newData);
  }

  function handleRemoveFile(type) {
    updateFormData({ ...formData, [`${type}File`]: null, type: '' });
    setInputTypes({ ...inputTypes, [type]: '' });

    if (type === 'image') {
      setPreviewImage('');
    } else if (type === 'video') {
      setPreviewVideo('');
    } else if (type === 'audio') {
      setPreviewAudio('');
    }

    const fileInput = document.getElementById(`${type}File`);

    if (fileInput) {
      fileInput.value = '';
    }
  }

  return {
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
  };
}
