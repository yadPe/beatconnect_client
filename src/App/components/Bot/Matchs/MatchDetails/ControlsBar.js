import React from 'react';
import injectSheet from 'react-jss';
import { Button } from 'react-desktop/windows';
import renderIcons from '../../../../utils/renderIcons';

const styles = {
  ControlsBar: {
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: 'transparent',
    margin: 0,
    userSelect: 'none',
  },
  titleContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    fontSize: '90%',
    margin: 0,
    maxWidth: '100vmin',
    overflow: 'hidden',
  },
};

const ControlsBar = ({ classes, theme, match, close }) => {
  return (
    <ul className={classes.ControlsBar} role="navigation">
      <li>
        <Button className="btn back" push color={theme.palette.primary.dark} onClick={() => close()}>
          {renderIcons('Back', theme.accentContrast)}
        </Button>
      </li>
      <li className={classes.titleContainer}>
        <p className={classes.title}>{match.matchName}</p>
      </li>
      <li>
        <Button push color={theme.palette.primary.accent} onClick={match.toggleAutoBeat}>
          {`AutoBeat: ${match.autoBeat ? ' on' : 'off'}`}
        </Button>
      </li>
      <li>
        <Button
          className="btn startMatch"
          push
          color={theme.palette.primary.accent}
          onClick={() => match.start()}
          hidden={!match}
        >
          Start
        </Button>
      </li>
      <li>
        <Button className="btn endMatch" push color={theme.warning} onClick={() => match.close()} hidden={!match}>
          Close
        </Button>
      </li>
    </ul>
  );
};

export default injectSheet(styles)(ControlsBar);
