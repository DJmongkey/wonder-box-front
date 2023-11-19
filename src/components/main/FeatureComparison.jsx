import { useNavigate } from 'react-router-dom';
import {
  IoDocumentTextOutline,
  IoImageOutline,
  IoPlayCircleOutline,
  IoMicOutline,
} from 'react-icons/io5';

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
    <>
      <section className={styles.plan__container}>
        <h1>
          <span>Wonder Box</span>는 <strong>무료</strong> 서비스 입니다.
        </h1>
        <p>
          회원가입 유무에 따라 Awesome Wonder Box의 모든 기능을 이용하실 수
          있습니다
        </p>
        <div className={styles.plans}>
          <header className={styles.plan__header}>
            <div className={styles.plan}>
              <button
                className={styles.plan__simple}
                onClick={handleSimpleClick}
              >
                Simple
                <br /> WonderBox
              </button>
              <button
                className={styles.plan__awesome}
                onClick={handleAwesomeClick}
              >
                Awesome
                <br /> WonderBox
              </button>
            </div>
          </header>
          <table>
            <tbody>
              <tr>
                <th>회원가입</th>
                <td>X</td>
                <td>O</td>
              </tr>
              <tr>
                <th>캘린더 기간 설정</th>
                <td>무제한</td>
                <td>무제한</td>
              </tr>
              <tr>
                <th>공유 링크 생성</th>
                <td>X</td>
                <td>무제한</td>
              </tr>
              <tr>
                <th>
                  <IoDocumentTextOutline className={styles.icon} />
                  텍스트
                </th>
                <td>O</td>
                <td>O</td>
              </tr>
              <tr>
                <th>
                  <IoImageOutline className={styles.icon} />
                  이미지 URL
                </th>
                <td>O</td>
                <td>O</td>
              </tr>
              <tr>
                <th>
                  <IoImageOutline className={styles.icon} />
                  이미지 파일
                </th>
                <td>X</td>
                <td>O</td>
              </tr>
              <tr>
                <th>
                  <IoPlayCircleOutline className={styles.icon} />
                  동영상 URL, 파일
                </th>
                <td>X</td>
                <td>O</td>
              </tr>
              <tr>
                <th>
                  <IoMicOutline className={styles.icon} />
                  오디오 URL, 파일
                </th>
                <td>X</td>
                <td>O</td>
              </tr>
              <tr>
                <th>캘린더 저장</th>
                <td>X</td>
                <td>O</td>
              </tr>
              <tr>
                <th>캘린더 완성 후 수정</th>
                <td>X</td>
                <td>O</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
