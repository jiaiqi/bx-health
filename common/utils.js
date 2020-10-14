// 检测元素是否有某个Class
const hasClass = (el, className) => el.classList.contains(className)

// 页面平滑滚动到顶部
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

// 获取当前页面的滚动位置
const getScrollPosition = (el = window) => ({
  x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
  y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
});

// 获取当前url参数
const getURLParameters = url =>
  (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
    (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {}
  ); 5 5

/**
 * 获取两个日期之间的天数差异
 */
const getDaysDiffBetweenDates = (dateInitial, dateFinal) => {
  if (dateFinal > dateInitial) {
    return (dateFinal - dateInitial) / (1000 * 3600 * 24);
  } else {
    return (dateInitial - dateFinal) / (1000 * 3600 * 24);
  }
}

/**
 * 将字符串赋值到剪切板
 */
const copyToClipboard = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
      document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  };
}
