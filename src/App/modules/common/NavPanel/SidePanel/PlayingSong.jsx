import React from 'react';
import { createUseStyles } from 'react-jss';
import { connect } from 'react-redux';
import config from '../../../../../shared/config';
import renderIcons from '../../../../helpers/renderIcons';
import { useAudioPlayer } from '../../../../Providers/AudioPlayerProvider.bs';
import ScrollingText from '../../ScrollingText';

const useStyle = createUseStyles({
  playingSongWrapper: {
    margin: '0 0 0 0',
    display: 'flex',
    alignItems: 'flex-end',
    height: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expendedContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: '15px',
    letterSpacing: '0.4pt',
    padding: '0px 12px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
  },
  label: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
  },
});

const PlayingSong = ({ expended }) => {
  const classes = useStyle({ expended });
  const { playingState, togglePlayPause } = useAudioPlayer();
  const visible = playingState.songTitle;

  if (!visible) return null;
  return (
    <div className={classes.playingSongWrapper} onClick={togglePlayPause} role="tab">
      <span className={classes.expendedContentWrapper}>
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
            text={playingState.songTitle || 'song song sing song sing song | sddsderetrgvf - df dffg'}
            maxWidth={`${config.display.sidePanelExpandedLength - 44 - 2}px`}
          />
        </div>
      </span>
    </div>
  );
};

const mapStateToProps = ({ settings }) => ({ osuGamePath: settings.userPreferences.osuPath });
export default connect(mapStateToProps)(PlayingSong);
