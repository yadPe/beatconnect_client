import React from 'react';
import MatchDetails from './MatchDetails'
import injectSheet from 'react-jss';
import Cover from '../../common/Beatmap/Cover';

const styles = {
  MatchListItem: {
    width: '80%',
    margin: '10px auto',
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: '#2a2a2a',
    userSelect: 'none',
    '&:hover': {
      filter: 'brightness(1.1)'
    }
  },
  matchName: {
    margin: 'auto'
  },
  playersNum: {
    margin: 'auto 1vmin auto 1vmin',
    fontSize: '50%',
  }
};
const MatchListItem = ({ classes, match, theme, setSelected }) => {
  const closeMatchItem = () => setSelected(null)
  return (
    <ul className={classes.MatchListItem} onClick={() => setSelected(<MatchDetails match={match} theme={theme} close={closeMatchItem} />)}>
      <li>
        <Cover url={`https://b.ppy.sh/thumb/${match.beatmapset_id}.jpg`} height='5vmin' width='10vmin' />
      </li>
      <li className={classes.matchName}>
        {match.matchName}
      </li>
      <li className={classes.playersNum}>
        {`${match.players.length} players`}
      </li>
    </ul>
  );
}

export default injectSheet(styles)(MatchListItem);