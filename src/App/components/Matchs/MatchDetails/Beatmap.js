import React from 'react';
import Cover from './Cover'
import { Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'
import DownloadBeatmapBtn from './DownloadBeatmapBtn'
import PreviewBeatmapBtn from './PreviewBeatmapBtn'
import { shell } from 'electron'
import OsuApi from '../../../../Bot/OsuApi';


const Beatmap = ({ theme, beatmap }) => {
  const getBeatmapUrl = ({ beatmapset_id, beatmap_id, mode, id }) => {
    console.log(beatmap) 
    const modes = {
      0: 'osu',
      1: 'taiko',
      2: 'ctb',
      3: 'mania'
    }
    if (beatmapset_id) return `https://osu.ppy.sh/beatmapsets/${beatmapset_id}/#${modes[mode]}/${beatmap_id}`
    if (id) return `https://osu.ppy.sh/beatmapsets/${id}`
    
  }

  const getDownloadUrl = ({ id, unique_id }) => {
    return `https://beatconnect.io/b/${id}/${unique_id}`
  }

  return (
    <div className='Beatmap'>
      {
        beatmap
          ?
          <React.Fragment>
            <Cover url={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id || beatmap.id}/covers/cover.jpg`} />
            <Text color='#fff'>{beatmap.title}</Text>
            <Text color='#fff'>{beatmap.artist}</Text>
            <Text color='#fff'>{`[${beatmap.version || ''}]`}</Text>
            <PreviewBeatmapBtn theme={theme} beatmapSetId={beatmap.beatmapset_id || beatmap.id} />
            <DownloadBeatmapBtn theme={theme} url={beatmap.beatconnectDlLink || getDownloadUrl(beatmap)}/>
            <Button
              push
              color={theme.color}
              onClick={() => shell.openExternal(getBeatmapUrl(beatmap))}
              hidden={!beatmap.title}>
              {renderIcons('Search', theme.style)}
            </Button>
          </React.Fragment>
          :
          null
      }

    </div>
  );
}

export default Beatmap;