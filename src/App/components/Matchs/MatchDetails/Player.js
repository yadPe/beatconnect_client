import React from 'react';
import { Button, Text } from 'react-desktop/windows';
import injectSheet from 'react-jss';

const styles = {
  Player: {
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: '#2a2a2a',
    margin: '0 auto',
    width: '100%',
    transitionProperty: 'filter',
    transitionDuration: '200ms',
    '&:hover': {
      filter: 'brightness(1.2)'
    }
  },
  playerNameContainer: {
    margin: '0 auto 0 0'
  },
  playerName: {
    fontSize: '62%',
    margin: '1vmin'
  }
};

const Player = ({ classes, theme, playerInfos, match }) => {
  console.log(playerInfos, match.host)
  return (
    <ul className={classes.Player}>
      <li className={classes.playerNameContainer}><p className={classes.playerName} >{playerInfos}</p></li>
      <li>
        <Button
          className='btn'
          push
          color={theme.color}
          onClick={() => match.makeHost(playerInfos)}
          hidden={match.host === playerInfos}
        >
          <Text color='fff'>Host</Text>
        </Button >
      </li>
      <li>
        <Button
          className='btn'
          push
          color={theme.color}
          onClick={() => match.kick(playerInfos)}
        >
          <Text color='fff'>Kick</Text>
        </Button >
      </li>
    </ul>
  );
}

export default injectSheet(styles)(Player);