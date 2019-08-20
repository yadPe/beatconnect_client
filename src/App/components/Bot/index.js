import React from 'react';
import Start from './Start';
import Matchs from './Matchs'

const Bot = ({connected, matchs, bot, theme}) => {
  return (
    <div className='menuContainer'>
      <Start connected={connected} theme={theme}/>
      <Matchs matchs={matchs} theme={theme} bot={bot}/>
    </div>
  );
}

export default Bot;