import { Link, useNavigate } from 'react-router-dom';

import Button from './Button';
import styles from './Header.module.scss';
import { useAuthContext } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuthContext();
  const nevigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    nevigate('/');
  };

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        WonderBox
      </Link>
      <div className={styles.buttons}>
        {user ? (
          <Button className={styles.button} onClick={handleLogoutClick}>
            로그아웃
          </Button>
        ) : (
          <Button className={styles.button} to="/login">
            로그인
          </Button>
        )}
        {!user ? (
          <Button className={styles.button} to="/signup">
            회원가입
          </Button>
        ) : (
          <Button className={styles.button} to="/calendars">
            My Wonderbox
          </Button>
        )}
        {}
      </div>
    </div>
  );
}
