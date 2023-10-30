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

  const navigate = useNavigate();

  const SPECIAL_CHARACTER = `!@#$%^&*()-_=+₩~\\{\\}\\[\\]\\|\\:\\;\\"\\'\\<\\>\\,.\\?\\/`;

  const validationRules = {
    email: {
      regex: new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`),
      message: '올바르지 않은 이메일 주소입니다.',
    },
    password: {
      regex: new RegExp(
        `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[${SPECIAL_CHARACTER}])[A-Za-z\\d${SPECIAL_CHARACTER}]{8,16}$`,
      ),
      message:
        '비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자가 포함되어야 합니다.',
    },
  };

  function validateAndSetError(name, value, otherState = null) {
    const rule = validationRules[name];

    if (name === 'passwordConfirm') {
      if (value !== otherState) {
        setPasswordConfirmError('비밀번호와 일치하지 않습니다.');
        return false;
      }
      setPasswordConfirmError('');
      return true;
    }

    if (rule && !rule.regex.test(value)) {
      setErrorState(name, rule.message);
      return false;
    }
    setErrorState(name, '');
    return true;
  }

  function setErrorState(name, message) {
    if (name === 'email') setEmailError(message);
    if (name === 'password') setPasswordError(message);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
    }

    if (name === 'passwordConfirm') {
      validateAndSetError(name, value, password);
    } else {
      validateAndSetError(name, value);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isEmailValid = validateAndSetError('email', email);
    const isPasswordValid = validateAndSetError('password', password);
    const isPasswordConfirmValid = validateAndSetError(
      'passwordConfirm',
      passwordConfirm,
      password,
    );

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }
      setIsLoading(false);

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
