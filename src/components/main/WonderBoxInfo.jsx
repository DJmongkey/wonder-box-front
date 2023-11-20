import styles from './WonderBoxInfo.module.scss';

export default function WonderBoxInfo() {
  return (
    <>
      <div className={styles.bg_image}></div>
      <section className={styles.wonderBox__info}>
        <div className={styles.advent_calendar}>
          <div className={styles.advent_calendar__description}>
            <div className={styles.img__wrapper}>
              <img src="/image/advent-calendar.jpeg" alt="Advent Calendar" />
            </div>
            <div className={styles.advent_calendar__description__text}>
              <h1>What is Advent Calendar?!</h1>
              <p>
                12월 1일부터 24일 또는 25일까지 각 날짜에 해당하는 작은 문이나
                칸이 있는 달력입니다
              </p>
              <p>
                전통적으로는 종교적인 의미를 가졌으나,
                <br /> 현재는 🍭사탕, 🍫초콜릿,🪆장난감,🧴화장품 같은 다양한
                선물이 들어있어
              </p>
              <p>
                매일 하나씩 날짜 칸을 열어보며 🎁
                <br /> 🎄 크리스마스 전의 시간을 더욱더 즐겁게 보낼 수 있도록
                도와주는, 일종의 이벤트 캘린더입니다 ✨
              </p>
            </div>
          </div>
          <div className={styles.wonderBox__description}>
            <p>
              <strong className={styles.wonderBox__text}>Wonder Box</strong>는
              기간을 자유롭게 설정할 수 있는{' '}
              <strong>나만의 어드벤트 캘린더</strong>를 만들어
            </p>
            <p>
              🎅🏻 <strong>사진, 동영상, 음악, 메세지</strong>를 담아 <br />
              언제든지 소중한 사람들에게 공유할 수 있는 서비스 입니다 ❤️
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
