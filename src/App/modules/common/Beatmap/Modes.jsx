import React from 'react';
import { createUseStyles } from 'react-jss';
import reqImgAssets from '../../../helpers/reqImgAssets';

const modePillsStyle = mode => ({
  width: 20,
  height: 20,
  margin: '3px',
  backgroundSize: 'contain',
  filter: 'brightness(0.85)',
  content: `url(${reqImgAssets(`./${mode}.png`)})`,
});

const useStyle = createUseStyles({
  availableModes: {
    padding: '0 3px',
    display: 'inline-flex',
    '& > .pill': {
      transition: 'opacity 200ms ease',
    },
    '&.hasHighlight > .pill': {
      opacity: 0.15,
    },
    '&.hasHighlight > .pill.highlight': {
      opacity: 1,
    },
  },
});

const Modes = ({ std, mania, taiko, ctb }) => {
  const classes = useStyle();
  return (
    <div
      className="rightContainer"
      style={{ position: 'absolute', right: '1%', bottom: '4%', display: 'inline-flex', margin: '0.2vw' }}
    >
      <div className={`${classes.availableModes} availableModes`} style={{ padding: '0 3px', display: 'inline-flex' }}>
        {std && <img alt="std" title="Standard" className="pill std" style={modePillsStyle('std')} />}
        {mania && <img alt="mania" title="Mania" className="pill mania" style={modePillsStyle('mania')} />}
        {taiko && <img alt="taiko" title="Taiko" className="pill taiko" style={modePillsStyle('taiko')} />}
        {ctb && <img alt="ctb" title="Catch The Beat" className="pill ctb" style={modePillsStyle('ctb')} />}
      </div>
    </div>
  );
};

Modes.defaultProps = {
  std: false,
  mania: false,
  taiko: false,
  ctb: false,
};

export default Modes;
