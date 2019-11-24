import React, { useRef, useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import _ from 'underscore';
import BeatmapsPack from './BeatmapsPack';
import renderIcons from '../../utils/renderIcons';
import SkeletonPack from './BeatmapsPack/Skeleton';

const styles = {
  wrapper: {
    overflowX: 'scroll',
    scrollSnapType: 'x mandatory',
    scrollBehavior: 'smooth',
    '&::-webkit-scrollbar': {
      height: '0px',
    },
  },
  actionBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  packsContainer: {
    minWidth: 'max-content',
    minHeight: '200px',
  },
  title: {
    flex: 1,
  },
  arrows: {
    display: 'flex',
    '& > *': {
      cursor: 'pointer',
    },
    '& .next': {
      transform: 'scaleX(-1)',
    },
    '& svg': {
      display: 'block',
      margin: 'auto',
      width: '24px',
    },
  },
};

let scrollLeft = 0;
let scrollEnd = false;
let overflows = false;

const Group = ({ classes, classeName, name, packs = new Array(4).fill(0), theme, select }) => {
  const packsContainer = useRef(null);
  const listenerAttached = useRef(null);
  const [state, set] = useState({
    scrollLeft: 0,
  });
  const setState = newState => set({ ...state, ...newState });
  useEffect(() => {
    if (packsContainer.current && !listenerAttached.current) {
      packsContainer.current.parentNode.addEventListener(
        'scroll',
        _.debounce(e => setState({ scrollLeft: e.target.scrollLeft }), 200),
      );
      listenerAttached.current = true;
    }
    return () =>
      listenerAttached.current &&
      packsContainer.current.parentNode.removeEventListener(
        'scroll',
        _.debounce(e => setState({ scrollLeft: e.target.scrollLeft }), 200),
      );
  }, [packsContainer]);

  if (packsContainer.current) {
    const { scrollWidth, parentNode } = packsContainer.current;
    overflows = scrollWidth !== parentNode.offsetWidth;
    scrollLeft = parentNode.scrollLeft;
    scrollEnd = scrollWidth - parentNode.offsetWidth === parentNode.scrollLeft;
  }

  const prevButtonStyle = {
    opacity: scrollLeft ? 1 : 0.3,
  };

  const nextButtonStyle = {
    opacity: scrollEnd && overflows ? 0.3 : 1,
  };

  const handlePrevButtonClick = () => {
    if (packsContainer.current) {
      const { parentNode } = packsContainer.current;
      parentNode.scrollLeft -= 100;
    }
  };

  const handleNextButtonClick = () => {
    if (packsContainer.current) {
      const { parentNode } = packsContainer.current;
      parentNode.scrollLeft += 100;
    }
  };

  return (
    <div className={classeName}>
      <div className={classes.actionBar}>
        <h3 className={classes.title}>{name}</h3>
        <div className={classes.arrows}>
          <div className="prev" style={prevButtonStyle} onClick={handlePrevButtonClick} role="button">
            {renderIcons({ name: 'Back' })}
          </div>
          <div className="next" style={nextButtonStyle} onClick={handleNextButtonClick} role="button">
            {renderIcons({ name: 'Back' })}
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.packsContainer} ref={packsContainer}>
          {packs[0] === 0
            ? packs.map(() => <SkeletonPack />)
            : packs.map((pack, i) => (
                <BeatmapsPack pack={pack} theme={theme} index={i} select={select} key={pack.id} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default injectSheet(styles)(Group);
