import React, { useState } from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import renderIcons from '../../../../utils/renderIcons';
import Volume from '../../../Settings/Volume';
import config from '../../../../../config';

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

const VolumeControl = ({ onSelect, ...otherProps }) => {
  const [volumeValue, setVolumeValue] = useState();
  const theme = useTheme();
  const classes = useStyle({ ...otherProps, theme });
  const updateIcon = () => {
    if (volumeValue < 1) return renderIcons({ name: 'VolumeMute' });
    if (volumeValue < 35) return renderIcons({ name: 'VolumeLow' });
    if (volumeValue < 75) return renderIcons({ name: 'VolumeMid' });
    return renderIcons({ name: 'VolumeHigh' });
  };
  return (
    <a data-radium="true" className={classes.a} onClick={onSelect} role="tab">
      <span className={`${classes.tooltiptext} tooltiptext`}>
        <Volume onChange={setVolumeValue} />
      </span>
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <i data-radium="true" className={classes.i}>
          {updateIcon()}
        </i>
        <span data-radium="true" className={classes.title}>
          <Volume onChange={setVolumeValue} />
        </span>
      </span>
    </a>
  );
};

export default VolumeControl;
