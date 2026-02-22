# ★ 관광사이트 (우리나라 관광지 보기)

한국관광공사 공공 API를 사용해서 **React로 데이터를 가져와 보여주는** 웹 사이트입니다.  
초급자도 따라 할 수 있도록, 사용한 기술·**함수 목록**·파일 구조·진행 흐름을 정리했습니다.

---

## 1. 이 프로젝트를 만들게 된 이유

- **React**로 **외부 API에서 데이터를 가져오는 방법**을 연습하려고 만들었습니다.
- **한국관광공사 Tour API**를 쓰면 관광지 목록·상세 정보를 무료로 받을 수 있어서, 이 API를 호출하고 화면에 보여주는 흐름을 익히는 게 목표입니다.
- **React Router**로 "목록 페이지(/)"와 "상세 페이지(/detail/관광지ID)"를 구분합니다.

---

## 2. 사용한 기술과 기능

| 구분 | 내용 |
|------|------|
| **프레임워크/라이브러리** | React 19, Vite (빌드 도구) |
| **언어** | JavaScript (JSX) |
| **데이터 가져오기** | 브라우저 기본 **fetch()** 로 API 호출 |
| **라우터** | **React Router v7** (`react-router`). `/` = 목록, `/detail/:id` = 상세 |
| **상태 관리** | React **useState**, **useEffect** 만 사용 |
| **스타일** | CSS 파일 하나 (App.css) |

### 2-1. React Router 사용 방식

- **react-router** 패키지를 사용합니다. (v7에서는 `react-router-dom` 대신 `react-router`에서 import)
- **경로(route)**:
  - **`/`** → 목록 페이지 (**App**)
  - **`/detail/:id`** → 상세 페이지 (**Detail**). `id`는 관광지 contentId
- `main.jsx`에서 **BrowserRouter**로 감싼 뒤 **Routes**, **Route**로 위 두 경로를 연결합니다.
- 목록에서 카드 클릭 시 **navigate(`/detail/${contentId}`)** 로 이동 (페이지 새로고침 없음).
- 상세에서 뒤로가기 시 **navigate('/')** 로 목록으로 복귀.
- 상세 페이지에서는 **useParams()** 로 URL의 `:id` 값을 꺼내서 API에 넘깁니다.

### 2-2. 데이터 가져오기 (fetch)

- **목록**: `useTourList` 훅 안에서 `fetch(목록 API URL)` 호출 → JSON 파싱 → `tourList` 상태에 저장
- **상세**: `useTourDetail` 훅 안에서 `fetch(상세 API URL)` 호출 → JSON 파싱 → `tourDetail` 상태에 저장
- **검색**: `App.jsx`의 `handleSearch` 함수 안에서 `fetch(검색 API URL)` 호출 → 결과를 `searchResultList` 상태에 저장

모두 **async/await** 와 **try/catch** 로 에러 처리합니다.

---

## 3. 사용한 함수 정리 (파일별)

### 3-1. React / React DOM (전역)

| 함수 | 쓰는 곳 | 하는 일 |
|------|---------|---------|
| **StrictMode** | main.jsx | 개발 모드에서 잘못된 사용을 경고해 주는 래퍼 |
| **createRoot** | main.jsx | DOM에 React 앱을 붙이는 진입점 (React 18+ 방식) |
| **useState** | App.jsx, useTourList.js, useTourDetail.js | “값이 바뀌면 화면이 다시 그려져야 하는” 상태 저장 |
| **useEffect** | useTourList.js, useTourDetail.js | 컴포넌트 마운트·의존값 변경 시 API 호출 등 부수 효과 실행 |

### 3-2. React Router (react-router)

| 함수/컴포넌트 | 쓰는 곳 | 하는 일 |
|---------------|---------|---------|
| **BrowserRouter** | main.jsx | HTML5 History 기반 라우팅 제공 (URL과 동기화) |
| **Routes** | main.jsx | 여러 Route를 묶는 컨테이너 |
| **Route** | main.jsx | path와 보여줄 컴포넌트(element) 연결 |
| **useNavigate** | App.jsx, Detail.jsx | 클릭 시 다른 경로로 이동 (예: 상세로 가기, 목록으로 돌아가기) |
| **useParams** | Detail.jsx | URL 경로 파라미터 읽기 (예: `/detail/123` 에서 `id` = `"123"`) |

### 3-3. main.jsx

| 사용 대상 | 설명 |
|-----------|------|
| **createRoot(...).render()** | `#root`에 React 앱 렌더링 |
| **BrowserRouter**, **Routes**, **Route** | `/` → App, `/detail/:id` → Detail 라우팅 설정 |

### 3-4. App.jsx

| 함수/변수 | 종류 | 하는 일 |
|-----------|------|---------|
| **useNavigate()** | 훅 | `navigate('/detail/...')`, `navigate('/')` 로 페이지 이동 |
| **useState** | 훅 | contentTypeId, searchWord, searchResultList, searchLoading, didSearch 상태 |
| **useTourList(contentTypeId)** | 커스텀 훅 | 카테고리별 목록 API 호출 → `{ loading, error, tourList }` 반환 |
| **handleContentTypeChange(newContentTypeId)** | 함수 | 카테고리 변경 시 `setContentTypeId` 호출 |
| **handleCardClick(contentId)** | 함수 | 카드 클릭 시 `navigate(\`/detail/${contentId}\`)` 호출 |
| **handleSearch()** | 함수 | 검색어로 API 호출 → `setSearchResultList` 로 결과 저장, 로딩/에러 처리 |
| **onSearchKeyDown(e)** | 함수 | 입력창에서 Enter 누르면 `handleSearch()` 호출 |
| **getContentTypeName(contentTypeId)** | 상수 파일 함수 | 카테고리 번호 → 한글 이름 (예: 12 → '관광지') |
| **DEFAULT_CONTENT_TYPE_ID** | 상수 | 기본 카테고리 번호 (12 = 관광지) |

### 3-5. Detail.jsx

| 함수/변수 | 종류 | 하는 일 |
|-----------|------|---------|
| **useParams()** | 훅 | URL에서 `id` (관광지 contentId) 꺼내기 |
| **useNavigate()** | 훅 | `navigate('/')` 로 목록으로 돌아가기 |
| **useTourDetail(contentId)** | 커스텀 훅 | 상세 API 호출 → `{ loading, error, tourDetail }` 반환 |
| **handleBack()** | 함수 | `navigate('/')` 호출 (뒤로가기) |
| **fullAddress** | 변수 | addr1 + (addr2 있으면) 합친 주소 문자열 |
| **hasValidTel** | 변수 | 전화번호가 유효한지 여부 |
| **homepageUrl** | 변수 | 홈페이지 URL (https 없으면 앞에 붙임) |

### 3-6. useTourList.js (목록 API 훅)

| 함수 | 종류 | 하는 일 |
|------|------|---------|
| **buildApiUrl(contentTypeId)** | 내부 함수 | 카테고리 번호로 목록 API URL 생성 (`areaBasedList2`) |
| **useTourList(contentTypeId)** | export 훅 | 목록 API fetch → `{ loading, error, tourList }` 반환. `contentTypeId` 바뀔 때마다 재요청 |
| **useState** | 훅 | loading, error, tourList 상태 |
| **useEffect** | 훅 | contentTypeId 변경 시 `fetchTourList()` 실행 |
| **fetch** | 브라우저 API | API 호출 |
| **URLSearchParams** | 브라우저 API | 쿼리 스트링 만들기 |

### 3-7. useTourDetail.js (상세 API 훅)

| 함수 | 종류 | 하는 일 |
|------|------|---------|
| **buildApiUrl(contentId)** | 내부 함수 | 관광지 ID로 상세 API URL 생성 (`detailCommon2`) |
| **useTourDetail(contentId)** | export 훅 | 상세 API fetch → `{ loading, error, tourDetail }` 반환. `contentId` 바뀔 때마다 재요청 |
| **useState** | 훅 | loading, error, tourDetail 상태 |
| **useEffect** | 훅 | contentId 변경 시 `fetchTourDetail()` 실행 (contentId 없으면 요청 안 함) |
| **fetch** | 브라우저 API | API 호출 |
| **URLSearchParams** | 브라우저 API | 쿼리 스트링 만들기 |

### 3-8. TourCard.jsx

| 함수/변수 | 종류 | 하는 일 |
|-----------|------|---------|
| **tour** | props | 관광지 하나 (contentId, title, addr1, firstImage) |
| **onClick** | props | 카드 클릭 시 부모가 넘긴 콜백 (contentId 인자로 호출) |
| **handleClick()** | 함수 | `onClick(contentId)` 호출 |
| **handleImageError(e)** | 함수 | 이미지 로드 실패 시 "이미지 없음" 처리 (DOM 조작) |
| **onKeyDown** (Enter/Space) | 이벤트 | 키보드로 카드 선택 시에도 상세로 이동 |

### 3-9. CategorySelector.jsx

| 함수/변수 | 종류 | 하는 일 |
|-----------|------|---------|
| **selectedContentTypeId** | props | 현재 선택된 카테고리 번호 |
| **onChange** | props | 카테고리 버튼 클릭 시 부모가 넘긴 콜백 (새 contentTypeId 인자로 호출) |
| **CONTENT_TYPES** | 상수 import | 카테고리 번호 → 한글 이름 객체 |
| **Object.keys(CONTENT_TYPES).map(Number)** | 로직 | 버튼으로 쓸 카테고리 ID 배열 [12, 14, 15, ...] |

### 3-10. constants/contentTypes.js

| 이름 | 종류 | 하는 일 |
|------|------|---------|
| **CONTENT_TYPES** | 상수 객체 | 12→'관광지', 14→'문화시설', 39→'음식점' 등 번호↔한글 매핑 |
| **DEFAULT_CONTENT_TYPE_ID** | 상수 | 기본 카테고리 (12) |
| **getContentTypeName(contentTypeId)** | 함수 | 번호 넣으면 한글 이름 반환, 없으면 '알 수 없음' |

### 3-11. vite.config.js

| 사용 대상 | 하는 일 |
|-----------|---------|
| **defineConfig** | Vite 설정 객체 반환 |
| **react()** | Vite React 플러그인 (JSX 등 처리) |
| **server.proxy** | `/api` 요청을 `https://apis.data.go.kr` 로 넘기는 프록시. `rewrite`로 경로 앞 `/api` 제거 |

---

## 4. 프로젝트 폴더·파일 구조

```
관광사이트/
├── index.html          ← 맨 처음 뜨는 HTML (root div, main.jsx 로드)
├── package.json        ← 프로젝트 이름, 사용하는 라이브러리, npm 스크립트
├── vite.config.js      ← Vite 설정 (React 플러그인, /api 프록시)
├── .env                 ← API 키 저장 (Git에 올리면 안 됨, 직접 만듦)
├── .gitignore           ← Git 제외 목록 (node_modules, .env 등)
├── README.md            ← 이 파일
│
└── src/
    ├── main.jsx         ← 진입점. URL 보고 App / Detail 중 하나만 그림
    ├── App.jsx          ← 목록 페이지 (헤더, 검색, 카테고리, 카드 목록)
    ├── App.css          ← 전역 스타일 (헤더, 검색, 카드, 상세 페이지 스타일 포함)
    ├── Detail.jsx       ← 상세 페이지 (뒤로가기, 이미지, 주소, 전화, 홈페이지, 개요, 지도 링크)
    │
    ├── components/
    │   ├── TourCard.jsx         ← 카드 한 장 (이미지, 제목, 주소, 클릭 시 상세로 이동)
    │   └── CategorySelector.jsx ← 카테고리 버튼들 (관광지, 문화시설, 음식점 등)
    │
    ├── hooks/
    │   ├── useTourList.js   ← 목록 API 호출 → { loading, error, tourList }
    │   └── useTourDetail.js ← 상세 API 호출 → { loading, error, tourDetail }
    │
    └── constants/
        └── contentTypes.js  ← 카테고리 번호와 한글 이름 (12: 관광지, 39: 음식점 등)
```

### 4-1. 각 파일이 하는 일 (한 줄 요약)

| 파일 | 하는 일 |
|------|------|
| **index.html** | `<div id="root">` 하나 있고, `main.jsx`를 불러와서 여기다 React 앱을 그림 |
| **main.jsx** | **BrowserRouter** + **Routes** 로 `/` → App, `/detail/:id` → Detail 연결 |
| **App.jsx** | 검색창, 카테고리 선택, 목록(또는 검색 결과) 보여주기. 카드 클릭 시 **navigate(`/detail/관광지ID`)** 로 이동 |
| **Detail.jsx** | **useParams()** 로 URL의 id 꺼내서 useTourDetail(id) 호출 후, 제목·이미지·주소·전화·홈페이지·개요·지도 링크 표시. 뒤로가기는 **navigate('/')** |
| **useTourList.js** | 카테고리 번호 받아서 목록 API 호출, 결과를 `{ loading, error, tourList }` 로 반환 |
| **useTourDetail.js** | 관광지 ID 받아서 상세 API 호출, 결과를 `{ loading, error, tourDetail }` 로 반환 |
| **TourCard.jsx** | 관광지 하나(이미지, 제목, 주소)를 카드로 보여주고, 클릭하면 부모가 준 **onClick(contentId)** 호출 |
| **CategorySelector.jsx** | 카테고리 버튼들을 그려주고, 클릭하면 부모가 준 **onChange(카테고리번호)** 호출 |
| **contentTypes.js** | 12→관광지, 39→음식점 같은 "번호 ↔ 한글 이름" 매핑 + **getContentTypeName**, **DEFAULT_CONTENT_TYPE_ID** |
| **vite.config.js** | `/api` 로 시작하는 요청을 한국관광공사 API 서버(apis.data.go.kr)로 넘겨 주는 **프록시** 설정 |

---

## 5. 화면이 어떻게 진행되는지 (흐름)

1. **사용자가 사이트 접속**  
   - 주소: `http://localhost:5173/` (또는 배포 주소)  
   - `index.html` 로드 → `main.jsx` 실행

2. **main.jsx**  
   - **BrowserRouter** 안에 **Routes** / **Route** 로 경로 설정  
   - **`/`** → `<App />` (목록 페이지)  
   - **`/detail/:id`** → `<Detail />` (상세 페이지)

3. **목록 페이지 (App)**  
   - **헤더**: "★ 우리나라 관광지 보기 ★"  
   - **검색**: 입력창 + 검색 버튼. 검색하면 **handleSearch()** → fetch(검색 API) → **searchResultList**에 저장 → 검색 결과 카드로 표시  
   - **카테고리**: 관광지, 문화시설, 음식점 등 버튼. 클릭하면 **contentTypeId** 바뀜  
   - **목록**: **useTourList(contentTypeId)** 가 API 호출 → **tourList** 받아서 카드로 표시  
   - **카드 클릭**: **handleCardClick(contentId)** → **navigate(`/detail/${contentId}`)** → 상세 페이지로 이동 (새로고침 없음)

4. **상세 페이지 (Detail)**  
   - **useParams()** 로 URL의 **id** 꺼냄 (예: `/detail/123` → `id`는 `"123"`)  
   - **useTourDetail(contentId)** 로 상세 API 호출 → **tourDetail** 받음  
   - 뒤로가기, 이미지, 제목, 주소, 전화, 홈페이지 바로가기, 개요, 카카오맵 링크 표시  
   - **뒤로가기** 클릭 → **handleBack()** → **navigate('/')** → 목록으로 복귀

5. **API 호출이 일어나는 곳 정리**  
   - **목록**: **useTourList** → `GET /api/B551011/KorService2/areaBasedList2?serviceKey=...&contentTypeId=...`  
   - **상세**: **useTourDetail** → `GET /api/B551011/KorService2/detailCommon2?serviceKey=...&contentId=...`  
   - **검색**: **App.jsx**의 **handleSearch** → `GET /api/B551011/KorService2/searchKeyword2?serviceKey=...&keyword=...`  
   - 브라우저는 `/api/...` 로 요청하고, Vite **proxy**가 `https://apis.data.go.kr/...` 로 넘겨 줍니다.

---

## 6. .env 설정 (API 키)

API 키는 **코드에 직접 넣지 않고** 환경 변수로 넣습니다.  
그래서 GitHub에 올려도 키가 노출되지 않습니다.

### 6-1. .env 파일이 뭔지

- **.env** 는 "이 프로젝트만 쓰는 환경 변수"를 적어 두는 파일입니다.
- Vite는 실행할 때 이 파일을 읽고, **VITE_** 로 시작하는 변수만 프론트엔드 코드에서 쓸 수 있게 해 줍니다.
- **.gitignore** 에 `.env` 가 들어 있기 때문에, Git에 커밋되지 않습니다.

### 6-2. .env 만드는 방법

1. 프로젝트 **맨 바깥 폴더**(package.json 있는 곳)에 **.env** 라는 이름으로 파일을 만듭니다.
2. 아래 한 줄을 넣고, `여기에_실제_키` 자리에 **한국관광공사 공공 API 인증키**를 넣습니다.

```env
VITE_SERVICE_KEY=여기에_실제_키
```

3. 키 발급: [공공데이터포털](https://www.data.go.kr) → "한국관광공사" 검색 → Tour API 활용 신청 후 인증키 확인.

### 6-3. 코드에서 쓰는 방법

- **import.meta.env.VITE_SERVICE_KEY** 로 값을 읽습니다.
- 사용하는 곳:
  - **src/hooks/useTourList.js** (목록 API)
  - **src/hooks/useTourDetail.js** (상세 API)
  - **src/App.jsx** (검색 API, `API_KEY` 변수)

예시:

```js
const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY || ''
```

- **주의**: .env 를 수정했으면 **개발 서버를 한 번 껐다가 다시 켜야** 반영됩니다.

---

## 7. 실행 방법

1. **의존성 설치**  
   터미널에서 프로젝트 폴더로 이동한 뒤:

   ```bash
   npm install
   ```

2. **.env 설정**  
   위 6번처럼 `.env` 파일을 만들고 `VITE_SERVICE_KEY=실제키` 를 넣습니다.

3. **개발 서버 실행**  
   ```bash
   npm run dev
   ```  
   브라우저에서 안내하는 주소(보통 `http://localhost:5173`)로 접속합니다.

4. **빌드 (배포용 파일 만들기)**  
   ```bash
   npm run build
   ```
   `dist` 폴더에 생성된 파일을 서버에 올리면 됩니다.  
   **React Router 사용 시**: `/detail/123` 처럼 상세 URL로 직접 접속하거나 새로고침하면, 서버가 해당 경로의 파일을 찾지 못해 404가 날 수 있습니다. 정적 호스팅(GitHub Pages, Netlify 등)에서는 "모든 경로를 index.html로 보내기" 설정을 해 두어야 합니다.

5. **미리보기 (빌드 결과 로컬 확인)**  
   ```bash
   npm run preview
   ```

6. **린트**  
   ```bash
   npm run lint
   ```

---

## 8. 요약

- **React**로 화면을 만들고, **fetch**로 한국관광공사 API에서 **목록 / 상세 / 검색** 데이터를 가져옵니다.
- **React Router (react-router)** 로 **`/`**(목록)과 **`/detail/:id`**(상세)를 구분하고, **useNavigate**로 이동, **useParams**로 상세 ID를 읽습니다.
- **useState, useEffect** 로 상태와 API 호출을 처리하고, **컴포넌트·props** 로 화면을 나눴습니다.
- **.env** 에 **VITE_SERVICE_KEY** 를 넣어서 API 키를 관리하고, **vite.config.js** 의 **proxy** 로 `/api` 요청을 공공 API 서버로 넘깁니다.
- **사용한 함수**는 위 **3. 사용한 함수 정리**에서 파일별·역할별로 정리해 두었습니다.

위 구조와 함수만 이해하면, "React로 데이터 가져와서 보여주기" 흐름을 그대로 다른 API에도 적용할 수 있습니다.
