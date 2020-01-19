import React from 'react';
import { useTheme, createUseStyles } from 'react-jss';
import Cover from '../../common/Beatmap/Cover';

const useStyles = createUseStyles({
  MatchListItem: {
    height: '60px',
    width: '80%',
    margin: '10px auto',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
    userSelect: 'none',
    '&:hover': {
      filter: 'brightness(1.1)',
    },
  },
  matchName: {
    margin: 'auto',
  },
  playersNum: {
    margin: 'auto 1vmin auto 1vmin',
    fontSize: '50%',
  },
});

const MatchListItem = ({ match, setSelected }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <ul className={classes.MatchListItem} onClick={() => setSelected(match.id)}>
      <li>
        <Cover url={`https://b.ppy.sh/thumb/${match.beatmapset_id}.jpg`} height="60px" width="10vmin" />
      </li>
      <li className={classes.matchName}>{match.matchName}</li>
      <li className={classes.playersNum}>{`${match.players.length} players`}</li>
    </ul>
  );
};

export default MatchListItem;
