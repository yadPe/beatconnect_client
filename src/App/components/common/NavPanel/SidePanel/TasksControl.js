import React, { useContext } from 'react';
import injectSheet from 'react-jss';
import renderIcons from '../../../../utils/renderIcons';
import { TasksContext } from '../../../../../Providers/TasksProvider';
import store from '../../../../../store';

const styles = {
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  a: {
    margin: 'auto 0 0 0',
    display: 'flex',
    alignItems: 'center',
    // height: '44px',
    minHeight: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      background: props =>
        props.expended
          ? 'rgba(255,255,255,0.05)'
          : 'linear-gradient(to top, rgba(255,255,255,0.05) 44px, transparent 44px )',
    },
    ' &:active': {
      background: props =>
        props.expended
          ? 'rgba(255,255,255,0.05)'
          : 'linear-gradient(to top, rgba(255,255,255,0.05) 44px, transparent 44px )',
    },
    '&:hover .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:active .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:hover .tooltiptext': {
      visibility: props => (props.expended ? 'none' : 'visible'),
      opacity: props => (props.expended ? '0' : '1'),
    },
    '&:active .tooltiptext': {
      visibility: props => (props.expended ? 'none' : 'visible'),
      opacity: props => (props.expended ? '0' : '1'),
    },
  },
  span: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: '15px',
    letterSpacing: '0.4pt',
    padding: '0px 16px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
  },
  i: {
    margin: 'auto 8px 0px 0px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      animation: 'spin 3000ms infinite linear',
    },
  },
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 98,
    margin: 0,
    height: props => (props.selected ? '40px' : '0px'),
    width: '3px',
    backgroundColor: props => props.theme.color,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
    opacity: props => (props.expended ? '1' : '0'),
  },
  tooltiptext: {
    width: '120px',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    borderRadius: '6px',
    position: 'absolute',
    left: '100%',
    zIndex: 1,
    textAlign: 'left',
    padding: '0 0.6rem',
    visibility: props => (props.pop ? 'visible' : 'hidden'),
    opacity: props => (props.pop ? '1' : '0'),
  },
  divider: {
    width: '80px',
    height: '1px',
    backgroundColor: 'rgba(255,255,255, 0.05)',
  },
};

const TasksControl = ({ classes, onSelect, theme }) => {
  const { tasks } = useContext(TasksContext);
  const tasksKeys = Object.keys(tasks);
  const active = tasksKeys.length > 0;
  const renderContent = () => {
    if (active)
      return (
        <>
          {tasksKeys.map(task => (
            <div
              className="task"
              onClick={() => store.dispatch({ type: 'UPDATEACTIVESECTION', payload: tasks[task].section })}
            >
              <div className={classes.divider} />
              <div style={{ fontSize: '1rem' }}>{tasks[task].name}</div>
              <div style={{ fontSize: '0.8rem' }}>
                <div>{tasks[task].description}</div>
                <div>{tasks[task].description1}</div>
              </div>
              <div className={classes.divider} />
            </div>
          ))}
          {/* {lastTask.name ? 
      <div className='lastTask'>
        <div style={{ fontSize: '1.2rem' }}>{lastTask.name}</div>
        <div style={{ fontSize: '1rem' }}>
            <div>Terminated</div>
            <div>{lastTask.description}</div>
          </div>
      </div> : null
      
    } */}
        </>
      );
  };
  return (
    <a
      data-radium="true"
      className={classes.a}
      onClick={onSelect}
      style={{ visibility: active ? 'visible' : 'hidden' }}
    >
      <span className={`${classes.tooltiptext} tooltiptext`}>{renderContent()}</span>
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <i data-radium="true" className={classes.i}>
          {renderIcons('Loading', theme.style)}
        </i>
        <span data-radium="true" className={classes.title}>
          {renderContent()}
        </span>
      </span>
    </a>
  );
};

TasksControl.defaultProps = {
  pop: false,
};

export default injectSheet(styles)(TasksControl);
