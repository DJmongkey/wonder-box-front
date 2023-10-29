import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import styles from './Header.module.scss';
import { useAuthContext } from '../../context/AuthContext';

export default function Header() {
  const { user, login, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      logout();
      navigate('/');
      return;
    }

    login();
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  const handleMyWonderBoxClick = () => {
    navigate('/calendars/:calendarId/share');
  };
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        WonderBox
      </Link>
      <div className={styles.buttons}>
        <Button className={styles.button} onClick={handleClick}>
          {user ? '로그아웃' : ' 로그인'}
        </Button>
        {!user ? (
          <Button className={styles.button} onClick={handleSignupClick}>
            회원가입
          </Button>
        ) : (
          <Button className={styles.button} onClick={handleMyWonderBoxClick}>
            My Wonderbox
          </Button>
        )}
        {}
      </div>
    </div>
  );
}
