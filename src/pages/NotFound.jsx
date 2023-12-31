import { useLocation } from 'react-router-dom';
import { FcHome } from 'react-icons/fc';
import { FiAlertTriangle } from 'react-icons/fi';

import Button from '../components/shared/Button';
import styles from './NotFound.module.scss';

export default function NotFound() {
  const location = useLocation();

  const errorMessage = location.state?.errorMessage || 'Not Found';
  const errorStatus = location.state?.errorStatus || '404';

  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <h2>
          <FiAlertTriangle className={styles.icon} />
          {errorStatus}
        </h2>
        <p>해당 페이지를 찾지 못했습니다</p>
        <p>주소가 잘못되었거나, 더 이상 제공하지않는 페이지입니다.</p>
      </div>
      <div className={styles.wrapper}>
        <pre className={styles.error}>{errorMessage}</pre>
        <Button to="/" customClass={styles.toMain}>
          <FcHome className={styles.home} />
          <p>메인페이지로</p>
        </Button>
      </div>
    </div>
  );
}
