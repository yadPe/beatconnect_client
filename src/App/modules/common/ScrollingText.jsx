import React, { useLayoutEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { isOverflowing, resetScroll, scrollToEnd } from './scrolllingText.utils';

const useStyle = createUseStyles({
  wrapper: {
    whiteSpace: 'nowrap',
    maxWidth: props => props.maxWidth,
    display: props => (props.visible ? 'block' : 'none'),
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
});

const clearTimeouts = (...timeoutsRef) => {
  timeoutsRef.forEach(timeoutRef => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  });
};

const ScrollingText = ({ maxWidth = 0, text = '', visible = true }) => {
  const classes = useStyle({ maxWidth, visible });

  const wrapperRef = useRef();
  const timeoutId = useRef();
  const timeoutId2 = useRef();

  useLayoutEffect(() => {
    if (wrapperRef.current && visible) {
      clearTimeouts(timeoutId, timeoutId2);
      const onScrollFinish = () => {
        clearTimeouts(timeoutId, timeoutId2);
        timeoutId.current = setTimeout(() => {
          resetScroll(wrapperRef.current);
          timeoutId2.current = setTimeout(() => scrollToEnd(wrapperRef.current, onScrollFinish), 500);
        }, 500);
      };

      if (isOverflowing(wrapperRef.current)) scrollToEnd(wrapperRef.current, onScrollFinish);
    }
    return () => {
      if (wrapperRef.current && visible) resetScroll(wrapperRef.current);
      clearTimeouts(timeoutId, timeoutId2);
    };
  }, [text, visible]);

  return (
    <div className={classes.wrapper} ref={wrapperRef}>
      <span>{text}</span>
    </div>
  );
};

export default ScrollingText;
