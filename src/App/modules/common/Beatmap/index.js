/* eslint-disable camelcase */
import React, { useState, memo } from 'react';
import { Text } from 'react-desktop/windows';
import { shell } from 'electron';
import { createUseStyles, useTheme } from 'react-jss';
import Cover from './Cover';
import DownloadBeatmapBtn from './DownloadBeatmapBtn';
import PreviewBeatmapBtn from './PreviewBeatmapBtn';
import renderIcons from '../../../helpers/renderIcons';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import { make as Badge } from '../Badge.bs';
import reqImgAssets from '../../../helpers/reqImgAssets';
import Button from '../Button';
import SetWallpaperButton from './SetWallpaperButton';

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

export const getDownloadUrl = ({ id, unique_id }) => `https://beatconnect.io/b/${id}/${unique_id}`;

const Beatmap = ({ beatmap, noFade, autoDl, width, ...otherProps }) => {
  const theme = useTheme();
  const [isPlaying, setIsPLaying] = useState(false);
  const { beatmapset_id, id, title, artist, creator, version, bpm, beatconnectDlLink, beatmaps } = beatmap;
  const wallpaperBeatmapId = beatmaps[Math.max(beatmaps.length - 2, 0)].id;

  const modePillsStyle = mode => ({
    width: 20,
    height: 20,
    margin: '3px',
    backgroundSize: 'contain',
    filter: 'brightness(0.85)',
    content: `url(${reqImgAssets(`./${mode}.png`)})`,
  });

  const classes = useStyles({ width, theme, isPlaying, bpm: beatmap.bpm, ...otherProps });
  return (
    <div className={classes.Beatmap}>
      {beatmap && (
        <>
          {beatmap.status && <Badge style={{ position: 'absolute', top: '4%', right: '1%' }} status={beatmap.status} />}
          <Cover
            url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`}
            height={130}
            noFade={noFade}
          />
          <div className="leftContainer" style={{ position: 'absolute', left: '2%', bottom: '3%' }}>
            <p className={classes.Row}>
              {renderIcons({ name: 'Creator', color: 'white' })}
              <span style={{ marginLeft: '2px' }}>{creator}</span>
            </p>
            <p className={classes.Row} style={{ marginLeft: '-2px' }}>
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
            songTitle={`${title} - ${artist}`}
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
          <div
            className="rightContainer"
            style={{ position: 'absolute', right: '1%', bottom: '4%', display: 'inline-flex', margin: '0.2vw' }}
          >
            <div className="availableModes" style={{ padding: '0 3px', display: 'inline-flex' }}>
              {beatmap.mode_std && (
                <img alt="std" title="Standard" className="pill std" style={modePillsStyle('std')} />
              )}
              {beatmap.mode_mania && (
                <img alt="mania" title="Mania" className="pill mania" style={modePillsStyle('mania')} />
              )}
              {beatmap.mode_taiko && (
                <img alt="taiko" title="Taiko" className="pill taiko" style={modePillsStyle('taiko')} />
              )}
              {beatmap.mode_ctb && (
                <img alt="ctb" title="Catch The Beat" className="pill ctb" style={modePillsStyle('ctb')} />
              )}
            </div>
          </div>
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
