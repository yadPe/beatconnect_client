// Affiche la liste des matchs si aucun match n'est selectionné 

import React, { useState } from 'react'
import start from '../../../Bot';
import { ProgressCircle, Button, Text, TextInput } from 'react-desktop/windows';
import store from '../../../store';
import AddMatch from './AddMatch'
import MatchDetails from './MatchDetails'
import MatchListItem from './MatchListItem'

const renderMatchsList = (matchs, bot, theme, setSelected) => (
  <React.Fragment>
    <AddMatch bot={bot} theme={theme} />
    {matchs.map(match => <MatchListItem match={match} theme={theme} setSelected={setSelected}/>)}
  </React.Fragment>
)

const Matchs = ({ matchs, theme, bot }) => {
  const [selectedMatch, setSelectedMatch] = useState(null)

  return (
    <div className={'menuContainer Matchs'} style={{transition: 'background 0ms'}}>
      {selectedMatch || renderMatchsList(matchs, bot, theme, setSelectedMatch)}
    </div>
  )
};

export default Matchs;
