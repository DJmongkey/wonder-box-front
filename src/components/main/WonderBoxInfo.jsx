import { useNavigate } from 'react-router-dom';

import Button from '../shared/Button';
import styles from './WonderBoxInfo.module.scss';

export default function WonderBoxInfo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/custom/base-info');
  };
  return (
    <>
      <div className={styles.wonderBox_info}>
        <div>
          <p>🎄 크리스마스 어드벤트 캘린더(Advent Calendar)를 아시나요?</p>
          <p>
            12월 1일부터 24일 또는 25일까지 각 날짜에 해당하는 작은 문이나 칸이
            있는 달력입니다.🗓️
          </p>
          <p>
            🎁 매일 하나씩 다양한 선물이 들어있는 날짜 칸을 열어보며
            크리스마스까지의 시간을 더욱더 즐겁게 보낼 수 있도록 도와주는 일종의
            이벤트 캘린더입니다.
          </p>
        </div>
        <div>
          <strong>
            나만의 어드벤트 캘린더에 사진, 동영상, 음악, 메세지를 담아 소중한
            사람들에게 공유하세요 ❤️
          </strong>
        </div>
      </div>
      <div className={styles.container}>
        <div>
          Wonder Box는 <strong>무료</strong> 서비스 입니다.
          <Button customClass={styles.main__button} onClick={handleClick}>
            Simple Wonder Box - For free
          </Button>
        </div>
        <p>
          회원가입 유무에 따라 Awesome Wonder Box의 모든 기능을 이용하실 수
          있어요!
        </p>
      </div>
    </>
  );
}
