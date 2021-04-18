import React, { useEffect, useState } from 'react';
import { remote } from 'electron';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../../../shared/config';
import { getThumbUrl } from '../../../../../shared/PpyHelpers.bs';
import renderIcons from '../../../../helpers/renderIcons';
import { useAudioPlayer } from '../../../../Providers/AudioPlayer/AudioPlayerProvider.bs';
import ScrollingText from '../../ScrollingText';
import { setPlayingSongPresence } from '../../../../helpers/discordRPC';

const { trackEvent } = remote.getGlobal('tracking');

const useStyle = createUseStyles({
  playingSongWrapper: {
    height: ({ expended }) => (expended ? '104px' : '44px'),
  },
  icon: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  expendedContentWrapper: {
    fontSize: '15px',
    color: 'white',
    letterSpacing: '0.4pt',
    padding: '0px 12px',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: '10px',
  },
  bottom: {
    display: 'flex',
    alignItems: 'center',
  },
  arrrowRight: {
    visibility: ({ hasNext }) => (hasNext ? 'visible' : 'hidden'),
    '& > svg': {
      transform: 'rotate(180deg)',
    },
    width: '19px',
    height: '19px',
    cursor: 'pointer',
  },
  arrrowLeft: {
    visibility: ({ hasPrev }) => (hasPrev ? 'visible' : 'hidden'),
    width: '19px',
    height: '19px',
    cursor: 'pointer',
  },
  songImage: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '5px',
    width: '60px',
    height: '60px',
    boxShadow: '5px 5px 20px rgba(190, 190, 190,0.15), -5px -5px 60px rgba(255, 254, 255,0.15)',
    opacity: '0.8',
    cursor: 'pointer',
  },
});

const DEFAULT_ARTWORK = '/img/play-button.svg';
const PlayingSong = ({ expended }) => {
  const { playingState, togglePlayPause, playNext, playPrevious } = useAudioPlayer();
  const classes = useStyle({ expended, hasNext: playingState.hasNext, hasPrev: playingState.hasPrev });
  const playingBeatmapSetId = playingState.beatmapSetId;
  const [artWork, setArtwork] = useState(DEFAULT_ARTWORK);
  const isDefaultArtwork = artWork === DEFAULT_ARTWORK;

  useEffect(() => {
    const image = new Image();
    image.onerror = () => setArtwork(DEFAULT_ARTWORK);
    image.onload = () => setArtwork(getThumbUrl(playingBeatmapSetId));
    image.src = getThumbUrl(playingBeatmapSetId);
    if (playingBeatmapSetId) {
      trackEvent(
        'beatmapPreview',
        'play',
        playingState.hasNext || playingState.hasPrev ? 'full' : 'preview',
        playingBeatmapSetId,
      );
      setPlayingSongPresence(playingState.title, playingState.artist, playingState.beatmapSetId);
    }

    return () => {
      image.onerror = null;
      image.onload = null;
    };
  }, [playingBeatmapSetId, playingState.hasNext, playingState.hasPrev]);

  const handleNext = () => playNext();
  const handlePrevious = () => playPrevious();

  if (!playingBeatmapSetId) return null;
  return (
    <div className={classes.playingSongWrapper} role="tab">
      <div className={classes.expendedContentWrapper}>
        {expended && (
          <div className={classes.top}>
            <div className={classes.arrrowLeft} onClick={handlePrevious}>
              {renderIcons({ name: 'Arrow' })}
            </div>

            <div
              onClick={togglePlayPause}
              className={classes.songImage}
              style={{
                backgroundImage: `url(${artWork})`,
                backgroundSize: isDefaultArtwork ? '50%' : 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div className={classes.arrrowRight} onClick={handleNext}>
              {renderIcons({ name: 'Arrow' })}
            </div>
          </div>
        )}
        <div className={classes.bottom} onClick={togglePlayPause}>
          <div className={classes.icon}>
            {renderIcons({
              name: playingState.isPlaying ? 'playButton' : 'pauseButton',
              // color: osuIsRunning && theme.palette.primary.accent,
              // secColor: osuIsRunning && '#e3609a',
              width: '25px',
              height: '25px',
            })}
          </div>
          <div className={classes.label}>
            <ScrollingText
              text={`${playingState.artist} - ${playingState.title}`}
              maxWidth={`${config.display.sidePanelExpandedLength - 44 - 2}px`}
              visible={expended}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ settings }) => ({ osuGamePath: settings.userPreferences.osuPath });
export default connect(mapStateToProps)(PlayingSong);
