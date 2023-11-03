import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ERRORS from '../errors/errorMessage';
import { redirectErrorPage } from '../errors/handleError';

export default function useFetchData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  async function fetchData(
    url,
    method = 'GET',
    headers = {},
    body = null,
    accessToken,
  ) {
    setIsLoading(true);

    if (!accessToken) {
      redirectErrorPage(navigate, undefined, ERRORS.AUTH.NOT_FOUND_TOKEN, 401);
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
        method,
        headers,
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new HttpError(data.status, data.message);
      }

      setIsLoading(false);

      return data;
    } catch (error) {
      setError(error.message);
      setIsLoading(false);

      throw error;
    }
  }

  return { fetchData, isLoading, error, navigate };
}
