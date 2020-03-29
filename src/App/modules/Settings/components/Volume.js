import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useAudioPlayer } from '../../../Providers/AudioPlayerProvider.bs';
import { updateVolume } from '../reducer/actions';
import RangeSlider from '../../common/RangeSlider';
import convertRange from '../../../helpers/convertRange';

const Volume = ({ value, onChange }) => {
  const { setVolume } = useAudioPlayer();
  useEffect(() => {
    if (onChange) onChange(value);
    setVolume(convertRange(value, 0, 100, 0, 1));
  }, [onChange, value]);
  const handleChange = e => {
    updateVolume(e.target.value);
  };
  return <RangeSlider min="0" max="100" value={value} onChange={handleChange} />;
};

const mapStateTotProps = ({ settings }) => ({ value: settings.userPreferences.volume });
export default connect(mapStateTotProps)(Volume);
