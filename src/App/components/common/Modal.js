import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import injectSheet from 'react-jss';

const styles = {
  Modal: {
    backgroundColor: 'rgba(42, 42, 42, 0.95)',
    width: '100%',
  },
  ModalBg: {
    position: 'absolute',
    //left: '50%',
    //top: '50%',
    height: '100%',
    width: '100%',
    //transform: 'translate(-50%)',
    // padding: '12px',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    // border: '1px solid grey',
    zIndex: 10,
  },
};

export const ToggleContent = ({ toggle, content }) => {
  const [isShown, setIsShown] = useState(false);
  const hide = () => setIsShown(false);
  const show = () => setIsShown(true);

  return (
    <>
      {toggle(isShown, setIsShown)}
      {isShown && content(hide)}
    </>
  );
};

const Modal = ({ children, close, classes }) =>
  ReactDOM.createPortal(
    <div className={classes.ModalBg} onClick={close}>
      <div className={classes.Modal} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root'),
  );

export default injectSheet(styles)(Modal);
