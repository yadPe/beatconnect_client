import React from 'react'
import injectSheet from 'react-jss';
import Player from './Player';

const styles = {
  PlayersList: {
    height: '42vmin',
    backgroundColor: '#2a2a2a',
    overflowY: 'auto',
    '&::-webkit-scrollbar':{
      width: '8px'
    },
    '&::-webkit-scrollbar-track':{
      background: '#2a2a2a'
    },
    '&::-webkit-scrollbar-thumb':{
      background: '#00965f'
    }
  }
}

const PlayersList = ({theme, classes, players, match}) => {
  //const playertest = new Array(16).fill('BOBOXX');
  return (
    <div className={classes.PlayersList}>
      {
        players.map(player => <Player theme={theme} playerInfos={player} match={match} /> )
      }
    </div>
  );
}

export default injectSheet(styles)(PlayersList);