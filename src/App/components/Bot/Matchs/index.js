// Affiche la liste des matchs si aucun match n'est selectionné 

import React, { useState } from 'react'
import AddMatch from './AddMatch'
import MatchListItem from './MatchListItem'
import { connect } from 'react-redux';
import MatchDetails from './MatchDetails';

const renderMatchsList = (mpMatchs, bot, theme, setSelected, connected) => {
  console.log('update matchsList', mpMatchs)
  // mpMatchs = new Array(20).fill({matchName: 'test', players: new Array(16).fill('PEPPY')})
  if (mpMatchs.length > 0) return (
    <React.Fragment>
      <AddMatch bot={bot} theme={theme} connected={connected} />
      {mpMatchs.map(match => <MatchListItem match={match} theme={theme} setSelected={setSelected} />)}
    </React.Fragment> 
  )
  return (
    <React.Fragment>
      <AddMatch bot={bot} theme={theme} connected={connected}/>
      {connected && connected !== 'connecting' ? <p>Not connected to any match</p> : <p>Please start the bot before connecting to a match</p>}
    </React.Fragment>
  )
}

const Matchs = ({ mpMatchs, theme, bot, connected }) => {
  const [selectedMatch, setSelectedMatch] = useState(null)

  const renderSelectedMatch = () => mpMatchs.map(match => match.id === selectedMatch ? <MatchDetails match={match} theme={theme} close={() => setSelectedMatch(null)} /> : null)
  // useEffect(() => {
  //   if (selectedMatch){
  //     if (mpMatchs.filter(match => selectedMatch.id === match.id).length === 0) setSelectedMatch(null)
  //   }
  // }, [mpMatchs])

  return (
    <div className={'mpMatchs'} style={{ transition: 'background 0ms' }}>
      {selectedMatch ? renderSelectedMatch() :  renderMatchsList(mpMatchs, bot, theme, setSelectedMatch, connected)}
    </div>
  )
};

const mapStateToProps = ({ main }) => ({ mpMatchs: main.mpMatchs })
export default connect(mapStateToProps)(Matchs);
