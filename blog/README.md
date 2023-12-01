## lighthouse를 사용해 성능 체크하기

## 🔥 문제 1 Properly size images

- Opportunities 부분의 Properly size images,Serve images in next-gen formats Efficiently encode images

- CDN (Contents Delivery Network) : 물리적 거리의 한계를 극복하기 위해 사용자와 가까운 곳에 컨텐츠 서버를 두는 기술

### 💡 해결방안 Image CDN (Image processing CDN)

- 이미지를 사용자에게 보내기 전에 가공 처리해서 사용자에게 이미지 전달
- 예시
  `http://cdn.image.com?src=[img src]&width=200&height=100`
  src= 실제 이미지 주소 , width, height은 원하는 이미지 크기 , 가공하려는 크기
- 직접 구축해도 되지만 , 이미지 솔루션 https://imgix.com/ 사용할 수 있다.
- 아래 예제처럼 이미지를 가져오는 매체 (unsplash, aws s3)에서 image cdn을 자체 제공해주면 이미지 cdn을 사용 할 필요는 없다.

```js
<div className={"Article__thumbnail"}>
  {/* 이미지 크기 최적화 , 렌더링된 크기의 두배로*/}
  <img
    src={
      props.image +
      getParametersForUnsplash({
        width: 240,
        height: 240,
        quality: 80,
        format: "jpg",
      })
    }
    alt="thumbnail"
  />
</div>
```

### 고화질의 이미지를 넣을 때

- 가능하면 PNG 대신 JPG 또는 WEBP 로 압축
- 이미지 로드 전후에 Layout Shift가 발생하지 안도록 영역 잡아두기
- 이미지 로딩에 대한 UX 적용 (스켈레톤, 로더 등)
- 일반적으로 이미지는 실제 화면에 렌더링 되는 사이즈의 2배 이미지로 넣어주는게 최적이다.
  (ex - 100x100 으로 화면에 넣어줘야 한다면, 200x200 이미지 사용)

<br>

- [Retina 웹 그래픽 설명 참고 1](https://www.danrodney.com/blog/retina-web-graphics-explained-1x-versus-2x-low-res-versus-hi-res/)
- [Retina 웹 그래픽 설명 참고 2](https://www.sleeplessmedia.com/2018/12/14/optimizing-website-images-and-graphics-for-retina-displays/)

### 반응형 이미지 적용 시

- 만약 이미지를 작은 화면에서는 작은 이미지를 , 큰 화면에서는 큰 이미지를 로드하고 싶다면, img 태그의 srcset과 sizes 속성을 사용하여 반응형을 구현할 수 있다.
- picture 태그(+source 태그)에서 srcset과 media 속성을 사용하여 구현할 수 있다.

- [MDN 참고자료](https://developer.mozilla.org/ko/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#%EC%95%84%ED%8A%B8_%EB%94%94%EB%A0%89%EC%85%98)

## 🔥 문제 2 . Opportunities 부분 (Minify JavaScript, reduce JS execution time)

- 개발자 도구 (성능 탭)
- 스크립트 속도를 느리게 만들었던 특정 함수를 찾아내 코드 최적화
- Minify JavaScript :자바스크립트 코드 중에 공백 또는 주석을 제거함으로써 파일의 크기 줄일 수 있다. (CRA의 경우 알아서 Minify를 해준다.)

## 💡 Bottleneck 코드 최적화

- 병목현상 주범!! (수정 전)

```js
/*
 * 파라미터로 넘어온 문자열에서 일부 특수문자를 제거하는 함수
 * (Markdown으로 된 문자열의 특수문자를 제거하기 위함)
 * */
function removeSpecialCharacter(str) {
  const removeCharacters = [
    "#",
    "_",
    "*",
    "~",
    "&",
    ";",
    "!",
    "[",
    "]",
    "`",
    ">",
    "\n",
    "=",
    "-",
  ];

  let _str = str;
  let i = 0,
    j = 0;

  for (i = 0; i < removeCharacters.length; i++) {
    j = 0;
    while (j < _str.length) {
      if (_str[j] === removeCharacters[i]) {
        _str = _str.substring(0, j).concat(_str.substring(j + 1));
        continue;
      }
      j++;
    }
  }

  return _str;
}
```

### 특수 문자를 효율적으로 제거하기

- replace 함수와 정규식 사용

```js
let _str = str.substring(0, 300);
const pattern = new RegExp(`[${removeCharacters.join("\\")}]`, "g");

///[#\_\*\~\&\;\!\[\]\`\>\n\=\-]/g
const modifiedString = _str.replace(pattern, "");
return modifiedString;
```

- 마크다운의 특수문자를 지워주는 라이브러리 사용(remove-markdown)

- 작업하는 양 줄이기

## 🔥 bundle 파일 사이즈 줄이기위해 cra-bundle-analyzer 사용

### cra-bundle-analyzer

시간 로딩 걸리는 js 파일 - 상세 내용물 보기

- 설치

```
npm install --save-dev cra-bundle-analyzer
```

- 사용

```
npx cra-bundle-analyzer
```

- 번들 파일 중에 큰 비율로 차지하고있는 패키지를 확인할 수 있다.
  - refractor라이브러리 ?? ->이 코드의 출처를 package-lock.json 파일에서 찾아보자.
    - react-syntax-highlighter 모듈에서 사용하고 있다.-> 마크다운에서 코드블록을 표시해 주는 라이브러리 -> 사용하지 않는 파일에서는 로드 시키지않고 필요한 페이지 안에서만 사용하면 되지않을까?? -> 코드 분할!

## 💡Code Splitting

- 코드를 분할하는 것
- 큰 용량의 bundle파일을 작은 상태로 쪼개서 사용하는 것
- 하나의 번들 파일을 패이지 단위로 쪼개서 내가 접속한 페이지의 모듈들만 다운로드 받아서 사용
- 당장 필요하지않는 모듈을 다운로드하지 않기 때문에 로딩 속도가 빨라진다.

- 여러가지 패턴 중 페이지 별로 코드 분할
- 페이지 별로 공통 모듈이 많다면 모듈 별로 코드 분할
- 두가지 반응 혼용
- 불필요한 코드 , 중복되는 코드가 없이 적절한 사이즈의 코드가 적절한 타이밍에 로드될 수 있도록 하는것이다.

## Code Splitting 사용하기

### 💡 Route-based code splitting

예시)

```js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// lazy는 동적으로 필요한 컴포넌트를 불러오겠다/
// 실제로 로드가 되는 시점은 정해진 주소로 접속을 했을 때 lazy에서 받은 객체 ? 로 컴포넌트를 로드하게 된다.

// Suspense
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

[리액트 코드분할 공식문서](https://legacy.reactjs.org/docs/code-splitting.html)

## 🔥 문제 3. Enable text compression (최종 배포 하기위해 빌드시)

### 텍스트 압축(Text Compression)

- 서버로 부터 텍스트 압축을 해서 받아라 -> 방법 1. 텍스트 압축 , 코드 분할

### 💡 텍스트 압축 알고리즘(파일들을 서비스해주는 서버에서 적용)

- GZIP (gzip을 적용하는 작업은 작업 리소스 대비 효율)
- Deflate

기본적으로 서버에서 압축을 하면 클라이언트 쪽에서는 압축을 해제해야한다.
압축을 해제하는데도 시간이 걸리기 때문에 파일의 크기가 2KB 이상이면 인코딩해서 전달을 하는게 좋고 그 이하면 인코딩을 하지않는 것이 좋다.

- 간단하면서 파일 사이즈를 줄일 수 있다.

### 압축 유무 확인 방법

- 네트워크 탭 -> 다운로드 되는 파일들 확인 -> 응답 헤더 -> Content-Encoding:
  gzip 있으면 압축 적용
- 번들 파일을 서비스 해주는 서버에서 압축을 적용해야 하기 때문에 리액트 설정이 아닌 serve.js의 옵션들을 확인해야한다.

- 직접 구현한 서버에서 서비스를 한다고하면 서버코드에 직접 압축을 진행해야 한다.
- 대규모 서비스에서는 공통적으로 사용하는 라우터 서버에 텍스트 압축 기능을 적용한다.

```js
 "serve": "npm run build && node ./node_modules/serve/bin/serve.js -u -s build",
```

- -u : 일반적으로 serve압축되지 않거나 압축되지 않은 콘텐츠를 제공하는 명령과 함께 사용.
  압축되지 않은 원본 형식의 파일을 제공한다.
- -s : "단일 페이지 애플리케이션" 모드를 나타낸다.
- 실제 빌드환경 실행
- serve : 단일 페이지 애플리케이션(SPA)에 적합한 방식으로 라우팅을 처리하도록 서버를 구성한다.
  -u명령 과 -s플래그를 조합하면 serve단일 페이지 애플리케이션 컨텍스트에서 압축되지 않은 파일을 제공하고 경로를 적절하게 처리할 수 있다.

  - 최종적인 성능 측정은 실제 서비스되는 프로덕션환경에서 측정

- 코드 변경시 다시 빌드 진행

```
npm run build
```

```
npm run serve
```

<details><summary>추가 설명
</summary>

- 1. 웹팩 플러그인 (빌드 타임에 적용)

  - `Minify` : 실제 코드 실행에 불필요한 공백, 주석 등을 제거하는 작업
    let test1 = 123;
    const test2 = 234;

  ---> let test=123;const b=234;
  공백과 개행을 모두 제거했지만 코드 실행에는 아무 문제 없습니다.

  - `Uglify(난독화)` : 코드의 변수명이나 함수명등을 알아보기 힘들게 바꾸는 작업
    let veryImportantValue = 123;

  ---> let a = 123;
  보안성 강화 + 긴 변수명 또는 함수명을 짦게 바꿔줘서 최적화 효과도 있음

- 2. 텍스트 자체를 압축 (네트워크 상에서 적용)

  - `Compress` : 네트워크 전송 시, 텍스트 데이터 자체를 압축하는 작업
    쉽게 생각해서 zip으로 압축하듯이 압축한다고 생각하시면 됩니다.
    일반적인 텍스트 파일(html, js, css 등)들은 압축을 통해 사이즈를 줄일 수 있습니다.
    웹에서 사용하는 압축방식은 gzip입니다.
    텍스트의 패턴에 따라 많게는 1/10, 적게는 1/5까지 사이즈가 줄어듭

- 최종적으로 모두 적용하는 것이 효율적이다.

  </details>
