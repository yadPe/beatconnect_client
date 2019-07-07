import React from 'react';
import Cover from './Cover'
import { Button, Text } from 'react-desktop/windows';

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
          </React.Fragment>
          :
          null
      }

    </div>
  );
}

export default Beatmap;