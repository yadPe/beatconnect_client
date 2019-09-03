import React, { useContext, useState } from 'react'
import DownloadsItem from './Item';
import injectSheet from 'react-jss';
import { Text, Button } from 'react-desktop';
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'
import renderIcons from '../../utils/renderIcons';

const styles = {
  DownloadsInProgress: {
    display: 'inline-flex',
    '& p': {
      margin: 'auto'
    }
  }
};

const DownloadsInProgress = ({ theme, classes }) => {
  const { cancelDownload, currentDownload } = useContext(DownloadQueueContext);
  const [isPaused, setIsPaused] = useState(false);
  const { infos, progress, item } = currentDownload;
  const toggleDownload = () => {
    item.isPaused() ? item.resume() : item.pause()
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
                <p>{`${Math.round(progress.progress)}% |`}</p>
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
          {renderIcons(renderIcons(isPaused ? 'Download' : 'Pause', theme.style))}
        </Button>
        <Button
          push
          color={theme.warning}
          onClick={cancelDownload}
        >
          {renderIcons('Cancel', theme.style)}
        </Button>
        {/* <DownloadsItem id={infos.id} item={item} name={infos.fullTitle} {...progress} theme={theme} cancel={cancelDownload} status='downloading' key={infos.id} /> */}
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