import { FiChevronRight } from 'react-icons/fi';

import { useFormContext } from '../../context/FormContext';
import Button from './Button';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const { isDailyBoxesValid, isStyleValid, isPreviewValid } = useFormContext();

  return (
    <nav>
      <Button to="/custom/base-info" customClass={styles.navBtn}>
        기본정보
      </Button>
      <FiChevronRight />
      <Button
        to="/custom/daily-boxes"
        customLink={styles.navBtn}
        isLinkDisabled={!isDailyBoxesValid}
        disabled={!isDailyBoxesValid}
      >
        컨텐츠
      </Button>
      <FiChevronRight />
      <Button
        to="/custom/style"
        customLink={styles.navBtn}
        isLinkDisabled={!isStyleValid}
        disabled={!isStyleValid}
      >
        스타일
      </Button>
      <FiChevronRight />
      <Button
        to="/custom/preview"
        customLink={styles.navBtn}
        isLinkDisabled={!isPreviewValid}
        disabled={!isPreviewValid}
      >
        미리보기
      </Button>
    </nav>
  );
}
