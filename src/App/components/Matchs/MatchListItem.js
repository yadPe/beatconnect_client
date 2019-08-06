import React from 'react';
import MatchDetails from './MatchDetails'
import injectSheet from 'react-jss';

const styles = {
  MatchListItem: {
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: '#2a2a2a',
    margin: 0,
    userSelect: 'none',
    '&:hover': {
      filter: 'brightness(1.1)'
    }
  },
};
const MatchListItem = ({ classes, match, theme, setSelected }) => {
  const closeMatchItem = () => setSelected(null)
  return (
    <ul className={classes.MatchListItem} onClick={() => setSelected(<MatchDetails match={match} theme={theme} close={closeMatchItem} />)}>
      <li></li>
      <li>
        {match.matchName}
      </li>
      <li>
        {`${match.players.length} players`}
      </li>
    </ul>
  );
}

export default injectSheet(styles)(MatchListItem);