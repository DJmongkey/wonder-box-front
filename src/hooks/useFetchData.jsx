import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ERRORS from '../errors/errorMessage';
import HttpError from '../errors/HttpError';
import { redirectErrorPage } from '../errors/handleError';
import { useAuthContext } from '../context/AuthContext';

export default function useFetchData() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { refreshAccessToken } = useAuthContext();
  const navigate = useNavigate();

  async function fetchData(url, method = 'GET', headers = {}, body = null) {
    setIsLoading(true);

    const authHeaders = {
      ...headers,
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    };

    const options = {
      method,
      headers: authHeaders,
      body,
      credentials: 'include',
    };

    try {
      let res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, options);

      if (res.status === 401) {
        const refreshed = await refreshAccessToken();

        if (!refreshed) {
          redirectErrorPage(
            navigate,
            undefined,
            ERRORS.AUTH.NOT_FOUND_TOKEN,
            401,
          );
        }

        res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, options);
      }

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

  return { fetchData, isLoading, setIsLoading, error, navigate };
}
