import React from 'react';
import { Text } from 'react-desktop/windows';
import { createUseStyles, useTheme } from 'react-jss';
import config from '../../../../../config';
import Button from '../../../common/Button';

const useStyles = createUseStyles({
  Player: {
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    margin: '0 auto',
    width: '100%',
    transitionProperty: 'filter',
    transitionDuration: `${config.display.defaultTransitionDuration}`,
    '&:hover': {
      filter: 'brightness(1.2)',
    },
  },
  playerNameContainer: {
    margin: '0 auto 0 0',
  },
  playerName: {
    fontSize: '62%',
    margin: '1vmin',
  },
});

const Player = ({ playerInfos, match }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <ul className={classes.Player}>
      <li className={classes.playerNameContainer}>
        <p className={classes.playerName}>{playerInfos}</p>
      </li>
      <li>
        <Button
          className="btn"
          push
          color={theme.palette.primary.accent}
          onClick={() => match.makeHost(playerInfos)}
          hidden={match.host === playerInfos}
        >
          <Text color="fff">Host</Text>
        </Button>
      </li>
      <li>
        <Button className="btn" push color={theme.palette.primary.accent} onClick={() => match.kick(playerInfos)}>
          <Text color="fff">Kick</Text>
        </Button>
      </li>
    </ul>
  );
};

export default Player;
