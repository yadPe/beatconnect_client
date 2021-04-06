import React, { useState, useEffect, useRef } from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import { ipcRenderer } from 'electron';
import { error } from 'electron-log';
import { connect, useDispatch, useSelector } from 'react-redux';
import renderIcons from '../../../../helpers/renderIcons';
import config from '../../../../../shared/config';
import { changeCurrentSection } from '../../../../app.actions';
import { tFromJs as sections } from '../../../Sections.bs';
import { useOsuDbScan } from '../../../Settings/utils/useScanOsuSongs';
import { scanOsuCollection } from '../../../Settings/utils/scanOsuCollections';
import { getOsuPath } from '../../../Settings/reducer/selectors';

const useStyle = createUseStyles({
  playOsuWrapper: {
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
    padding: '0px 12px',
    transition: 'transform 0.1s ease-in 0s',
    userSelect: 'none',
  },
  icon: {
    marginRight: '8px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::after': {
      visibility: ({ isOsuSet }) => (!isOsuSet ? 'visible' : 'hidden'),
      content: "''",
      position: 'absolute',
      width: '23px',
      height: '2px',
      backgroundColor: 'white',
      transform: 'rotate(-45deg)',
    },
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
    whiteSpace: 'nowrap',
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

const PlayOsu = ({ onSelect, osuGamePath, ...otherProps }) => {
  const isOsuSet = osuGamePath && osuGamePath !== '';
  const theme = useTheme();
  const dispatch = useDispatch();
  const classes = useStyle({ ...otherProps, theme, isOsuSet });
  const [osuIsRunning, setOsuIsRunning] = useState(false);
  const isScanning = useRef(false);
  const osuScan = useOsuDbScan();
  const osuPath = useSelector(getOsuPath);

  const listener = (_event, status) => {
    setOsuIsRunning(status);
  };
  const launchOsu = () => {
    if (osuGamePath) {
      ipcRenderer.send('start-osu', osuGamePath);
      setOsuIsRunning(true);
    }
  };
  useEffect(() => {
    ipcRenderer.send('start-pulling-osu-state');
    ipcRenderer.on('osu-is-running', listener);
    return () => ipcRenderer.removeListener('osu-is-running', listener);
  }, []);

  useEffect(() => {
    if (!isOsuSet || isScanning.current) return;
    isScanning.current = true;
    osuScan();
    scanOsuCollection(osuPath)
      .catch(e => {
        error(`[scanOsuCollection]: ${e}`);
      })
      .finally(() => {
        isScanning.current = false;
      });
  }, [osuIsRunning, isOsuSet]);

  return (
    <div
      className={classes.playOsuWrapper}
      onClick={isOsuSet ? launchOsu : () => dispatch(changeCurrentSection(sections('Settings')))}
      role="tab"
    >
      <span data-radium="true" className={classes.span}>
        <div className={`${classes.indicator} indicator`} />
        <div data-radium="true" className={classes.icon}>
          {renderIcons({
            name: 'osu',
            color: osuIsRunning && theme.palette.primary.accent,
            secColor: osuIsRunning && '#e3609a',
            width: '25px',
            height: '25px',
          })}
        </div>
        <span data-radium="true" className={classes.title}>
          {!isOsuSet && 'Osu! not set'}
          {isOsuSet && (osuIsRunning ? 'Playing !' : 'Play !')}
        </span>
      </span>
    </div>
  );
};

const mapStateToProps = ({ settings }) => ({ osuGamePath: settings.userPreferences.osuPath });
export default connect(mapStateToProps)(PlayOsu);
