import React from 'react';
import { createUseStyles } from 'react-jss';
import Button from '../../common/Button';
import TextInput from '../../common/TextInput';
import Toggle from '../../common/Toggle';

const useStyle = createUseStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
});

const Header = ({setCurrentMode}) => {
  const classes = useStyle();

  return (
    <div className={classes.wrapper}>
      <span onClick={() => setCurrentMode('localCollections')}>My collections</span>
      <Toggle></Toggle>
      <span onClick={() => setCurrentMode('publicCollections')}>Public collections</span>
     <TextInput onChange={() => null} placeholder="search" />
    </div>
  );
};

export default Header;
