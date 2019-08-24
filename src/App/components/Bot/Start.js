import React from 'react'
import start from '../../../Bot';
import { connect } from 'react-redux';
import Toggle from '../common/Toggle';
import injectSheet from 'react-jss';

const styles = {
  Start: {
    transition: 'background 0ms',
    display: 'flex',
    'div p ': {
      margin: '10px'
    }
  }
};

const Start = ({ classes, connected, theme, irc, osuApi }) => {
  const notReady = (!osuApi || !irc.username || !irc.password)

  return (
    <div className={classes.Start}>
      <Toggle
        disabled={notReady}
        checked={connected}
        onChange={start}
        theme={theme}
        background={'#505050'}
        margin={'auto 10px auto 0'}
      />

      <p style={{ fontSize: '100%' }}>
        {connected ? connected === 'connecting' ?
          'Connecting to Bancho via IRC..'
          : 'Online'
          : 'Offline'
        }
      </p>
      {
        notReady ?
          <p style={{ fontSize: '80%' }}>
            Warning: no irc credential or osu API key found. Please go to settings section
          </p> : null
      }
    </div>
  )
};

const mapStateToProps = ({ settings }) => ({ irc: settings.userPreferences.irc, osuApi: settings.userPreferences.osuApi.key });
export default connect(mapStateToProps)(injectSheet(styles)(Start));