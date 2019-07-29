import React, { useContext } from 'react';
import { AudioPlayerContext } from '../../../Providers/AudioPlayerProvider';

const Volume = ({ value, onChange }) => {
  const { setVolume } = useContext(AudioPlayerContext);
  const handleChange = (e) => {
    const value = e.target.value;
    setVolume(value)
    onChange(e)
  }
  return (
  <React.Fragment>
    <p>Volume</p>
    <input type="range" min="0" max="100" value={value} className="Volume" id="myRange" onChange={handleChange}></input>
  </React.Fragment>
)};

export default Volume;