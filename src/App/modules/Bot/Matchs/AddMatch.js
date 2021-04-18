import React, { useState } from 'react';
import { createUseStyles, useTheme }  from 'react-jss';
import { connect } from 'react-redux';
import TextInput from '../../common/TextInput';
import Button from '../../common/Button';

const useStyles = createUseStyles({
  text :{
    color:"white",
    margin:0
  }
});

const AddMatch = ({ bot, errors, ircUsername, connected }) => {
  const [reqMatchId, setReqMatchId] = useState('');
  const theme = useTheme();
  const classes = useStyles();
  const error = errors.filter(id => id === reqMatchId).length === 1;

  return (
    <>
      <TextInput placeholder="Match ID" value={reqMatchId} onChange={e => setReqMatchId(e.target.value)} />
      <Button
        className="btn"
        color={theme.palette.primary.accent}
        hidden={!connected || connected === 'connecting'}
        onClick={() => bot.joinMatch(reqMatchId)}
      >
        <p className={classes.text}>Join</p>
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

const mapStateToProps = ({ bot, settings }) => ({
  errors: bot.errors,
  ircUsername: settings.userPreferences.irc.username,
});
export default connect(mapStateToProps)(AddMatch);
