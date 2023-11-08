import { isDateValid } from '../utils/date';
import ERRORS from './errorMessage';

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

  if (
    name === 'color' ||
    name === 'titleColor' ||
    name === 'borderColor' ||
    name === 'backgroundColor' ||
    name === 'bgColor'
  ) {
    if (!value) return ERRORS.CALENDAR.STYLE.NEED_COLOR;
    if (!colorRegex.test(value)) return ERRORS.CALENDAR.INVALID_COLOR_CODE;
  }

  if (name === 'font' || name === 'titleFont') {
    if (!value) return ERRORS.CALENDAR.STYLE.NEED_FONT;
    if (!fontRegex.test(value)) return ERRORS.CALENDAR.STYLE.INVALID_FONT;
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
    default:
      return '';
  }
}
