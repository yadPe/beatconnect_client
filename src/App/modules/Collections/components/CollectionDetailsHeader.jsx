import React from 'react';
import { createUseStyles } from 'react-jss';
import renderIcons from '../../../helpers/renderIcons';
import TextInput from '../../common/TextInput';
import useMouseButtons from '../../../helpers/hooks/useMouseButtons';
import config from '../../../../shared/config';

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
  name: {
    flexGrow: 1,
  },
});

const CollectionDeatilsHeader = ({ setFilter, quit, collectionName }) => {
  const classes = useStyle();
  useMouseButtons({ back: quit });
  const handleInput = e => {
    setFilter(e.target.value);
  };

  return (
    <div className={classes.wrapper}>
      <div title="Back" role="button" onClick={quit} className={classes.backButton}>
        {renderIcons({ name: 'Back' })}
      </div>
      <span className={classes.name}>{collectionName}</span>
      <TextInput onChange={handleInput} placeholder="id, artist, title, creator" />
    </div>
  );
};

export default CollectionDeatilsHeader;
