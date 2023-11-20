# 목차

0. [Wonder Box 🎁](#wonder-box-🎁)
1. [프로젝트 기획 동기](#프로젝트-기획-동기)
2. [기술 스택](#기술-스택)
3. [프로젝트 기간](#프로젝트-기간)
4. [시연 영상](#시연-영상)
5. [도전 및 문제 해결](#도전-및-문제-해결)
6. [Wonder Box 실행 명령어](#wonder-box-실행-명령어)
7. [팀원 구성](#팀원-구성)

<br />

# Repository

### FrontEnd

https://github.com/DJmongkey/wonder-box-front.git

### BackEnd

https://github.com/DJmongkey/wonder-box-back.git

<br />

# Wonder Box 🎁

크리스마스의 설렘을 매일매일 느껴보세요. <br />
어드벤트 캘린더를 직접 커스텀하여 소중한 사람에게 공유할 수 있는 캘린더를 제공하는 웹 사이트입니다.

[👉🏻 WonderBox 이용해보러 가기](https://www.my-wonderbox.co.kr)

> 잠깐?! 🎄 크리스마스 어드벤트 캘린더(Advent Calendar)를 아시나요? <br />
> 12월 1일부터 24일 또는 25일까지 각 날짜에 해당하는 작은 문이나 칸이 있는 달력입니다.🗓️ <br />
> 전통적으로 종교적인 의미를 가졌으나 현재는 🍭사탕, 🍫초콜릿,🪆장난감,🧴화장품 같은 다양한 선물이 들어있어, <br />
> 매일 하나씩 열어보며 크리스마스 전의 시간을 더욱더 즐겁게 보낼 수 있도록 도와주는 일종의 이벤트 캘린더입니다.

## 프로젝트 기획 동기

마침 프로젝트 기간이 10월말 11월초이기 때문에 곧 크리스마스가 다가오기도 하고, <br />
추운 겨울이지만 따뜻한 분위기의 크리스마스를 너무 좋아했기 때문에 크리스마스 관련 프로젝트를 하고 싶었습니다. <br />
그래서 크리스마스 어드벤트 캘린더를 광범위하게 기간 한정없는 이벤트 캘린더화하여, <br />
**간단한 메세지, 사진, 동영상, 음악** 등을 담아 **언제든지 소중한 사람들에게 공유**할 수 있도록 해보자는 생각으로 제작하게 되었습니다.

<br />

## 기술 스택

### FE

- React
- React-router-dom
- SCSS
- Vercel

### BE

- Node.js
- Express
- MongoDB
- mongoose
- multer-s3
- JSON Web Token
- AWS S3
- AWS EC2

### 공통

- AWS Route53
- ESlint
- prettier

<br />

## 프로젝트 기간

2023.10.23 ~ 2023.11.12 (3주)

- 1주차 : 기획

  - 아이디어 브레인 스토밍
  - 기술 스택 결정
  - 유저 플로우 작성
  - [Mockup 작업 - Figma](https://www.figma.com/file/m7Q82R9FiYARmRADkqxs9Q/WonderBox?type=design&node-id=0%3A1&mode=design&t=c1E5CxmA7xdmqdxQ-1)
  - [DB Schema 모델링](https://lucid.app/lucidchart/c9115e46-87a1-4472-9c82-0b2f2c43a357/edit?viewport_loc=-1779%2C-350%2C2424%2C1237%2C0_0&invitationId=inv_291ff8cf-857c-4170-92b2-490f097682e1)
  - Notion 칸반 작업
  - FE/BE 셋팅

- 2~3주차 : 개발
  - 개발
  - 코드 점검
  - 리팩토링
  - 배포
  - README 작성

<br />

## 시연 영상

비인증 유저 Flow

https://github.com/DJmongkey/wonder-box-front/assets/120701125/de2d407d-ffa4-419f-9323-f2b86b7f28d4

인증 유저 Flow



<br />

## 도전 및 문제 해결

### 1. 미디어 업로드

저희가 제공하는 서비스는 인증 유저에 따라 제공되는 서비스가 달라집니다. 비인증 유저의 경우 이미지 url를 입력해서 이미지 첨부가 가능하지만, 인증 유저는 사진, 영상, 오디오 업로드가 가능합니다.

업로드된 파일을 DB에 직접 저장하면 서버 부하가 커지기 때문에 외부 저장소를 이용하기로 했고 "**AWS S3, Firebase Firestorage, Cloudinary**" 총 3가지의 후보군 중, 다양한 미디어 파일을 업로드 할 수 있어야 하고, 용량 제한에서 여유로우며, 추후 비용이 생기더라도 비용 부담이 적어야 했기 때문에 AWS S3를 선택하기로 했습니다.

업로드된 파일은 AWS S3에 저장되도록 해서, 저장된 url을 DB로 가져오기로 했습니다.
그래서 사용한 것이 multer라는 라이브러리인데, 그 중에서도 업로드한 파일을 S3로 보내주는 **multer-s3**라는 라이브러리를 사용했습니다.

S3에 업로드될 때, image, video, audio 종류별로 각 폴더에 저장되도록 로직을 짜서 파일 관리가 쉽도록 했습니다.

유효성 검사에 있어서는 가장 많이 사용되는 확장자만 업로드 되도록 함수를 만들었고,<br />
파일 용량 제한은 네이버 블로그, Github ReadMe 그리고 저희가 가지고 있는 파일들을 비교한 후, S3 무료 사용 범위 내에서 충당되도록 이미지와 음성은 10MB, 영상은 50MB로 제한 범위를 설정했습니다.

프론트에서는 url, file 각각 다른 input과 다른 미디어 타입별로 어떻게 처리해주는냐에 대한 로직을 짜야 했고,
백엔드에서는 처음 사용하는 multer 라이브러리와 S3에 대해서 이해해야 했기 때문에 이러한 부분들을 공부하고 시행착오 하는데에 있어서 꽤나 시간이 소요되었던 부분이었습니다.

### 2. 컨텐츠를 입력하는 DailyBox 생성

Wonder Box의 핵심 기능인 컨텐츠 페이지는 기본정보 페이지에서 시작 날짜부터 끝나는 날짜까지의 기간을 계산해서 날짜 박스인 데일리박스가 만들어지고 이곳에 사용자가 각 컨텐츠를 입력할 수 있는 페이지입니다.

기본정보 페이지와 컨텐츠 페이지는 형제 컴포넌트라서 기본정보 페이지에서 작성한 데이터를 가져오기 위해서는 기본정보 페이지의 데이터를 가져오는 api를 추가 호출해야 했습니다.

이미 데일리박스만의 위한 api를 호출하고 있어서 추가적인 api는 컴포넌트를 더 복잡하게 만든다는 판단이 들었습니다.

그래서 기본정보 페이지에서 날짜를 설정하면 그 설정한 날짜만큼 데일리박스가 DB에 미리 생길 수 있도록 코드를 수정했고, 이전보다 더 간편하게 데이터를 가져올 수 있었습니다.

다만 이렇게 할 경우 DB에서는 데일리박스 안의 컨텐츠 id가 생기다보니, 나중에 비인증 유저가 로그인 해서 localStorage에서 데이터를 가져와서 그 데이터를 업로드 할 때 id가 일치하지 않아 오류가 생겼습니다.

이 문제도 기본정보 페이지에서 localStorage에 저장된 데일리박스 데이터를 미리 불러와 저장하는 방식으로 해결했습니다.

### 3. 공유페이지

사용자가 Wonder Box를 만든 후, 다른 사람에게 링크를 공유하면 이 링크는 누구에게나 언제든지 완성된 Wonder Box를 확인할 수 있어합니다.

하지만 로컬 환경에서는 공유 링크로 들어오는 것이 문제가 되지 않았던 것이, <br />
배포 후에는 404에러가 뜨며 페이지를 찾을 수 없다고 하는 문제가 생겼습니다.

원인은 결국 **React가 SPA라는 기본적인 특성** 때문이었습니다.<br />
싱글 페이지 어플리케이션이기 때문에 메인 라우트에 html을 보내주면, 이곳을 기준으로 React-router-dom을 이용하여 하위 경로에 대한 라우팅을 해줍니다.

그렇기 때문에 root 경로가 아닌 곳에서 새로고침을 하거나, 새로운 탭에서 공유 링크를 입력하게 되면 해당 경로에 대한 html은 따로 존재하지 않기 때문에 브라우저는 당연히 모를 수 밖에 없었습니다.

프론트를 배포한 Vercel에서는 vercel.json을 이용하여 옵션을 지정해줄 수 있었기 때문에, root 경로에 생성해준 후 rewrites 속성을 이용하여 메인 라우터 이하로 들어오는 경로는 무조건 다시 메인 라우터로 인식하게 만들어서 html 파일이 들어오도록 해서 문제를 해결했습니다.

### 4. 배포

**Vercel로 배포한 React는 https**로 배포가 되고, **EC2로 배포한 Express는 http**로 배포가 되기 때문에 CORS 문제를 해결하기 위해 백엔드를 http에서 https로 바꿔주어야 했습니다.

AWS Route53에서 http를 https로 바꿔 줄 수 있는데 그러려면 도메인이 필요했고, 구매한 도메인은 AWS Certificate Manager를 이용해 인증서를 받아서 사용해야 했습니다.

단순히 백엔드를 https로 바꿔주자는 생각으로 구매한 도메인을 백엔드에 입히고 생각해보니, 사용자가 접하는 도메인은 프론트 배포 도메인이기 때문에 뭔가 잘못되었다는 생각이 들었습니다.

구매한 도메인은 프론트에 할당해주고, 백엔드를 위해 또다시 도메인을 구매하는 것은 불필요하기에 무료 도메인을 찾아 인증서를 받으려 했습니다.<br />
하지만 AWS certificate manager에서 인증서가 받아지지 않아서 Let's Encrypt 무료 인증서를 자동으로 발급해주는 Certbot을 사용하기 위해 조사를 하다가, 또 곰곰히 생각해보니 어차피 CORS는 origin이 동일해야 하는데 도메인이 또 달라지기 때문에 해결이 되지 않기도 하고, 이 방법은 너무 비효율적이라는 판단이 들었습니다.

그래서 다시 AWS로 돌아와 방법을 찾기 시작했습니다.<br />
그렇게 알게된 것이 Route53에서 호스팅 영역 등록시, 하나의 도메인으로 서브도메인을 설정할 수 있다는 것이 었습니다.<br />

우선 **AWS Certificate Manager**에서 도메인 인증시 \*.my-wonderbox.co.kr로 요청한 후<br />
**Route53**에서 백엔드는 api.my-wonderbox.co.kr, 프론트엔드는 www.my-wonderbox.co.kr 이렇게 설정해 주는 것이었습니다.<br />
그리고 **EC2의 로드밸런서**를 이용해서 http로 들어오는 요청들을 https로 redirection 해주고, https로 들어오면 위에서 설정한 백엔드 서브도메인으로 전달되도록 해주었습니다.

간단한 프론트 배포만 해보다가 프론트, 백엔드 모두 연결하여 배포하려다 보니 CORS 문제 등 여러가지 생각해야할 부분들이 많았고,
배포에 활용한 AWS의 기능들도 하나하나 알아야 했기에 소요된 시간도 길었고 험난했지만 덕분에 AWS의 여러 기능을 다뤄볼 수 있던던 좋은 기회였습니다.

<br />

## Wonder Box 실행 명령어

### FE

1. 프로젝트를 다운 받은 후 프로젝트 디렉토리 내부에서 다음 명령어를 입력합니다.

```shell
$ npm install
$ npm run dev
```

### BE

1. 프로젝트를 다운 받은 후 프로젝트 디렉토리 내부에서 다음 명령어를 입력합니다.

```shell
$ npm install
```

2. 디렉토리 root 위치에 .env 파일을 생성하여 환경설정을 입력합니다.

```javascript
MONGODB_URL = <YOUR_MONGO_DB_ADDRESS>
JWT_ACCESS_TOKEN_SECRET = <YOUR_ACCESS_JWT_SECRET_TOKEN>
JWT_REFRESH_TOKEN_SECRET = <YOUR_REFRESH_JWT_SECRET_TOKEN>
S3_ACCESS_KEY_ID = <YOUR_S3_ACCESS_KEY_ID>
S3_SECRET_ACCESS_KEY = <YOUR_S3_SECRET_ACCESS_KEY>
S3_REGION = <YOUR_S3_REGION>
S3_BASE_URL = <YOUR_S3_BASE_URL>
LOCAL_ORIGIN = http://localhost:<YOUR_LOCAL_PORT>
PRODUCT_ORIGIN = https://www.my-wonderbox.co.kr
```

3.

```shell
$ npm start
```

<br />

## 팀원 구성

### DJ멍키 🐶🐵

- D 🐵 - `조다희` selene.cho29@gmail.com
- J 🐶 - `이정민` yoyo3302@gmail.com
