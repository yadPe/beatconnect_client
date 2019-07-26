import React from 'react';
import getBeatmapInfosUrl from '../../utils/getBeatmapInfosUrl'
import Cover from '../common/Beatmap/Cover';
import PreviewBeatmapBtn from '../common/Beatmap/PreviewBeatmapBtn';
import { Text, Button } from 'react-desktop';
import { shell } from 'electron'
import renderIcons from '../../utils/renderIcons'


const DownloadsItem = ({ id, name, date, theme }) => {
  
  return (
    <div className='DownloadsItem'>

      <Cover url={`https://assets.ppy.sh/beatmaps/${id}/covers/cover.jpg`} />
      <Text color='#fff'>{name}</Text>
      <Text color='#fff'>{ new Date(date).toDateString() }</Text>
      <PreviewBeatmapBtn theme={theme} beatmapSetId={id} />
      <Button
        push
        color={theme.color}
        onClick={() => shell.openExternal(getBeatmapInfosUrl({id}))}
        hidden={false}>
        {renderIcons('Search', theme.style)}
      </Button>
      <Button
        push
        color={theme.color}
        onClick={() => console.log('pause/resume')}
        hidden={false}>
        {renderIcons('Search', theme.style)}
      </Button>
      <Button
        push
        color={theme.color}
        onClick={() => console.log('cancel')}
        hidden={false}>
        {renderIcons('Search', theme.style)}
      </Button>

    </div>
  );
}

export default DownloadsItem;