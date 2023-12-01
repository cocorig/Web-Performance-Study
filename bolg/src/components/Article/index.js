import React from "react";

import "./index.css";

function zeroPad(value, len) {
  const str = "0000000000" + value.toString();
  return str.substring(str.length - len);
}
//unsplash에서 제공하는 이미지를 프로세싱 할 수 있는 파라미터,unsplash가 이미지 cdn 역할을 해줄 수 있다.
// unsplash에서 제공하는 image cdn 사용
/* 파라미터 참고: https://unsplash.com/documentation#supported-parameters */
function getParametersForUnsplash({ width, height, quality, format }) {
  return `?w=${width}&h=${height}&q=${quality}&fm=${format}&fit=crop`;
}

/*  // 병목현상 주범!!
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

  let _str = str.substring(0, 300);
  const pattern = new RegExp(`[${removeCharacters.join("\\")}]`, "g");

  ///[#\_\*\~\&\;\!\[\]\`\>\n\=\-]/g
  const modifiedString = _str.replace(pattern, "");
  return modifiedString;
  // let i = 0,
  //   j = 0;

  // for (i = 0; i < removeCharacters.length; i++) {
  //   j = 0;
  //   while (j < _str.length) {
  //     if (_str[j] === removeCharacters[i]) {
  //       _str = _str.substring(0, j).concat(_str.substring(j + 1));
  //       continue;
  //     }
  //     j++;
  //   }
  // }

  // return _str;
}

function Article(props) {
  const createdTime = new Date(props.createdTime);
  return (
    <div className={"Article"}>
      <div className={"Article__summary"}>
        <div className={"Article__summary__title"}>{props.title}</div>
        <div className={"Article__summary__desc"}>
          {removeSpecialCharacter(props.content)}
        </div>
        <div className={"Article__summary__etc"}>
          {createdTime.getFullYear() +
            "." +
            zeroPad(createdTime.getMonth() + 1, 2) +
            "." +
            zeroPad(createdTime.getDate(), 2)}
        </div>
      </div>
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
    </div>
  );
}

export default Article;
