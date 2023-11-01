import { Link, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../../context/AuthContext';
import Button from './Button';
import styles from './Header.module.scss';

export default function Header() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logo}>
        WonderBox
      </Link>
      <div className={styles.buttons}>
        {user ? (
          <Button customClass={styles.headerBtn} onClick={handleLogoutClick}>
            로그아웃
          </Button>
        ) : (
          <Button customClass={styles.headerBtn} to="/login">
            로그인
          </Button>
        )}
        {!user ? (
          <Button customClass={styles.headerBtn} to="/signup">
            회원가입
          </Button>
        ) : (
          <Button customClass={styles.headerBtn} to="/calendars">
            My WonderBox
          </Button>
        )}
        {}
      </div>
    </div>
  );
}
