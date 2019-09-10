import React, { useContext, useState } from 'react'
import injectSheet from 'react-jss';
import { Button } from 'react-desktop';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'
import renderIcons from '../../utils/renderIcons';

const styles = {
  DownloadsInProgress: {
    display: 'inline-flex',
    width: '100%',
    '& p:last-of-type': {
      margin: 'auto 5px'
    },
    '& p:first-of-type': {
      marginRight: 'auto'
    }
  }
};

const DownloadsInProgress = ({ theme, classes }) => {
  const { cancelDownload, currentDownload } = useContext(DownloadQueueContext);
  const [isPaused, setIsPaused] = useState(false);
  const { infos, progress, item } = currentDownload;
  const toggleDownload = () => {
    if (!item) {
      return alert("If your download is stuck or won't start try restating the app. Sorry for the inconvenience")
    }
    item.isPaused() ? item.resume() : item.pause()
    setIsPaused(item.isPaused())
  }
  const renderDownloads = () => {
    if (!infos) return null;
    return (
      <div className={classes.DownloadsInProgress} >
        <p>{infos.fullTitle}</p>
        {
          progress ?
            (
              <React.Fragment>
                <p>{`${Math.round(progress.progress)}% @`}</p>
                <p>{progress.speed}</p>
              </React.Fragment>
            )
            : null
        }

        <Button
          push
          color={theme.color}
          onClick={toggleDownload}
        >
          {renderIcons(isPaused ? 'Download' : 'Pause', theme.style)}
        </Button>
        <Button
          push
          color={theme.warning}
          onClick={cancelDownload}
        >
          {renderIcons('Cancel', theme.style)}
        </Button>
      </div>
    )
  }
  return (
    <React.Fragment>
      {renderDownloads()}
    </React.Fragment>
  );
}

export default injectSheet(styles)(DownloadsInProgress);