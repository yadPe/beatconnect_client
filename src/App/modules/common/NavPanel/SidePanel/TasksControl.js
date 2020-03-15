import React from 'react';
import { useTheme, createUseStyles } from 'react-jss';

import renderIcons from '../../../../helpers/renderIcons';
import store from '../../../../../shared/store';
import { useTasks } from '../../../../Providers/TaskProvider.bs';

const useStyle = createUseStyles({
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
      animation: '$spin 3000ms infinite linear',
    },
  },
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 98,
    margin: 0,
    height: props => (props.selected ? '40px' : '0px'),
    width: '3px',
    backgroundColor: ({ theme }) => theme.palette.primary.accent,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
    opacity: props => (props.expended ? '1' : '0'),
  },
  tooltiptext: {
    width: '120px',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
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
});

const TasksControl = ({ onSelect, ...otherProps }) => {
  const { tasks } = useTasks();
  const theme = useTheme();
  const classes = useStyle({ ...otherProps, theme });
  const active = !!tasks.length;
  const renderContent = () => {
    if (active)
      return (
        <>
          {tasks.map(task => (
            <div
              className="task"
              role="button"
              onClick={() => store.dispatch({ type: 'UPDATEACTIVESECTION', payload: task.section })}
            >
              <div className={classes.divider} />
              <div style={{ fontSize: '1rem' }}>{task.name}</div>
              <div style={{ fontSize: '0.8rem' }}>
                <div>{task.description}</div>
                <div>{task.description1}</div>
              </div>
              <div className={classes.divider} />
            </div>
          ))}
        </>
      );
  };
  return (
    <a
      data-radium="true"
      className={classes.a}
      onClick={onSelect}
      role="tab"
      style={{ visibility: active ? 'visible' : 'hidden' }}
    >
      <span className={`${classes.tooltiptext} tooltiptext`}>{renderContent()}</span>
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <i data-radium="true" className={classes.i}>
          {renderIcons({ name: 'Loading' })}
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

export default TasksControl;
