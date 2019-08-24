import React, { useState } from 'react';
import { Button, Text } from 'react-desktop/windows';
import TextInput from '../../common/TextInput';
import { connect } from 'react-redux';

const AddMatch = ({ bot, theme, errors, ircUsername, connected }) => {
  const [ reqMatchId, setReqMatchId ] = useState('');
  const error = errors.filter(id => id === reqMatchId).length === 1
  return (
    <React.Fragment>
      <TextInput
        theme={theme.style}
        color={theme.color}
        placeholder='Match ID'
        value={reqMatchId}
        onChange={ e => setReqMatchId(e.target.value)}
      />
      <Button
        className='btn'
        push
        color={theme.color}
        hidden={!(connected && connected !== 'connecting')}
        onClick={() => bot.joinMatch(reqMatchId)}
      >
        <Text color='fff'>Join</Text>
      </Button>
      {error ? (
        <React.Fragment>
      <p style={{fontSize: '50%'}}>Unable to connect.. Either the match doesn't exist or the bot hasn't been added as a match referee yet.</p>
      <p style={{fontSize: '50%', userSelect: 'text', backgroundColor: '#2a2a2a'}}>!mp addref {ircUsername}</p>
      </React.Fragment>
      ) : null}
    </React.Fragment>
  );
}

const mapStateToProps = ({main, settings}) => ({errors: main.errors, ircUsername: settings.userPreferences.irc.username});
export default connect(mapStateToProps)(AddMatch);