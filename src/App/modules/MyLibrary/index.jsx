import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../shared/config';
import AllBeatmapsCollection from './components/AllBeatmaps';
import Collection from './components/Collection';

const useStyle = createUseStyles({
  myLibraryWrapper: {
    paddingTop: `${config.display.topBarHeight}px`,
    marginTop: '1rem',
    marginBottom: '1rem',
  },
  collections: {
    marginLeft: '4px',
    display: 'grid',
    gridGap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 0.1fr));',
    justifyContent: 'space-around',
  },
});

const MyLibrary = ({ setHeaderContent, collections }) => {
  const classes = useStyle();
  return (
    <div className={classes.myLibraryWrapper}>
      <div className={classes.collections}>
        <AllBeatmapsCollection />
        {Object.entries(collections).map(([name, beatmapsHash]) => (
          <Collection key={`${name}${beatmapsHash.length}`} name={name} beatmapsHash={beatmapsHash} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = ({ app, library }) => ({
  windowSize: app.window,
  collections: library.collections,
});
export default connect(mapStateToProps)(MyLibrary);
