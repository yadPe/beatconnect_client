import React from 'react';
import Cover from './Cover'
import { Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons'

const Beatmap = ({ theme, beatmap }) => {
  console.log('BEATMAAAP', beatmap)

  return (
    <div className='Beatmap'>
      {
        beatmap
          ?
          <React.Fragment>
            <Cover url={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover.jpg`} />
            <Text color='#fff'>{beatmap.title}</Text>
            <Text color='#fff'>{beatmap.artist}</Text>
            <Text color='#fff'>{`[${beatmap.version}]`}</Text>
            <Button
              push
              color={theme.color}
              onClick={() => alert()}
              hidden={!beatmap.title}>
              {renderIcons('Play', theme.style)}
            </Button>
            <Button
              push
              color={theme.color}
              onClick={() => alert()}
              hidden={!beatmap.title}>
              {renderIcons('Download', theme.style)}
            </Button>
            <Button
              push
              color={theme.color}
              onClick={() => alert()}
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