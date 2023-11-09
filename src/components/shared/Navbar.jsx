import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import { useFormContext } from '../../context/FormContext';
import Button from './Button';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { visitedTabs, setVisitedTabs } = useFormContext();
  const { calendarId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/')[2].replace('-', '');
    setVisitedTabs((prevTabs) => ({ ...prevTabs, [path]: true }));
  }, [location, setVisitedTabs]);

  return (
    <nav>
      <Button
        to={
          calendarId ? `/custom/base-info/${calendarId}` : '/custom/base-info'
        }
        customClass={styles.navBtn}
      >
        기본정보
      </Button>
      <FiChevronRight />
      <Button
        to={`/custom/daily-boxes/${calendarId}`}
        customLink={styles.navBtn}
        disabled={!visitedTabs.dailyboxes}
      >
        컨텐츠
      </Button>
      <FiChevronRight />
      <Button
        to={`/custom/style/${calendarId}`}
        customLink={styles.navBtn}
        disabled={!visitedTabs.style}
      >
        스타일
      </Button>
      <FiChevronRight />
      <Button
        to={`/custom/preview/${calendarId}`}
        customLink={styles.navBtn}
        disabled={!visitedTabs.preview}
      >
        미리보기
      </Button>
    </nav>
  );
}
