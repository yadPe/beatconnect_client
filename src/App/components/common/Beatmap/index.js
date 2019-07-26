import React from 'react';
import Cover from './Cover'
import { Button, Text } from 'react-desktop/windows';
import DownloadBeatmapBtn from './DownloadBeatmapBtn'
import PreviewBeatmapBtn from './PreviewBeatmapBtn'
import { shell } from 'electron'
import renderIcons from '../../../utils/renderIcons'
import getBeatmapInfosUrl from '../../../utils/getBeatmapInfosUrl'
import OsuApi from '../../../../Bot/OsuApi';

/* TODO
* Ajouter des infos sur le status de la bm
*/

const Beatmap = ({ theme, beatmap }) => {
  const getDownloadUrl = ({ id, unique_id }) => {
    return `https://beatconnect.io/b/${id}/${unique_id}`
  }

  const { beatmapset_id, id, title, artist, creator, version, beatconnectDlLink } = beatmap;

  return (
    <div className='Beatmap'>
      {
        beatmap
          ?
          <React.Fragment>
            <Cover url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`} />
            <Text color='#fff'>{title}</Text>
            <Text color='#fff'>{artist}</Text>
            <Text color='#fff'>{`[${version || ''}]`}</Text>
            <PreviewBeatmapBtn theme={theme} beatmapSetId={beatmapset_id || id} />
            <DownloadBeatmapBtn theme={theme} url={beatconnectDlLink || getDownloadUrl(beatmap)} infos={{ title, artist, creator, id: beatmapset_id || id }}/>
            <Button
              push
              color={theme.color}
              onClick={() => shell.openExternal(getBeatmapInfosUrl(beatmap))}
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