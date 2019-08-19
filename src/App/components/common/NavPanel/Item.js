import React from 'react';
import injectSheet from 'react-jss';

const style = {
  display: 'flex',
  flex: '1 1 0%',
  flexDirection: 'column',
  padding: props => props.padding,
  background: props => props.background,
};

const Item = ({ color, icon, selected, title, dark, padding, children, background, onSelect }) => {
  console.log(children)
  return (
    {...children}
  );
}

Item.defaultProps = {
  title: '',
  background: '#000',
  padding: 0,
}

export default injectSheet(style)(Item);