import React, { useState } from 'react';
import { connect } from 'react-redux'
import store from '../../../store';

const index = ({ volume }) => {
  return (
    <div className='menuContainer Settings'>
    <p>Volume</p>
    <input type="range" min="0" max="100" value={volume} className="Volume" id="myRange" onChange={(e) => store.dispatch({ type: 'VOLUME', value: e.target.value })}></input>
    </div>
  );
}

const mapStateTotProps = ({ settings }) => ({ ...settings })
export default connect(mapStateTotProps)(index);