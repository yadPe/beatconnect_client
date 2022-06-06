import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useSelector } from 'react-redux';
import { resolveThumbURL } from '../../../../shared/PpyHelpers.bs';
import pauseSvg from '../../../assets/img/pause-button.svg';
import playSvg from '../../../assets/img/play-button.svg';
import { getOsuPath } from '../../Settings/reducer/selectors';

const useStyle = createUseStyles({
  collectionCoverWrapper: {
    height: '200px',
    width: '200px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(50%, 1fr))',
    display: 'grid',
    position: 'relative',
    '&::after': {
      content: "''",
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'saturate(200%) blur(5px)',
      position: 'absolute',
      opacity: ({ isPlaying }) => (isPlaying ? 1 : 0),
      transition: 'all .3s ease',
    },
  },
  playIcon: {
    backgroundImage: ({ isPlaying }) => (isPlaying ? `url(${pauseSvg})` : `url(${playSvg})`),
    height: '64px',
    width: '64px',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    left: 'calc(50% - 32px)',
    position: 'absolute',
    top: ({ isPlaying }) => (isPlaying ? 'calc(50% - 32px)' : '50%'),
    opacity: ({ isPlaying }) => (isPlaying ? 1 : 0),
    transition: 'all .3s ease',
    zIndex: 1,
    cursor: 'pointer',
  },
  description: {
    padding: '.5rem',
    opacity: 0,
    zIndex: 1,
    position: 'absolute',
    height: '200px',
    width: '200px',
    top: '0 !important',
    fontSize: '1.5rem',
    overflow: 'hidden',
  },
});

const CollectionCover = ({ artWorksIds = [], onPlay, isPlaying, mode = 'localCollection', description = '' }) => {
  const [artWorks, setArtWorks] = useState([]);
  const osuPath = useSelector(getOsuPath);
  useEffect(() => {
    Promise.all(artWorksIds.map(artworkId => resolveThumbURL(artworkId, osuPath))).then(setArtWorks);
  }, [artWorksIds.join('')]);
  const classes = useStyle({ isPlaying });
  const handlePlay = e => {
    e.stopPropagation();
    onPlay();
  };

  return (
    <div className={`${classes.collectionCoverWrapper} collectionCoverWrapper`}>
      {mode === 'localCollection' ? (
        <div className={`${classes.playIcon} collectionCoverOverlay`} onClick={handlePlay} />
      ) : (
        <div className={`${classes.description} collectionCoverOverlay`}>{description}</div>
      )}
      {artWorks.map(artworkURL => (
        <div
          key={artworkURL}
          style={{
            backgroundImage: `url(${artworkURL})`,
            width: '100%',
            height: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        />
      ))}
    </div>
  );
};

export default CollectionCover;
