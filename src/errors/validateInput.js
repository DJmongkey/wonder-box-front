import { isDateValid } from '../utils/date';
import ERRORS from './errorMessage';

export function validateInput(name, value, formData) {
  let newFormData = { ...formData, [name]: value };

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
    default:
      return '';
  }
}
