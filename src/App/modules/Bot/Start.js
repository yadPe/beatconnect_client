import React from 'react';
import { connect } from 'react-redux';
import injectSheet from 'react-jss';
import start from '../../../Bot';
import Toggle from '../common/Toggle';

const styles = {
  Start: {
    transition: 'background 0ms',
    display: 'flex',
    'div p ': {
      margin: '10px',
    },
  },
};

const Start = ({ classes, connected, irc, osuApi }) => {
  const notReady = !osuApi || !irc.username || !irc.password;

  return (
    <div className={classes.Start}>
      <Toggle disabled={notReady} checked={connected} onChange={start} background="#505050" margin="auto 10px auto 0" />

      <p>{connected ? (connected === 'connecting' ? 'Connecting to Bancho via IRC..' : 'Online') : 'Offline'}</p>
      {notReady ? (
        <p style={{ margin: 'auto 10px' }}>
          Warning: no irc credential or osu API key found. Please go to settings section
        </p>
      ) : null}
    </div>
  );
};

const mapStateToProps = ({ settings }) => ({
  irc: settings.userPreferences.irc,
  osuApi: settings.userPreferences.osuApi.key,
});
export default connect(mapStateToProps)(injectSheet(styles)(Start));
