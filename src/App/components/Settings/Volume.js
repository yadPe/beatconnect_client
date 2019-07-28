import React from 'react';

const Volume = ({ value, onChange }) => (
  <React.Fragment>
    <p>Volume</p>
    <input type="range" min="0" max="100" value={value} className="Volume" id="myRange" onChange={onChange}></input>
  </React.Fragment>
);

export default Volume;