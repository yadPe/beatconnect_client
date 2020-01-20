import React from 'react';
import { createUseStyles, useTheme } from 'react-jss';
import renderIcons from '../../../../helpers/renderIcons';
import Button from '../../../common/Button';

const useStyles = createUseStyles({
  ControlsBar: {
    padding: 0,
    listStyle: 'none',
    display: 'flex',
    backgroundColor: ({ theme }) => theme.palette.primary.main,
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
});

const ControlsBar = ({ match, close }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <ul className={classes.ControlsBar} role="navigation">
      <li>
        <Button className="btn back" push color={theme.palette.primary.main} onClick={() => close()}>
          {renderIcons({ name: 'Back', style: theme.accentContrast })}
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

export default ControlsBar;
