import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import Start from './components/Start';
import Matchs from './Matchs';
import config from '../../../shared/config';
import { getFadeIn, sectionSwitchAnimation } from '../../helpers/css.utils';

const useStyles = createUseStyles({
  ...getFadeIn(),
  Bot: {
    paddingTop: `${config.display.topBarHeight}px`,
    ...sectionSwitchAnimation(),
  },
});

const Bot = ({ connected, bot, theme, setHeaderContent }) => {
  const classes = useStyles();
  useEffect(() => {
    setHeaderContent(<Start connected={connected} />);
    return () => setHeaderContent(null);
  }, [setHeaderContent, connected, theme]);

  return (
    <div className={`menuContainer ${classes.Bot}`}>
      <Matchs bot={bot} connected={connected} />
    </div>
  );
};

export default Bot;
