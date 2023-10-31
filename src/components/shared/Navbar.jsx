import { useParams } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import { useFormContext } from '../../context/FormContext';
import Button from './Button';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { isDailyBoxesValid, isStyleValid, isPreviewValid } = useFormContext();
  const calendarId = useParams().calendarId;

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
        isLinkDisabled={!isDailyBoxesValid}
        disabled={!isDailyBoxesValid}
      >
        컨텐츠
      </Button>
      <FiChevronRight />
      <Button
        to={`/custom/style/${calendarId}`}
        customLink={styles.navBtn}
        isLinkDisabled={!isStyleValid}
        disabled={!isStyleValid}
      >
        스타일
      </Button>
      <FiChevronRight />
      <Button
        to={`/custom/preview/${calendarId}`}
        customLink={styles.navBtn}
        isLinkDisabled={!isPreviewValid}
        disabled={!isPreviewValid}
      >
        미리보기
      </Button>
    </nav>
  );
}
