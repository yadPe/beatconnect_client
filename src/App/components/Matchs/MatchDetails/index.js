import React, { useState } from 'react'
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import renderIcons from '../../../utils/renderIcons';
import Beatmap from '../../common/Beatmap'
import TestMap from '../../testMap'
import Player from './PlayersList';

const MatchDetails = ({ match, theme, close }) => {

  const PlayersList = () => match.players.map(player => (
    <Player theme={theme} playerInfos={player} match={match} />
  ))

  return (
    <div className='MatchDetails'>
      <div className='head'>
        <ul className="horizontal">
          <Button
            className='btn back'
            push
            color={theme.primary}
            onClick={() => close()}
          >
            {renderIcons('Back', theme.style)}
          </Button >
          <Text color='fff'>{match.matchName}</Text>
          <Button
            push
            color={theme.color}
            onClick={() => match.autoBeat = !match.autoBeat}
          // hidden={!beatmap.title}
          >
            {renderIcons('Music', theme.style)}
          </Button>
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
          {match.players ? PlayersList() : null}
        </div>
        <div className='beatmap'>
          {/* <Beatmap theme={theme} beatmap={TestMap}/> */}

          <Beatmap theme={theme} beatmap={match.fullBeatmapData} />
        </div>
      </div>

    </div>
  );
}

export default MatchDetails;