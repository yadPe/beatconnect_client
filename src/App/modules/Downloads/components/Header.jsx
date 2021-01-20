import React from 'react';
import { createUseStyles } from 'react-jss';
import config from '../../../../shared/config';
import { useDownloadQueue } from '../../../Providers/downloadManager';
import NewButton from '../../common/newButton';

const useStyle = createUseStyles({
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'inline-flex',
    justifyContent: 'space-evenly',
    fontSize: 'large',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  actions: {
    display: 'inline-flex',
    width: '190px',
    justifyContent: 'space-between',
  },
  data: {
    fontWeight: 'lighter',
  },
});

const Header = () => {
  const { currentDownload, clear, queue } = useDownloadQueue();
  const { downloadSpeed, status } = currentDownload || {};
  const classes = useStyle();

  if (!queue || !queue.length) return null;

  const isPaused = status === config.download.status.paused;
  const dlSpeed = isPaused || !downloadSpeed ? '0 bytes/sec' : `${downloadSpeed}/sec`;
  return (
    <div className={classes.wrapper}>
      <div className={classes.label}>
        <span>BeatmapSets</span>
        <span className={classes.data}>{queue.length}</span>
      </div>
      <div className={classes.label}>
        <span>Speed</span>
        <span className={classes.data}>{dlSpeed}</span>
      </div>
      <NewButton iconName="CancelAll" label="Cancel all" onClick={clear} />
    </div>
  );
};

export default Header;
