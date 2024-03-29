/* eslint-disable camelcase */
import React, { useState, memo, useRef } from 'react';
import { shell } from 'electron';
import { createUseStyles, useTheme } from 'react-jss';
import Cover from './Cover';
import DownloadBeatmapBtn from './DownloadBeatmapBtn';
import PreviewBeatmapBtn from './PreviewBeatmapBtn';
import renderIcons from '../../../helpers/renderIcons';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import Button from '../Button';
import SetWallpaperButton from './SetWallpaperButton';
import Modes from './Modes';

const bpmToBps = bpm => 60 / bpm;

const useStyles = createUseStyles({
  Beatmap: {
    zIndex: 1,
    position: 'relative',
    fontSize: '14px',
    color: 'white',
    width: ({ width }) => width || '80%',
    background: ({ theme }) => theme.palette.primary.main,
    margin: ({ margin }) => margin || '1.3vh auto',
    paddingBottom: '10px',
    borderRadius: '5px',
    transition: ({ bpm }) => `opacity ${bpmToBps(bpm)}s`,
    '&:hover': {
      opacity: 1.1,
      '&::after': {
        opacity: 0.7,
      },
    },
    '& > div': {
      justifyContent: 'center',
    },
    '& p': {
      margin: 0,
    },
    '&::before, &::after': {
      zIndex: -1,
      position: 'absolute',
      content: "''",
      height: '100%',
      width: '100%',
      borderRadius: '8px',
      top: '0%',
      left: '0%',
      boxShadow: '0 0 15px #287ec6',
      filter: 'blur(1px)',
      animation: ({ bpm, isPlaying }) => (isPlaying ? `$pulse ${bpmToBps(bpm)}s linear infinite` : `none`),
      opacity: ({ isPlaying }) => (isPlaying ? 1 : 0),
      transitionDuration: '.5s',
      transitionDelay: '.2s',
      transitionProperty: 'transform, opacity',
      transitionTimingFunction: 'ease-out',
    },
  },
  MainInformationsContainer: {
    padding: '0 2%',
    margin: '7px 0',
  },
  TextElipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
  Row: {
    display: 'flex',
    alignItems: 'center',
  },
  '@keyframes pulse': {
    '0%': {
      opacity: 0.1,
      transform: 'scale(.990)',
    },
    '60%': {
      transform: 'scale(0.995)',
      opacity: 0.65,
    },
    '100%': {
      transform: 'scale(1.010)',
      opacity: 0,
    },
  },
});


const Beatmap = ({ beatmap, noFade, autoDl, width, ...otherProps }) => {
  const ref = useRef();
  const theme = useTheme();
  const [isPlaying, setIsPLaying] = useState(false);
  const { beatmapset_id, id, title, artist, creator, version, bpm, beatconnectDlLink, beatmaps } = beatmap;
  // beatmap.beatmap_id only when beatmap comes from mpMatch (for bot displays)
  const wallpaperBeatmapId = beatmaps ? beatmaps[Math.max(beatmaps.length - 2, 0)].id : beatmap.beatmap_id;

  const classes = useStyles({ width, theme, isPlaying, bpm: beatmap.bpm, ...otherProps });
  return (
    <div className={classes.Beatmap} ref={ref}>
      {beatmap && (
        <>
          <Cover
            url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`}
            height={130}
            noFade={noFade}
            roundedTop
            beatmapSet={beatmap}
            parentRef={ref}
          />
          <div className="leftContainer" style={{ position: 'absolute', left: '2%', bottom: '3%', maxWidth: '25%' }}>
            <p className={classes.Row} title={creator}>
              {renderIcons({ name: 'Creator', color: 'white' })}
              <span style={{ marginLeft: '2px' }} className={classes.TextElipsis}>
                {creator}
              </span>
            </p>
            <p className={classes.Row} style={{ marginLeft: '-2px' }} title={bpm}>
              {renderIcons({ name: 'Metronome', color: 'white' })}
              <span color="white" style={{ marginLeft: '3px' }}>
                {bpm}
              </span>
            </p>
          </div>
          <div className={classes.MainInformationsContainer}>
            <p title={title} className={classes.TextElipsis}>
              {title}
            </p>
            <p title={artist} className={classes.TextElipsis}>
              {artist}
            </p>
          </div>
          {version && <p>{`[${version || ''}]`}</p>}
          <PreviewBeatmapBtn
            theme={theme}
            beatmapSetId={beatmapset_id || id}
            setIsPLaying={setIsPLaying}
            title={title}
            artist={artist}
          />
          <DownloadBeatmapBtn autoDl={autoDl} beatmapSet={beatmap} />
          <Button
            color={theme.palette.primary.accent}
            onClick={() => shell.openExternal(getBeatmapInfosUrl(beatmap))}
            hidden={!beatmap.title}
          >
            {renderIcons({ name: 'Search', style: theme.accentContrast })}
          </Button>
          <SetWallpaperButton beatmapSetId={beatmapset_id || id} beatmapId={wallpaperBeatmapId} />
          <Modes ctb={beatmap.mode_ctb} std={beatmap.mode_std} mania={beatmap.mode_mania} taiko={beatmap.mode_taiko} />
        </>
      )}
    </div>
  );
};

const areEqual = (prevProps, nextProps) => {
  if (prevProps.beatmap.beatmapset_id) {
    return prevProps.beatmap.beatmapset_id === nextProps.beatmap.beatmapset_id;
  }
  if (prevProps.beatmap.id) {
    return prevProps.beatmap.id === nextProps.beatmap.id;
  }
  return false;
};
export default memo(Beatmap, areEqual);
