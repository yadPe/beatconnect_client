import React from 'react';
import injectSheet from 'react-jss';
import Tab from './Tab';
import VolumeControl from './VolumeControl';
import TasksControl from './TasksControl';
import PlayOsu from './PlayOsu';
import config from '../../../../../shared/config';

const styles = {
  SidePanel: {
    WebkitAppRegion: 'drag',
    cursor: 'default',
    userSelect: 'none',
    display: 'flex',
    position: ({ subPanel }) => (subPanel ? 'relative' : 'absolute'),
    marginTop: ({ subPanel }) => subPanel && '48px',
    flexGrow: 0,
    flexShrink: 0,
    flexDirection: 'column',
    overflow: 'visible',
    width: props => (props.expended ? props.panelExpandedLength : props.panelCompactedLength),
    height: ({ subPanel }) => (subPanel ? `calc(100vh - ${config.display.topBarHeight}px)` : '100%'),
    // backgroundColor: props => props.background,
    transition: `width ${config.display.defaultTransitionDuration}`,
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: ({ subPanel }) => (subPanel ? 2000 : 3000),
    backdropFilter: 'saturate(180%) blur(5px)',
    borderRight: 'inset 1px hsla(0,0%,100%,0.1)',
  },
  head: {
    height: config.display.topBarHeight,
  },
  svg: {
    position: 'absolute',
    padding: '8px 10px',
    top: '7px',
    left: '4px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
};

const SidePanel = ({ classes, items, expended, expendable, tasks, setExpended, subPanel }) => {
  const itemTab = () =>
    items.map((item, i) => {
      if (items.length - i === 1) {
        return (
          <>
            {!subPanel && (
              <>
                <TasksControl expended={expended} tasks={tasks} />
                <PlayOsu expended={expended} />
                <VolumeControl expended={expended} />
              </>
            )}
            <Tab {...item.props} expended={expended} />
          </>
        );
      }
      return <Tab {...item.props} expended={expended} key={i} />;
    });

  return (
    <div className={classes.SidePanel}>
      {expendable ? (
        <>
          <div className={classes.head} />
          <svg
            x="0px"
            y="0px"
            viewBox="0 0 20 12.5"
            data-radium="true"
            className={classes.svg}
            onClick={() => setExpended(!expended)}
          >
            <path
              fill="#ffffff"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0,12.5h20V11H0V12.5z M0,7h20V5.5H0V7z M0,0v1.5h20V0H0z"
            />
          </svg>
        </>
      ) : null}
      {itemTab()}
    </div>
  );
};

export default injectSheet(styles)(SidePanel);
