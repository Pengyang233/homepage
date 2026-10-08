// 每个调用者持有独立定时器，并可在卸载时取消待执行任务。
export default function debounce(fn, wait = 300) {
  let timer = null;
  const wrapped = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, wait);
  };
  wrapped.cancel = () => {
    clearTimeout(timer);
    timer = null;
  };
  return wrapped;
}
