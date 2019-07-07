import React, { useState } from 'react'
import start from '../../Bot';
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import store from '../../store';
import MatchDetails from './MatchDetails'

const Matchs = ({ matchs, theme }) => {

  return (
    <div className={'menuContainer Start'}>
      <MatchDetails theme={theme} match={matchs[0] || {}} />

    </div>
  )
};

export default Matchs;
