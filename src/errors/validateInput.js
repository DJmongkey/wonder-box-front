import { isDateValid } from '../utils/date';
import ERRORS from './errorMessage';

const imageUrlRegex = /^(ftp|http|https):\/\/[^ "]+\.(jpg|jpeg|png|gif)$/;
const imagePathRegex = /^.*\.(jpg|jpeg|png|gif)$/;

const videoUrlRegex = /^(ftp|http|https):\/\/[^ "]+\.(mp4|avi|mkv|webm|mov)$/;
const videoPathRegex = /^.*\.(mp4|avi|mkv|webm|mov)$/;

const audioUrlRegex = /^(ftp|http|https):\/\/[^ "]+\.(mpeg|mp4|wav|ogg)$/;
const audioPathRegex = /^.*\.(mpeg|mp4|wav|ogg)$/;

const fontRegex = /^[a-zA-Z\s]+$/;
const colorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

export function validateInput(name, value, formData) {
  const newFormData = { ...formData, [name]: value };

  if (name === 'startDate' || name === 'endDate') {
    if (!newFormData.startDate || !newFormData.endDate) {
      return ERRORS.CALENDAR.INVALID.DURATION;
    }
    if (!isDateValid(newFormData.startDate, newFormData.endDate)) {
      return ERRORS.CALENDAR.INVALID.MIN_DURATION;
    }
  }

  switch (name) {
    case 'title':
      if (!value) return ERRORS.CALENDAR.INVALID.TITLE;
      if (value.length < 2) return ERRORS.CALENDAR.INVALID.TITLE_LENGTH;
      return '';
    case 'creator':
      if (!value) return ERRORS.CALENDAR.INVALID.CREATOR;
      return '';
    case 'options':
      if (!value) return ERRORS.CALENDAR.INVALID.OPTION;
      return '';
    case 'image':
      if (!imageUrlRegex.test(value));
      return ERRORS.CALENDAR.INVALID_URL_PATH;
    case 'imageFile':
      if (!imagePathRegex.test(value));
      return ERRORS.CALENDAR.INVALID_FILE_TYPE;
    case 'video':
      if (!videoUrlRegex.test(value));
      return ERRORS.CALENDAR.INVALID_URL_PATH;
    case 'videoFile':
      if (!videoPathRegex.test(value));
      return ERRORS.CALENDAR.INVALID_FILE_TYPE;
      return '';
    case 'audio':
      if (!audioUrlRegex.test(value));
      return ERRORS.CALENDAR.INVALID_URL_PATH;
    case 'audioFile':
      if (!audioPathRegex.test(value));
      return ERRORS.CALENDAR.INVALID_FILE_TYPE;
    case 'color':
    case 'titleColor':
    case 'borderColor':
    case 'backgroundColor':
    case 'bgColor':
      if (!value) return ERRORS.CALENDAR.STYLE.NEED_COLOR;
      if (!colorRegex.text(value));
      return ERRORS.CALENDAR.INVALID_COLOR_CODE;
    case 'font':
    case 'titleFont':
      if (!value) return ERRORS.CALENDAR.STYLE.NEED_FONT;
      if (!fontRegex.text(value));
      return ERRORS.CALENDAR.STYLE.INVALID_FONT;

    default:
      return '';
  }
}
