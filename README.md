# Tamagotchi Virtual Pet

레트로 휴대용 게임기를 테마로 한 브라우저 기반 가상 반려동물 육성 게임입니다. 알을 선택하고 이름을 지어 반려동물을 부화시킨 뒤, 먹이 주기·목욕·수면·미니게임으로 돌보며 성장시켜 보세요.

## 주요 기능

- **알과 이름 선택**: 클래식, 스타, 디노 알 중 하나를 고르고 반려동물 이름을 정할 수 있습니다.
- **성장과 진화**: 경험치와 레벨에 따라 알, 아기, 어린이, 청소년, 성체 단계로 성장합니다. 돌봄 기록에 따라 성체 형태가 달라집니다.
- **상태 관리**: 포만도, 행복도, 청결도, 활력을 관리합니다. 시간이 지나면 상태가 변하고, 돌봄이 부족하면 아플 수 있습니다.
- **다양한 돌봄 활동**: 먹이 주기, 목욕 및 배설물 청소, 수면, 쓰다듬기, 치료를 할 수 있습니다.
- **미니게임**: 방향 맞추기와 간식 받기 게임을 즐기며 보상과 경험치를 얻을 수 있습니다.
- **레트로 ��기 꾸미기**: 기기 색상, LCD 테마, 스캔라인, 사운드, 시뮬레이션 속도를 조절할 수 있습니다.
- **자동 저장**: 반려동물 상태를 브라우저의 `localStorage`에 저장합니다.
- **한국어 UI와 반응형 화면**: 데스크톱과 모바일 화면에서 플레이할 수 있습니다.

## 시작하기

### 필요한 환경

- [Bun](https://bun.sh/) 또는 Node.js와 npm

### 설치 및 실행

```bash
# 저장소 복제
 git clone https://github.com/ranguem/Tamagotchi_Virtual_Pet.git
cd Tamagotchi_Virtual_Pet

# 의존성 설치 (Bun)
bun install

# 개발 서버 실행
bun run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열어 플레이하세요. 개발 서버는 기본적으로 포트 `3000`을 사용합니다.

npm을 사용하는 경우에는 다음 명령으로 실행할 수 있습니다.

```bash
npm install
npm run dev
```

## 빌드 및 검사

```bash
# TypeScript 타입 검사
bun run lint

# 프로덕션 빌드
bun run build

# 프로덕션 빌드 미리보기
bun run preview
```

`npm`을 사용할 때는 `bun run` 대신 `npm run`을 사용하세요.

## 조작 방법

기기의 물리 버튼 또는 화면의 돌봄 대시보드를 이용할 수 있습니다.

| 버튼 | 동작 |
| --- | --- |
| A | 메뉴 선택 순환 |
| B | 선택한 메뉴 실행; 알 상태에서는 부화 |
| C | 미니게임 취소 또는 상태 메시지 표시 |

대시보드에서 먹이, 게임, 목욕, 수면, 치료, 쓰다듬기 등의 동작을 바로 실행할 수도 있습니다. 반려동물이 자는 중에는 일부 돌봄 동작을 사용할 수 없습니다.

## 프로젝트 구조

```text
src/
├── App.tsx                 # 게임 상태와 성장·돌봄 로직
├── components/
│   ├── BootScreen.tsx      # 부팅 화면, 알 및 이름 선택
│   ├── ControlPanel.tsx    # 상태 대시보드와 돌봄·설정 UI
│   ├── HandheldShell.tsx   # 휴대용 기기 프레임
│   ├── LcdScreen.tsx       # LCD 게임 화면
│   ├── MiniGameCatch.tsx   # 간식 받기 미니게임
│   ├── MiniGameGuess.tsx   # 방향 맞추기 미니게임
│   └── PixelSprites.tsx    # 픽셀 캐릭터 그래픽
├── types/
│   └── pet.ts              # 반려동물 및 게임 타입
└── utils/
    ├── audio.ts            # 효과음 처리
    └── storage.ts          # 저장 및 불러오기
```

## 사용 기술

- React 19, TypeScript
- Vite
- Tailwind CSS 4
- Lucide React, canvas-confetti

## 저장 데이터 초기화

게임 내 **게임 리셋** 기능을 사용하거나 브라우저 개발자 도구에서 사이트의 `localStorage` 항목 `tamapet_save_data_v1`을 삭제하면 저장 데이터를 초기화할 수 있습니다.

## 라이선스

현재 저장소에는 별도의 라이선스 파일이 포함되어 있지 않습니다.
