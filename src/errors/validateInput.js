import { isDateValid } from '../utils/date';
import ERRORS from './errorMessage';

export function validateInput(name, value, formData) {
  switch (name) {
    case 'title':
      if (!value) return ERRORS.CALENDAR.INVALID.TITLE;
      if (value.length < 2) return ERRORS.CALENDAR.INVALID.TITLE_LENGTH;
      return '';
    case 'creator':
      if (!value) return ERRORS.CALENDAR.INVALID.CREATOR;
      return '';
    case 'startDate':
    case 'endDate':
      if (!formData.startDate || !formData.endDate) {
        return ERRORS.CALENDAR.INVALID.DURATION;
      }
      if (!isDateValid(formData.startDate, formData.endDate)) {
        return ERRORS.CALENDAR.INVALID.MIN_DURATION;
      }
      return '';
    case 'options':
      if (!value) return ERRORS.CALENDAR.INVALID.OPTION;
      return '';
    default:
      return '';
  }
}
