import React, { useEffect, createRef } from 'react'
import start from '../../../Bot';
import { ProgressCircle, Button } from 'react-desktop/windows';
import { connect } from 'react-redux';
import Toggle from '../common/Toggle';

const Start = ({ connected, theme, irc, osuApi }) => {
  const that = createRef();
  const notReady = (!osuApi || !irc.username || !irc.password)

  return (
    <div className={'Start'} style={{ transition: 'background 0ms', textAlign: 'center' }} ref={that}>
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
      {connected ? <p style={{ fontSize: '50%' }}>
        {connected === 'connecting' ?
          'Connecting to Bancho via IRC..'
          : 'Connected!'}
      </p> : null
      }
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
export default connect(mapStateToProps)(Start);