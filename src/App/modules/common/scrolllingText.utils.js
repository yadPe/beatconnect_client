// transition duration for 100px in px/ms
const baseScrollSpeed = 45 / 1000;

export const isOverflowing = element => {
  const { clientWidth, scrollWidth } = element;
  return scrollWidth > clientWidth;
};

export const resetScroll = element => {
  element.style.scrollBehavior = 'smooth';
  element.scrollLeft = 0;
  element.style.scrollBehavior = 'auto';
};

export const scrollToEnd = (element, onScrolled = () => {}) => {
  let startTime;
  const scroll = timestamp => {
    if (startTime === undefined) startTime = timestamp;

    const elapsed = timestamp - startTime;
    const pxToScroll = Math.ceil(elapsed * baseScrollSpeed);
    const pxToScrollLeft = element.scrollWidth - element.getBoundingClientRect().width - pxToScroll;

    element.scrollLeft = pxToScroll;

    if (pxToScrollLeft > 0) window.requestAnimationFrame(scroll);
    if (pxToScrollLeft === 0) onScrolled();
  };

  window.requestAnimationFrame(scroll);
};
