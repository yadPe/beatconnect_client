import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../../../shared/config';
import { getThumbUrl } from '../../../../../shared/PpyHelpers.bs';
import renderIcons from '../../../../helpers/renderIcons';
import { useAudioPlayer } from '../../../../Providers/AudioPlayerProvider.bs';
import ScrollingText from '../../ScrollingText';

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
    '& > svg': {
      transform: 'rotate(180deg)',
    },
    width: '19px',
    height: '19px',
    cursor: 'pointer',
  },
  arrrowLeft: {
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

const PlayingSong = ({ expended }) => {
  const classes = useStyle({ expended });
  const { playingState, togglePlayPause } = useAudioPlayer();
  const visible = playingState.beatmapSetId;

  if (!visible) return null;
  return (
    <div className={classes.playingSongWrapper} onClick={togglePlayPause} role="tab">
      <div className={classes.expendedContentWrapper}>
        {expended && (
          <div className={classes.top}>
            <div className={classes.arrrowLeft}>{renderIcons({ name: 'Arrow' })}</div>

            <div
              className={classes.songImage}
              style={{ backgroundImage: `url(${getThumbUrl(playingState.beatmapSetId)})` }}
            />
            <div className={classes.arrrowRight}>{renderIcons({ name: 'Arrow' })}</div>
          </div>
        )}
        <div className={classes.bottom}>
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
