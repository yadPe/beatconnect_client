import React, { useState } from 'react';
import { Text } from 'react-desktop/windows';
import TextInput from '../../common/TextInput';
import { connect } from 'react-redux';
import Button from '../../common/Button';

const AddMatch = ({ bot, theme, errors, ircUsername, connected }) => {
  const [reqMatchId, setReqMatchId] = useState('');
  const error = errors.filter(id => id === reqMatchId).length === 1;
  return (
    <>
      <TextInput placeholder="Match ID" value={reqMatchId} onChange={e => setReqMatchId(e.target.value)} />
      <Button
        className="btn"
        push
        color={theme.palette.primary.accent}
        hidden={!(connected && connected !== 'connecting')}
        onClick={() => bot.joinMatch(reqMatchId)}
      >
        <Text color="fff">Join</Text>
      </Button>
      {error ? (
        <>
          <p style={{ fontSize: '50%' }}>
            Unable to connect.. Either the match doesn't exist or the bot hasn't been added as a match referee yet.
          </p>
          <p style={{ fontSize: '50%', userSelect: 'text', backgroundColor: theme.palette.primary.main }}>
            !mp addref {ircUsername}
          </p>
        </>
      ) : null}
    </>
  );
};

const mapStateToProps = ({ main, settings }) => ({
  errors: main.errors,
  ircUsername: settings.userPreferences.irc.username,
});
export default connect(mapStateToProps)(AddMatch);
