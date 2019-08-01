import React, { useState, useEffect } from 'react';
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
  const [brightness, setBrightness] = useState(0.95)
  const [isPlaying, setIsPLaying] = useState(false)
  const { beatmapset_id, id, title, artist, creator, version, beatconnectDlLink } = beatmap;
  const playpreview = null;
  const downloadBeatmap = null;

  let bpmFlash = null;

  const handleClick = () => {

  }

  const style = isPlaying ? {
    filter: `brightness(${brightness})`,
    transitionDuration: `${50}ms`
  } : {}

  useEffect(() => {
    if (isPlaying) {
      bpmFlash = setInterval(() => {
        setBrightness(1.08)
        setTimeout(() => setBrightness(0.95), (60000 / beatmap.bpm) / 2.5)
      }, 60000 / beatmap.bpm)
    }
    return () => bpmFlash ? clearInterval(bpmFlash) : undefined
  }, [isPlaying])

  useEffect(() => {
    return () => bpmFlash ? clearInterval(bpmFlash) : undefined
  }, [])

  return (
    <div className='Beatmap' style={style} onClick={() => setIsPLaying(true)}>
      {
        beatmap
          ?
          <React.Fragment>
            <Cover url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`} />
            <Text color='#fff'>{title}</Text>
            <Text color='#fff'>{artist}</Text>
            {version ? <Text color='#fff'>{`[${version || ''}]`}</Text> : null}
            <PreviewBeatmapBtn theme={theme} beatmapSetId={beatmapset_id || id} setIsPLaying={setIsPLaying} />
            <DownloadBeatmapBtn theme={theme} url={beatconnectDlLink || getDownloadUrl(beatmap)} infos={{ title, artist, creator, id: beatmapset_id || id }} />
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