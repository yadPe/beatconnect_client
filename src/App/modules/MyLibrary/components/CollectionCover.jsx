import React from 'react';
import { createUseStyles } from 'react-jss';

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
    backgroundImage: ({ isPlaying }) => (isPlaying ? 'url(/img/pause-button.svg)' : 'url(/img/play-button.svg)'),
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
});

const CollectionCover = ({ artWorks, onPlay, isPlaying }) => {
  const classes = useStyle({ isPlaying });
  const handlePlay = e => {
    e.stopPropagation();
    onPlay();
  };
  return (
    <div className={`${classes.collectionCoverWrapper} collectionCoverWrapper`}>
      <div className={`${classes.playIcon} playIcon`} onClick={handlePlay} />
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