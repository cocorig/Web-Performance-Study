const input = document.querySelector("input");
const defaultText = document.getElementById("default");
const debounceText = document.getElementById("debounce");
const throttleText = document.getElementById("throttle");

// const updateDebounceText = debounce((text) => {
//   debounceText.textContent = text;
// }, 500);

// const updateThrottleText = debounce((text) => {
//   throttleText.textContent = text;
// }, 500);

const updateDebounceText = debounce(() => {
  incrementCnt(debounceText);
});
const updateThrottleText = throttle(() => {
  incrementCnt(throttleText);
}, 100);

// debounce함수
function debounce(cb, delay = 1000) {
  let timeout;

  return (...args) => {
    console.log(args);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}
// throttle함수
function throttle(cb, delay = 1000) {
  let shloudWait = false;
  let waitingArgs;
  const timeoutfunc = () => {
    if (waitingArgs == null) {
      shloudWait = false;
    } else {
      cb(...waitingArgs);
      waitingArgs = null;
      setTimeout(timeoutfunc, delay);
    }
  };
  return (...args) => {
    if (shloudWait) {
      waitingArgs = args;
      return;
    }
    cb(...args);
    shloudWait = true;
    setTimeout(timeoutfunc, delay);
  };
}

input.addEventListener("input", (e) => {
  defaultText.textContent = e.target.value;
  updateDebounceText(e.target.value);
});
// 마우스 움직일 때
document.addEventListener("mousemove", (e) => {
  incrementCnt(defaultText);
  updateDebounceText();
  updateThrottleText();
});

function incrementCnt(element) {
  element.textContent = (parseInt(element.innerText) || 0) + 1;
}

//
