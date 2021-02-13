import React from 'react';
import { createUseStyles } from 'react-jss';
import TextInput from '../../common/TextInput';

const useStyle = createUseStyles({});

const Header = ({ setFilter, unplayedCount, overallDration, beatmapSetCount }) => {
  const classes = useStyle();
  const handleInput = e => {
    setFilter(e.target.value);
  };
  console.log({ unplayedCount, overallDration, beatmapSetCount });
  return (
    <div className={classes.wrapper}>
      {beatmapSetCount}
      {unplayedCount}
      {overallDration}
      <TextInput onChange={handleInput} placeHolder="id, artist, title, creator" />
    </div>
  );
};

export default Header;
