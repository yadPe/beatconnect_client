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
});

const Header = ({ setCurrentMode, setSearchValue }) => {
  const classes = useStyle();

  return (
    <div className={classes.wrapper}>
      <span onClick={() => setCurrentMode('localCollections')}>My collections</span>
      <span className={classes.secondItem} onClick={() => setCurrentMode('publicCollections')}>
        Public collections
      </span>
      <TextInput onChange={(e) => setSearchValue(_=>e.target.value)} placeholder="Search" />
    </div>
  );
};

export default Header;
