import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiKey } from 'react-icons/fi';

import { useAuthContext } from '../context/AuthContext';
import Button from '../components/shared/Button';
import Loading from '../components/shared/Loading';
import styles from './Login.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuthContext();

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = { email, password };

    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      setIsLoading(false);

      login(data.accessToken);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      setError(
        error.message ||
          '로그인 처리 중 오류가 발생하였습니다. 다시 시도해 주세요.',
      );
    }
  }

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <h1>Login</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.form__block}>
          <label htmlFor="email">
            <FiMail />
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.form__block}>
          <label htmlFor="password">
            <FiKey />
          </label>
          <input
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit">로그인</Button>
      </form>
      <div className={styles.divider} />
      <div className={styles.link__block}>
        <p>아직 회원이 아니신가요?</p>
        <Link to="/signup">가입하고 Awesome WonderBox 만들러가기</Link>
      </div>
    </div>
  );
}
