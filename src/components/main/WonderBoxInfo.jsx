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
          <div>
            크리스마스 달력, 혹은 홀리데이 캘린더라고 불리는 어드벤트 캘린더를
            아시나요?
          </div>
          <div>
            12월 1일부터 24일 혹은 25일까지, 크리스마스를 기다리면서 하나씩
            선물을 열어보는 형식의 달력을 어드벤트 캘린더라고 합니다!
          </div>
        </div>
        <div>
          사진, 동영상, 메세지를 업로드해서 나만의 어드밴트 캘린더를 만들어
          소중한 사람들에게 공유하세요!
        </div>
      </div>
      <div className={styles.container}>
        <div>
          Wonder Box는 <strong>무료</strong> 서비스 입니다.
          <Button className={styles.button} onClick={handleClick}>
            Simple Wonder Box - For free
          </Button>
        </div>
        회원가입 유무에 따라 Awesome WonderBox의 모든 기능을 이용하실 수 있어요!
      </div>
    </>
  );
}
