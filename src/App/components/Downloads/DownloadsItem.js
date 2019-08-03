import React, { useContext, useState, memo, useCallback } from 'react';
import { shell } from 'electron'
import injectSheet from 'react-jss'
import { Text, Button } from 'react-desktop';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'
import getBeatmapInfosUrl from '../../utils/getBeatmapInfosUrl'
import renderIcons from '../../utils/renderIcons'
import convertRange from '../../utils/convertRange';
import timeSince from '../../utils/timeSince';
import Cover from '../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../common/Beatmap/PreviewBeatmapBtn';

const styles = {
  DownloadsItem: {
    position: 'relative',
    margin: '5px auto',
    textAlign: 'left',
    color: '#fff'
  },
  fade: {
    //position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    //height: '100%',
    filter: props => props.status === 'downloaded' ? 'brightness(0.3)' : `blur(${ props.progress ? convertRange(props.progress.progress, 0, 100, 6, 0) : 5}px) brightness(${ props.progress ? convertRange(props.progress.progress, 0, 100, 0.5, 1) : 0.5})`,
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
    '&:firstChild': {
      mixBlendMode: props => props.status === 'downloaded' ? 'normal' : 'difference',
    }
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
    //mixBlendMode: 'difference',
    //back
    fontSize: '1.5vw'
  }
}

const DownloadsItem = ({ id, name, date, theme, status, progress, classes }) => {
  console.log(id, 'updated')
  const { removeItemfromQueue, cancelDownload, currentDownload } = useContext(DownloadQueueContext)
  const [isPaused, setIsPaused] = useState(false);
  
  const cancel = useCallback(() => {
    if (status === 'downloading') {
      cancelDownload();
    } else if (status === 'queued') {
      removeItemfromQueue(id);
    }
  }, []);

  const toggleDownload = useCallback(() => {
    const { item } = currentDownload
    item.isPaused() ? item.resume() : item.pause()
    setIsPaused(item.isPaused())
  }, [currentDownload.item])

  const openOsuBeatmapPage = useCallback(() => shell.openExternal(getBeatmapInfosUrl({ id })), [id])
 
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
          {/* <h5 contentEditable role='textbox' aria-multiline='true' >{name}</h5> */}
          <Text color='#fff'>{status === 'downloaded' ? `Downloaded ${timeSince(new Date(date))}` : status}</Text>
          {/* <div className={classes.buttons}> */}
          <PreviewBeatmapBtn theme={theme} beatmapSetId={id} />
          <Button
            push
            color={theme.color}
            onClick={openOsuBeatmapPage}
          >
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

const areEqual = (prevProps, nextProps) => {
  console.log('equalllll ?', prevProps.id)
  return false
  // const { status, progress } = prevProps;
  // const { newStatus, newProgress } = nextProps;
  // if (progress){
  //   console.log('==================')
  //   console.log(status === newStatus && progress.progress === newProgress.progress)
  //   console.log('==================')
  //   return status === newStatus && progress.progress === newProgress.progress
  // }
  // console.log('==================')
  // console.log(status === newStatus)
  // console.log('==================')
  // return status === newStatus
}

export default memo(injectSheet(styles)(DownloadsItem), areEqual) ;
//export default injectSheet(styles)(memo(DownloadsItem, areEqual))
//export default injectSheet(styles)(DownloadsItem)