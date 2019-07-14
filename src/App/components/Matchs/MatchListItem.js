import React from 'react';
import MatchDetails from './MatchDetails'
import { ProgressCircle, Button, Text, TextInput } from 'react-desktop/windows';

const MatchListItem = ({ match, theme, setSelected }) => {
  const closeMatchItem = () => setSelected(null)
  return (
    <div className='MatchListItem'>
      <p>{match.matchName}</p>
      <Button
        className='btn'
        push
        color={theme.color}
        //hidden={test.test(reqMatchId)}
        onClick={() => setSelected(<MatchDetails match={match} theme={theme} close={closeMatchItem}/>)}
      >
        <p>Select</p>
      </Button>
    </div>
  );
}

export default MatchListItem;