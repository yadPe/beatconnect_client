import React, { useState } from 'react';
import { connect } from 'react-redux'
import store from '../../../store';
import Volume from './Volume'
import History from './History';

const index = ({ volume, theme }) => {
  return (
    <div className='menuContainer Settings'>
      <Volume value={volume} onChange={(e) => store.dispatch({ type: 'VOLUME', value: e.target.value })} />
      <History theme={theme}/>
    </div>
  );
}

const mapStateTotProps = ({ settings, main }) => ({ ...settings, theme: main.theme })
export default connect(mapStateTotProps)(index);