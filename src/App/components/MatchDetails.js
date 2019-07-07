import React, { useState } from 'react'
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import renderIcons from '../utils/renderIcons';
import Beatmap from './Beatmap'
import TestMap from './testMap'

const MatchDetails = ({ match, theme }) => {
  return (
    <div className='MatchDetails'>
      <div className='head'>
        <ul className="horizontal">
          <Button
            className='btn back'
            push
            color={theme.primary}
            onClick={() => alert('back')}
          >
            {renderIcons('Back', theme.style)}
          </Button >
          <Text color='fff'>sdsdsdsdsdsdd</Text>
          <Button
            className='btn startMatch'
            push
            color={theme.color}
            onClick={() => match.start()}
            hidden={!match}
          >
            Start
      </Button >
          <Button
            className='btn endMatch'
            push
            color={theme.warning}
            onClick={() => match.start()}
            hidden={!match}
          >
            Close
      </Button >
        </ul>
      </div>
      <div className='separator' />
      <div className='details'>
        <div className='players'>
        psum dolor sit amet, consectetur adipisicing elit.Quasi sunt explicabo aliquid, hic ipsum? Nesciunt sed consequatur velit cumque laboriosam quia eligendi, totam, provident sunt natus, consequuntu
        </div>
        <div className='beatmap'>
        <Beatmap theme={theme} beatmap={match.fullBeatmapData}/>
        </div>
      </div>

    </div>
  );
}

export default MatchDetails;