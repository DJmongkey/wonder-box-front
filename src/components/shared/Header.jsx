import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './Header.module.scss';

export default function Header() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        WonderBox
      </Link>
      <div className={styles.buttons}>
        <Button className={styles.button} onClick={handleLoginClick}>
          로그인
        </Button>
        <Button className={styles.button} onClick={handleSignupClick}>
          회원가입
        </Button>
      </div>
    </div>
  );
}
