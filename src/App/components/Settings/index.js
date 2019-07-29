import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import store from '../../../store';
import Volume from './Volume'
import History from './History';
import { Button } from 'react-desktop/windows';
import ConfLoader from './ConfLoader';
import { updateVolume } from './actions';
import Configuration from './Configuration';

const Settings = ({ userPreferences, theme }) => {
  useEffect(() => {
    return ConfLoader.save
  }, [])

  return (
    <div className='menuContainer Settings'>
      <Volume value={userPreferences.volume} onChange={(e) => updateVolume(e.target.value)} />
      <History theme={theme}/>
      <Configuration theme={theme} values={userPreferences} />
    </div>
  );
}

const mapStateTotProps = ({ settings, main }) => ({ ...settings, theme: main.theme })
export default connect(mapStateTotProps)(Settings);