import React, { useContext, useState } from 'react';
import getBeatmapInfosUrl from '../../utils/getBeatmapInfosUrl'
import Cover from '../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../common/Beatmap/PreviewBeatmapBtn';
import { Text, Button } from 'react-desktop';
import { shell } from 'electron'
import renderIcons from '../../utils/renderIcons'
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'
import timeSince from '../../utils/timeSince';
import injectSheet from 'react-jss'
import convertRange from '../../utils/convertRange';

const styles = {
  DownloadsItem: {
    position: 'relative',
    margin: '5px auto',
    textAlign: 'left',
  },
  fade: {
    //position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    //height: '100%',
    filter: props => props.status === 'downloaded' ? 'brightness(0.3)' : `blur(${ props.progress ? convertRange(props.progress.progress, 0, 100, 10, 0) : 10}px)`,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    '&:hover': {
      filter: props => props.status === 'downloaded' ? ' brightness(0.9)' : ''
    }
  },
  controls: {
    //position: 'absolute',
    overflow: 'hidden',
    height: '100%',
  },
  leftControls: {
    position: 'absolute',
    bottom: '5%',
    left: '1%',
    //transformOrigin: '50%',
  },
  rightControls: {
    position: 'absolute',
    top: '0%',
    right: '1%',
    //transformOrigin: '50%',
  },
  downloadInfos: {
    userSelect: 'none',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    top: '50%',
    // right: '50%',
    transform: 'translateY(-50%)',
  }
}

const DownloadsItem = ({ id, name, date, theme, status, progress, classes }) => {
  const [isPaused, setIsPaused] = useState(false);
  const { removeItemfromQueue, cancelDownload, currentDownload } = useContext(DownloadQueueContext)
  const cancel = () => {
    if (status === 'downloading') {
      cancelDownload();
    } else if (status === 'queued') {
      removeItemfromQueue(id);
    }
  }
  const toggleDownload = () => {
    const { item } = currentDownload
    item.isPaused() ? item.resume() : item.pause()
    setIsPaused(item.isPaused())
  }

  return (
    <div className={classes.DownloadsItem}>
      <div className={classes.fade}>
        <Cover url={`https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`} />
      </div>
      {
        progress ?
          <div className={classes.downloadInfos}>
            <div style={{ fontSize: '1.5em' }}>{`${Math.round(progress.progress)}%`}</div>
            <div style={{ fontSize: '0.8.em' }}>{progress.speed}</div>

          </div> :
          null
      }
      <div className={classes.controls}>
        <div className={classes.leftControls}>
          <Text color='#fff'>{name}</Text>
          <Text color='#fff'>{status === 'downloaded' ? `Downloaded ${timeSince(new Date(date))}` : status}</Text>
          {/* <div className={classes.buttons}> */}
          <PreviewBeatmapBtn theme={theme} beatmapSetId={id} />
          <Button
            push
            color={theme.color}
            onClick={() => shell.openExternal(getBeatmapInfosUrl({ id }))}
            hidden={false}>
            {renderIcons('Search', theme.style)}
          </Button>

          {/* </div> */}
        </div>
        <div className={classes.rightControls}>
          <Button
            push
            color={theme.color}
            onClick={toggleDownload}
            hidden={!(status === 'downloading')}
          >
            {renderIcons(isPaused ? 'Download' : 'Pause', theme.style)}
          </Button>
          <Button
            push
            color={theme.warning}
            onClick={cancel}
            hidden={status === 'downloaded'}
          >
            {renderIcons('Cancel', theme.style)}
          </Button>
        </div>
      </div>

    </div>
  );
}

export default injectSheet(styles)(DownloadsItem);