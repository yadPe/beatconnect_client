import React, { useState } from 'react'
import Beatmap from '../../common/Beatmap'
import PlayersList from './PlayersList'
import ControlsBar from './ControlsBar';

const MatchDetails = ({ match, theme, close }) => {

  // const PlayersList = () => match.players.map(player => (
  //   <Player theme={theme} playerInfos={player} match={match} />
  // ))

  return (
    <div className='MatchDetails'>
      <div className='head'>
        <ControlsBar match={match} theme={theme} close={close} />
      </div>
      <div className='details'>
        <div className='players'>
          {match.players ? <PlayersList theme={theme} players={match.players} match={match} /> : null}
        </div>
        <div className='beatmap'>
          {/* <Beatmap theme={theme} beatmap={TestMap}/> */}
          {match.fullBeatmapData ?
            <Beatmap theme={theme} beatmap={match.fullBeatmapData} />
            : 'Asking peppy...'} 
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;