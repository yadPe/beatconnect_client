import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { createUseStyles, useTheme } from 'react-jss';

import renderIcons from '../../helpers/renderIcons';

const useStyle = createUseStyles({
  Modal: {
    backgroundColor: '#2A2A2A',
    color: 'white',
    width: 'fit-content',
    '& header': {
      display: 'flex',
      padding: '15px',
      backgroundColor: '#1D1D1D',
      '& h3': {
        margin: 0,
        marginRight: '10px',
      },
      '& .closeButton': {
        marginLeft: 'auto',
      },
    },
    '& body': {
      padding: '15px',
      margin: 0,
    },
  },
  ModalBg: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: '0',
    top: '0',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 10,
  },
});

export const useDisclosure = (defaultIsOpen = false) => {
  let [isOpen, setIsOpen] = useState(() => defaultIsOpen);

  return {
    isOpen: isOpen,
    show: React.useCallback(() => setIsOpen(true)),
    hide: React.useCallback(() => setIsOpen(false)),
    toggle: React.useCallback(() => setIsOpen(isOpen => !isOpen)),
  };
};

export const Modal = ({ children, hide, title }) => {
  const classes = useStyle();

  return ReactDOM.createPortal(
    <div className={classes.ModalBg} onClick={() => hide()}>
      <div className={classes.Modal} onClick={e => e.stopPropagation()}>
        <header>
          {title && <h3>{title}</h3>}
          <div className="closeButton" onClick={() => hide()}>
            {renderIcons({ name: 'Cancel', heigh: '20px', width: '20px' })}
          </div>
        </header>
        <body>{children}</body>
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
};
