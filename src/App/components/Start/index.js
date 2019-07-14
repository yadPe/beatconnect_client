import React, { useState } from 'react'
import start from '../../../Bot';
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import store from '../../../store';

const Start = ({ connected, theme }) => {
  const connect = () => {
    store.dispatch({ type: 'CONNECT', status: 'connecting', bot: start() });
  }

  return (
    <div className={'menuContainer Start'}>
      <Button
        className='btn start'
        push
        color={theme.color}
        onClick={connect}
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
    </div>
  )
};

export default Start;
