import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../shared/config';
import { getFadeIn, sectionSwitchAnimation } from '../../helpers/css.utils';
import AllBeatmapsCollection from './components/AllBeatmaps';
import Collection from './components/Collection';
import CollectionDetails from './components/CollectionDetails';
import Header from './components/Header';
import PublicCollectionDetails from './components/publicCollection/PublicCollectionDetails';
import PublicCollections from './components/publicCollection/PublicCollections';
import { getCollections } from './selectors';

const useStyle = createUseStyles({
  ...getFadeIn(),
  myLibraryWrapper: {
    ...sectionSwitchAnimation(),
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
  const [currentMode, setCurrentMode] = useState('localCollections');
  const [selectedCollection, setSelected] = useState({ header: null, collection: null, collectionName: '' });
  const setSelectedCollection = selection => setSelected({ ...selectedCollection, ...selection });

  useEffect(() => {
    if (selectedCollection.collection) {
      if (selectedCollection.header) setHeaderContent(selectedCollection.header);
    } else {
      setHeaderContent(<Header setCurrentMode={setCurrentMode} />);
    }
    return () => setHeaderContent(null);
  }, [selectedCollection]);
  const classes = useStyle();

  if (selectedCollection.collection) {
    switch (selectedCollection.mode) {
      case 'localCollection':
        return (
          <CollectionDetails
            collection={selectedCollection.collection}
            select={setSelectedCollection}
            collectionName={selectedCollection.collectionName}
          />
        );
      case 'publicCollection':
        return (
          <PublicCollectionDetails
            collectionId={selectedCollection.collectionId}
            collectionName={selectedCollection.collectionName}
            select={setSelectedCollection}
            collection={selectedCollection.collection}
          />
        );
      default:
        return null;
    }
  }

  const renderCurrentMode = () => {
    switch (currentMode) {
      case 'localCollections':
        return (
          <div className={classes.myLibraryWrapper}>
            <div className={classes.collections}>
              <AllBeatmapsCollection select={setSelectedCollection} />
              {collections.map(([name, beatmapsHash]) => (
                <Collection
                  mode="localCollection"
                  select={setSelectedCollection}
                  key={`${name}${beatmapsHash.length}`}
                  name={name}
                  beatmapsHash={beatmapsHash}
                />
              ))}
            </div>
          </div>
        );
      case 'publicCollections':
        return (
          <div className={classes.myLibraryWrapper}>
            <div className={classes.collections}>
              <PublicCollections select={setSelectedCollection} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return renderCurrentMode();
};

const mapStateToProps = state => ({
  windowSize: state.app.window,
  collections: getCollections(state),
});
export default connect(mapStateToProps)(MyLibrary);
