// Affiche la liste des matchs si aucun match n'est selectionné

import React, { useState } from 'react';
import { connect } from 'react-redux';
import AddMatch from './AddMatch';
import MatchListItem from './MatchListItem';
import MatchDetails from './MatchDetails';

const renderMatchsList = (mpMatchs, bot, theme, setSelected, connected) => {
  if (mpMatchs.length > 0)
    return (
      <>
        <AddMatch bot={bot} connected={connected} />
        {mpMatchs.map(match => (
          <MatchListItem match={match} setSelected={setSelected} />
        ))}
      </>
    );
  return (
    <>
      <AddMatch bot={bot} connected={connected} />
      {connected && connected !== 'connecting' ? (
        <p>Start by entering your match id</p>
      ) : (
        <p>Please start the bot before connecting to a match</p>
      )}
    </>
  );
};

const Matchs = ({ mpMatchs, theme, bot, connected }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);

  const renderSelectedMatch = () => {
    const currentMatch = mpMatchs.map(
      match => match.id === selectedMatch && <MatchDetails match={match} close={() => setSelectedMatch(null)} />,
    );
    if (currentMatch.length === 1) return currentMatch;
    return setSelectedMatch(null);
  };

  return (
    <div className="mpMatchs" style={{ transition: 'background 0ms' }}>
      {selectedMatch ? renderSelectedMatch() : renderMatchsList(mpMatchs, bot, theme, setSelectedMatch, connected)}
    </div>
  );
};

const mapStateToProps = ({ main }) => ({ mpMatchs: main.mpMatchs });
export default connect(mapStateToProps)(Matchs);
