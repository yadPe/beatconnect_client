import React, { useRef, useState } from 'react';
import injectSheet from 'react-jss';
import BeatmapsPack from './BeatmapsPack';
import renderIcons from '../../utils/renderIcons';

const styles = {
  Group: {},
  wrapper: {
    overflowX: 'scroll',
    scrollSnapType: 'x mandatory',
    '&::-webkit-scrollbar': {
      width: '0px',
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

const Group = ({ classes, classeName, name, packs, theme, select }) => {
  const packsContainer = useRef(null);
  // const [state, set] = useState({
  //   overflows: false,
  // });
  // const setState = newState => set({ ...state, ...newState });
  let overflows = false;
  if (packsContainer.current) {
    overflows = packsContainer.current.scrollWidth > packsContainer.current.parentNode.offsetWidth;
    console.log(overflows);
  }

  const navButtonsStyle = {
    opacity: !overflows && 0.3,
  };

  return (
    <div className={`${classes.Group} ${classeName}`}>
      <div className={classes.actionBar}>
        <h3 className={classes.title}>{name}</h3>
        <div className={classes.arrows}>
          <div className="prev" style={navButtonsStyle}>
            {renderIcons('Back')}
          </div>
          <div className="next" style={navButtonsStyle}>
            {renderIcons('Back')}
          </div>
        </div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.packsContainer} ref={packsContainer}>
          {packs.map((pack, i) => (
            <BeatmapsPack pack={pack} theme={theme} index={i} select={select} key={pack.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default injectSheet(styles)(Group);
