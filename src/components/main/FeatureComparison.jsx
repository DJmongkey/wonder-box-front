import { useNavigate } from 'react-router-dom';

import Button from '../shared/Button';
import { useAuthContext } from '../../context/AuthContext';
import styles from './FeatureComparison.module.scss';

export default function FeatureComparison() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSimpleClick = () => {
    navigate('/custom/base-info');
  };

  const handleAwesomeClick = () => {
    if (user) {
      navigate('/custom/base-info');
      return;
    }

    navigate('/signup');
  };

  return (
    <table>
      <thead>
        <tr>
          <th>
            Simple Wonder Box - <span>For free</span>
          </th>
          <th>
            <Button
              customClass={styles.main__table__button}
              onClick={handleSimpleClick}
            >
              Simple Wonder Box - For free
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className={styles.td_border_right}>
            Wonder Box 어드벤트 캘린더 생성
          </td>
          <td>무제한</td>
        </tr>
        <tr>
          <td className={styles.td_border_right}>기한 설정</td>
          <td>무제한</td>
        </tr>
        <tr>
          <td className={styles.td_border_right}>업로드 가능한 미디어</td>
          <td>텍스트, 이미지</td>
        </tr>
        <tr>
          <td colSpan={2} className={styles.td_border_bottom}>
            공유 링크 생성 <strong>불가</strong> / 미리보기만 가능
          </td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th>
            Awesome Wonder Box - <span>For free</span> / 회원가입 필요
          </th>
          <th>
            <Button
              customClass={`${styles.main__table__button} ${styles.button__awesome}`}
              onClick={handleAwesomeClick}
            >
              Awesome Wonder Box 만들러 가기
            </Button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={2}>
            <strong>+ Simple Wonder Box의 모든 기능</strong>
          </td>
        </tr>
        <tr>
          <td className={styles.td_border_right}>업로드 가능한 미디어</td>
          <td>
            텍스트, 이미지, <strong>영상, 음성</strong>
          </td>
        </tr>
        <tr>
          <td colSpan={2}>
            완성된 Wonder Box 캘린더 <strong>저장</strong>, 완성 후
            <strong>수정</strong>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className={styles.td_border_bottom}>
            공유 링크 생성
          </td>
        </tr>
      </tbody>
    </table>
  );
}
