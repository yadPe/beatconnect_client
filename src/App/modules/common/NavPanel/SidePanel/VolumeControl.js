import React, { useEffect, useRef } from 'react';
import { throttle } from 'underscore';
import { connect } from 'react-redux';
import { useTheme, createUseStyles } from 'react-jss';
import renderIcons from '../../../../helpers/renderIcons';
import Volume from '../../../Settings/components/Volume';
import config from '../../../../../shared/config';
import { useAudioPlayer } from '../../../../Providers/AudioPlayer/AudioPlayerProvider.bs';
import { saveVolume } from '../../../Settings/reducer/actions';
import { getVolume } from '../../../Settings/reducer/selectors';
import store from '../../../../../shared/store';
import convertRange from '../../../../helpers/convertRange';
import ConfLoader from '../../../Settings/helpers/ConfLoader';

const useStyle = createUseStyles({
  a: {
    margin: '0 0 0 0',
    display: 'flex',
    alignItems: 'center',
    height: '44px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    ' &:active': {
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
    '&:hover .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:active .indicator': {
      height: props => (props.selected ? '48px' : '24px'),
    },
    '&:hover .tooltiptext': {
      visibility: props => (props.expended ? 'hidden' : 'visible'),
    },
    '&:active .tooltiptext': {
      visibility: props => (props.expended ? 'hidden' : 'visible'),
    },
  },
  span: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(255, 255, 255)',
    fontSize: '15px',
    letterSpacing: '0.4pt',
    padding: '0px 16px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
  },
  i: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    left: 0,
    margin: 0,
    height: props => (props.selected ? '40px' : '0px'),
    width: '3px',
    backgroundColor: ({ theme }) => theme.palette.primary.accent,
    transition: `height ${config.display.defaultTransitionDuration}`,
  },
  title: {
    visibility: props => (props.expended ? 'visible' : 'hidden'),
  },
  tooltiptext: {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    color: '#fff',
    textAlign: 'center',
    padding: '5px 5px',
    borderRadius: '6px',
    position: 'absolute',
    left: '100%',
    zIndex: 1,
  },
});

const denounceSave = throttle(
  (vol, save) => {
    const { settings } = store.getState();
    save(convertRange(vol, 0, 1, 0, 100));
    ConfLoader.save(settings);
  },
  1000,
  { leading: false },
);

const VolumeControl = ({ onSelect, volume, ...otherProps }) => {
  const hasRestoredVolume = useRef(false);
  const theme = useTheme();
  const classes = useStyle({ ...otherProps, theme });
  const { playingState, setVolume, setMuted } = useAudioPlayer();
  const playerVolume = playingState.volume;

  const toggleMuted = () => (playingState.muted ? setMuted(false) : setMuted(true));
  const updateIcon = () => {
    if (playingState.muted) return renderIcons({ name: 'VolumeMute' });
    if (playerVolume < 0.01) return renderIcons({ name: 'VolumeMute' });
    if (playerVolume < 0.35) return renderIcons({ name: 'VolumeLow' });
    if (playerVolume < 0.75) return renderIcons({ name: 'VolumeMid' });
    return renderIcons({ name: 'VolumeHigh' });
  };
  const handleVolChange = value => {
    if (playingState.muted) setMuted(false);
    setVolume(value);
  };

  useEffect(() => {
    if (!hasRestoredVolume.current && volume !== null) {
      setVolume(convertRange(getVolume(store.getState()), 0, 100, 0, 1));
      hasRestoredVolume.current = true;
    }
    return () => {
      denounceSave(playerVolume, saveVolume);
    };
  }, [hasRestoredVolume, playerVolume, volume]);

  return (
    <a className={classes.a} role="tab">
      <span data-radium="true" className={classes.span} onClick={toggleMuted}>
        <div className={`${classes.indicator} indicator`} />
        <i data-radium="true" className={classes.i}>
          {updateIcon()}
        </i>
        <span data-radium="true" className={classes.title} onClick={e => e.stopPropagation()}>
          <Volume onChange={handleVolChange} value={playerVolume} />
        </span>
      </span>
    </a>
  );
};

const mapStateTotProps = state => ({
  volume: getVolume(state),
});
export default connect(mapStateTotProps)(VolumeControl);
