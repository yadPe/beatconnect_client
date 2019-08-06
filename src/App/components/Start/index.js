import React, { useEffect, createRef } from 'react'
import start from '../../../Bot';
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import { connect } from 'react-redux';

const Start = ({ connected, theme, irc, osuApi }) => {
  const that = createRef();
  const notReady = (!osuApi || !irc.username || !irc.password)

  useEffect(() => {
    that.current.parentNode.style.padding = 0; // Dirty way to custom react-desktop component
  }, [])


  return (
    <div className={'menuContainer Start'} style={{ transition: 'background 0ms', textAlign: 'center' }} ref={that}>
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
          <Text color='#fff'>
            Warning: no irc credential or osu API key found. Please go to settings section
          </Text> : null
      }
    </div>
  )
};

const mapStateToProps = ({ settings }) => ({ irc: settings.userPreferences.irc, osuApi: settings.userPreferences.osuApi.key });
export default connect(mapStateToProps)(Start);