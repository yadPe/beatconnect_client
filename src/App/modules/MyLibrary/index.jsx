import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../shared/config';
import AllBeatmapsCollection from './components/AllBeatmaps';
import Collection from './components/Collection';
import CollectionDetails from './components/CollectionDetails';

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
  const [selectedCollection, setSelected] = useState({ header: null, collection: null, collectionName: '' });
  const setSelectedCollection = selection => setSelected({ ...selectedCollection, ...selection });

  useEffect(() => {
    if (selectedCollection.collection) {
      if (selectedCollection.header) setHeaderContent(selectedCollection.header);
    } else {
      setHeaderContent(null);
    }
    return () => setHeaderContent(null);
  }, [selectedCollection]);
  const classes = useStyle();

  if (selectedCollection.collection) {
    return (
      <CollectionDetails
        collection={selectedCollection.collection}
        select={setSelectedCollection}
        collectionName={selectedCollection.collectionName}
      />
    );
  }
  return (
    <div className={classes.myLibraryWrapper}>
      <div className={classes.collections}>
        <AllBeatmapsCollection select={setSelectedCollection} />
        {Object.entries(collections).map(([name, beatmapsHash]) => (
          <Collection
            select={setSelectedCollection}
            key={`${name}${beatmapsHash.length}`}
            name={name}
            beatmapsHash={beatmapsHash}
          />
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
