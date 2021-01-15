import React from 'react';
import RangeSlider from '../../common/RangeSlider';
import convertRange from '../../../helpers/convertRange';

const Volume = ({ value, onChange }) => {
  const handleChange = e => {
    onChange(convertRange(e.target.value, 0, 100, 0, 1));
  };
  return <RangeSlider min="0" max="100" value={value * 100} onChange={handleChange} />;
};

export default Volume;
