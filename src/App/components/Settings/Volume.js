import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { AudioPlayerContext } from '../../../Providers/AudioPlayerProvider';
import { updateVolume } from '../Settings/actions';
import RangeSlider from '../common/RangeSlider';

const Volume = ({ value, onChange }) => {
  useEffect(() => {
    if (onChange) onChange(value);
  }, [onChange, value]);
  const { setVolume } = useContext(AudioPlayerContext);
  const handleChange = e => {
    const value = e.target.value;
    setVolume(value);
    updateVolume(value);
  };
  return (
    <React.Fragment>
      <RangeSlider min="0" max="100" value={value} onChange={handleChange} />
    </React.Fragment>
  );
};

const mapStateTotProps = ({ settings }) => ({ value: settings.userPreferences.volume });
export default connect(mapStateTotProps)(Volume);
