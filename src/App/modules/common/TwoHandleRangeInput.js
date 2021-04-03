import React from 'react';
import { Range } from 'rc-slider';
import { useTheme } from 'react-jss';

export default ({ onChange, value }) => {
  const theme = useTheme();

  return (
    <Range
      step={0.5}
      defaultValue={[0, 10]}
      min={0}
      max={10}
      allowCross={true}
      value={value}
      onChange={onChange}
      handleStyle={[{ borderColor: theme.palette.primary.accent }, { borderColor: theme.palette.primary.accent }]}
      trackStyle={[{ backgroundColor: theme.palette.primary.accent }]}
    />
  );
};
