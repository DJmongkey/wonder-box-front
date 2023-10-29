import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/shared/Button';
import styles from './Signup.module.scss';
import { FiMail, FiKey, FiCheck } from 'react-icons/fi';
import Loading from '../components/shared/Loading';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const SPECIAL_CHARACTER = `!@#$%^&*()-_=+₩~\\{\\}\\[\\]\\|\\:\\;\\"\\'\\<\\>\\,.\\?\\/`;
  const navigate = useNavigate();

  function validateEmail(email) {
    const emailRegex = new RegExp(
      `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`,
    );

    if (!emailRegex.test(email)) {
      setEmailError('올바르지 않은 이메일 주소입니다.');
      return false;
    }

    setEmailError('');
    return true;
  }

  function validatePassword(password) {
    const passwordRegex = new RegExp(
      `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${SPECIAL_CHARACTER}])[A-Za-z\\d${SPECIAL_CHARACTER}]{8,16}$`,
    );

    if (!passwordRegex.test(password)) {
      setPasswordError(
        '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.',
      );
      return false;
    }

    setPasswordError('');
    return true;
  }

  function validatePasswordConfirm(password, passwordConfirm) {
    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호와 일치하지 않습니다.');
      return false;
    }

    setPasswordConfirmError('');
    return true;
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    if (name === 'email') {
      setEmail(value);
      validateEmail(value);
    } else if (name === 'password') {
      setPassword(value);
      validatePassword(value);
    } else if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      validatePasswordConfirm(password, value);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    let isEmailValid = true;
    let isPasswordValid = true;
    let isPasswordConfirmValid = true;

    if (!email) {
      setEmailError('이메일을 입력해주세요.');
      isEmailValid = false;
    } else {
      isEmailValid = validateEmail(email);
    }

    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      isPasswordValid = false;
    } else {
      isPasswordValid = validatePassword(password);
    }

    if (!passwordConfirm) {
      setPasswordConfirmError('비밀번호 확인을 입력해주세요');
      isPasswordConfirmValid = false;
    } else {
      isPasswordConfirmValid = validatePasswordConfirm(
        password,
        passwordConfirm,
      );
    }

    if (!isEmailValid || !isPasswordValid || !isPasswordConfirmValid) {
      return;
    }

    const payload = { email, password, passwordConfirm };

    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:3030/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(data.message);
      }
      setIsLoading(false);
      const data = await res.json();

      localStorage.setItem('accessToken', data.accessToken);
      navigate('/custom/base-info');
    } catch (error) {
      setIsLoading(false);
      setError(
        error.message ||
          '회원가입 처리 중 오류가 발생하였습니다. 다시 시도해 주세요.',
      );
    }
  }

  return (
    <div className={styles.container}>
      {isLoading && <Loading asOverlay />}
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.form__block}>
          <label htmlFor="email">
            <FiMail />
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            onChange={handleInputChange}
            required
          />
        </div>
        {emailError && <div className={styles.error}>{emailError}</div>}
        <div className={styles.form__block}>
          <label htmlFor="password">
            <FiKey />
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            onChange={handleInputChange}
            required
          />
        </div>
        {passwordError && <div className={styles.error}>{passwordError}</div>}
        <div className={styles.form__block}>
          <label htmlFor="passwordConfirm">
            <FiCheck />
          </label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="Password Confirm"
            onChange={handleInputChange}
            required
          />
        </div>
        {passwordConfirmError && (
          <div className={styles.error}>{passwordConfirmError}</div>
        )}
        {error && <div className={styles.error}>{error}</div>}

        <Button type="submit">회원가입</Button>
      </form>
      <div className={styles.divider}></div>
      <div className={styles.link__block}>
        <p>이미 가입하셨나요?</p>
        <Link to="/login">Awesome WonderBox 만들러가기</Link>
      </div>
    </div>
  );
}
