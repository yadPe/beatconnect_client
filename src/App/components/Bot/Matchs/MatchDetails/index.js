import React from 'react';
import { createUseStyles } from 'react-jss';
import Beatmap from '../../../common/Beatmap';
import PlayersList from './PlayersList';
import ControlsBar from './ControlsBar';

const useStyles = createUseStyles({
  MatchDetails: {
    padding: 12,
    display: 'grid',
    gridTemplateColumns: '41% 58%',
    gridTemplateRows: 'auto',
    gridGap: '12px',
    gridTemplateAreas: `
    'playerList beatmap'`,
  },
});

const MatchDetails = ({ match, close }) => {
  const classes = useStyles();
  return (
    <>
      <ControlsBar match={match} close={close} />
      <div className={classes.MatchDetails}>
        <div className="playerList">{match.players ? <PlayersList players={match.players} match={match} /> : null}</div>
        <div className="beatmap">
          {match.fullBeatmapData ? (
            <Beatmap beatmap={match.fullBeatmapData} width="100%" margin="0" />
          ) : (
            'Asking peppy...'
          )}
        </div>
      </div>
    </>
  );
};

export default MatchDetails;
