import ERRORS from './errorMessage';

export function redirectErrorPage(
  navigate,
  error = {},
  message = ERRORS.PROCESS_ERR,
  status = 500,
) {
  navigate('/notfound', {
    state: {
      errorMessage: error.message || message,
      errorStatus: error.status || status,
    },
  });
}
