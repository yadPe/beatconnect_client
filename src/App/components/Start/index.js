import React, { useState } from 'react'
import start from '../../../Bot';
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import store from '../../../store';
import { connect } from 'react-redux';

const Start = ({ connected, theme, irc, osuApi }) => {
  // const connect = () => {
  //   store.dispatch({ type: 'CONNECT', status: 'connecting', bot: start() });
  // }

  const notReady = (!osuApi || !irc.username || !irc.password)
  
  return (
    <div className={'menuContainer Start'} style={{ transition: 'background 0ms' }}>
      <Button
        className='btn start'
        push
        hidden={notReady}
        color={theme.color}
        onClick={start}
      >
        {connected === 'connecting'
          ? <ProgressCircle
            className='ProgressCircle'
            color='#fff'
            size={28}
          />
          : connected ? 'Stop' : 'Start'
        }
      </Button >
      <Text
        color='#fff'
        hidden={!connected}
      >
        {connected === 'connecting' ? 'Connecting to Bancho via IRC..' : 'connected!'}
      </Text>
      {
        notReady ?
          <Text color='#fff'>
            Warning: no irc credential or osu API key found. Please go to settings section
          </Text> : null
      }
    </div>
  )
};

const mapStateToProps = ({ settings }) => ({ irc: settings.userPreferences.irc, osuApi: settings.userPreferences.osuApi.key });
export default connect(mapStateToProps)(Start);