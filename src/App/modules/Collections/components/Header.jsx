import React from 'react';
import { createUseStyles } from 'react-jss';
import config from '../../../../shared/config';
import TextInput from '../../common/TextInput';

const useStyle = createUseStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: `calc(100% - ${config.display.headerRightSaftyMargin}px)`,
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  secondItem: {
    flexGrow: 1,
  },
  clickable: {
    cursor: 'pointer'
  }
});

const Header = ({ setCurrentMode }) => {
  const classes = useStyle();

  const onClickPublic = () => {
    // setCurrentMode('publicCollections')
  }

  const onClickLocal = () => {
    // setCurrentMode('localCollections')
  }
  return (
    <div className={classes.wrapper}>
      <span className={classes.clickable} onClick={onClickLocal}>My collections</span>
      <span className={`${classes.secondItem} ${classes.clickable}`} onClick={onClickPublic} style={{ color: 'rgba(255,255,255,0.2)' }}>
        Public collections (WIP)
      </span>
      <TextInput onChange={() => null} placeholder="Search" />
    </div>
  );
};

export default Header;
