import React from 'react';
import injectSheet from 'react-jss';
import Player from './Player';

const styles = {
  PlayersList: {
    height: '42vmin',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: ({ theme }) => theme.palette.primary.main,
    },
    '&::-webkit-scrollbar-thumb': {
      background: ({ theme }) => theme.palette.primary.accent,
    },
  },
};

const PlayersList = ({ theme, classes, players, match }) => {
  return (
    <div className={classes.PlayersList}>
      {players.map(player => (
        <Player theme={theme} playerInfos={player} match={match} />
      ))}
    </div>
  );
};

export default injectSheet(styles)(PlayersList);
