import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import Player from './Player';

const useStyles = createUseStyles({
  PlayersList: {
    height: '42vmin',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    overflowY: 'auto',
  },
});

const PlayersList = ({ players, match }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.PlayersList}>
      {players.map(player => (
        <Player playerInfos={player} match={match} />
      ))}
    </div>
  );
};

export default PlayersList;
