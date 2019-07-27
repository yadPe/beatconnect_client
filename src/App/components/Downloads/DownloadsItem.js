import React, { useContext, useState } from 'react';
import getBeatmapInfosUrl from '../../utils/getBeatmapInfosUrl'
import Cover from '../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../common/Beatmap/PreviewBeatmapBtn';
import { Text, Button } from 'react-desktop';
import { shell } from 'electron'
import renderIcons from '../../utils/renderIcons'
import { DownloadQueueContext } from '../../../Providers/DownloadQueueProvider'


const DownloadsItem = ({ id, name, date, theme, status, progress }) => {
  const [ isPaused, setIsPaused ] = useState(false);
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
    <div className='DownloadsItem'>

      <Cover url={`https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`} />
      <Text color='#fff'>{name}</Text>
      <Text color='#fff'>{status === 'downloaded' ? new Date(date).toDateString() : status}</Text>
      {
        status === 'downloading' ?
          <Text color='#fff'>{ progress ? JSON.stringify({progress: progress.progress, spedd: progress.speed}) : ''}</Text> :
          null
      }
      <PreviewBeatmapBtn theme={theme} beatmapSetId={id} />
      <Button
        push
        color={theme.color}
        onClick={() => shell.openExternal(getBeatmapInfosUrl({ id }))}
        hidden={false}>
        {renderIcons('Search', theme.style)}
      </Button>
      <Button
        push
        color={theme.color}
        onClick={toggleDownload}
        hidden={!(status === 'downloading')}>
        {renderIcons(isPaused ? 'Download' : 'Pause', theme.style)}
      </Button>
      <Button
        push
        color={theme.color}
        onClick={cancel}
        hidden={status === 'downloaded'}>
        {renderIcons('Cancel', theme.style)}
      </Button>

    </div>
  );
}

export default DownloadsItem;