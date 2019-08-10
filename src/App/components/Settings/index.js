import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { remote } from 'electron';
import store from '../../../store';
import Volume from './Volume'
import History from './History';
import { Button } from 'react-desktop/windows';
import ConfLoader from './ConfLoader';
import { updateVolume } from './actions';
import Configuration from './Configuration';
import Theme from './Theme';

const Settings = ({ userPreferences, theme }) => {
  useEffect(() => {
    return ConfLoader.save
  }, [])

  return (
    <div className='menuContainer Settings' style={{transition: 'background 0ms', textAlign: 'center'}}>
      <Volume value={userPreferences.volume} onChange={(e) => updateVolume(e.target.value)} />
      <History theme={theme}/>
      <Configuration theme={theme} values={userPreferences} />
      <Theme theme={theme} />
      <div>{`Beatconnect client v${remote.app.getVersion()}`}</div>
    </div>
  );
}

const mapStateTotProps = ({ settings, main }) => ({ ...settings, theme: main.theme })
export default connect(mapStateTotProps)(Settings);