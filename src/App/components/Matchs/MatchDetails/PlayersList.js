import React from 'react';
import { Button, Text } from 'react-desktop/windows';

const Player = ({theme, playerInfos, match}) => {
  return (
    <ul className="horizontal">
      <Text color='fff'>{playerInfos}</Text>
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={() => match.makeHost(playerInfos)}
      >
        <Text color='fff'>Host</Text>
      </Button >
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={() => match.kick(playerInfos)}
      >
        <Text color='fff'>Kick</Text>
      </Button >
    </ul>
  );
}

export default Player;