/* eslint-disable camelcase */
import React, { useState, useEffect, memo, useRef } from 'react';
import { Button, Text } from 'react-desktop/windows';
import { shell } from 'electron';
import { useTheme, withTheme } from 'theming';
import InjectSheet from 'react-jss';
import { compose } from 'redux';
import Cover from './Cover';
import DownloadBeatmapBtn from './DownloadBeatmapBtn';
import PreviewBeatmapBtn from './PreviewBeatmapBtn';
import renderIcons from '../../../utils/renderIcons';
import getBeatmapInfosUrl from '../../../utils/getBeatmapInfosUrl';
import Badge from '../Badge';
import reqImgAssets from '../../../utils/reqImgAssets';

const styles = {
  Beatmap: {
    width: ({ width }) => width || '80%',
    background: ({ theme }) => theme.palette.primary.main,
    margin: '1.3vh auto',
    paddingBottom: '10px',
    filter: 'brightness(0.95)',
    transitionProperty: 'filter !important',
    transitionTimingFunction: 'linear !important',
    '&:hover': {
      filter: 'brightness(1.1)',
    },
    '& > div': {
      justifyContent: 'center',
    },
  },
};

export const getDownloadUrl = ({ id, unique_id }) => `https://beatconnect.io/b/${id}/${unique_id}`;

const Beatmap = ({ beatmap, noFade, autoDl, classes }) => {
  const theme = useTheme();
  const [brightness, setBrightness] = useState(0.95);
  const [isPlaying, setIsPLaying] = useState(false);
  const { beatmapset_id, id, title, artist, creator, version, beatconnectDlLink } = beatmap;

  const bpmFlash = useRef(null);

  const style = isPlaying
    ? {
        filter: `brightness(${brightness})`,
        transitionDuration: `${50}ms`,
      }
    : {};

  const modePillsStyle = mode => ({
    width: 20,
    height: 20,
    margin: '3px',
    backgroundSize: 'contain',
    filter: 'brightness(0.85)',
    content: `url(${reqImgAssets(`./${mode}.png`)})`,
  });

  useEffect(() => {
    if (isPlaying) {
      bpmFlash.current = setInterval(() => {
        setBrightness(1.08);
        setTimeout(() => setBrightness(0.95), 60000 / beatmap.bpm / 2.5);
      }, 60000 / beatmap.bpm);
    }
    return () => bpmFlash.current && clearInterval(bpmFlash.current);
  }, [isPlaying]);

  useEffect(() => {
    return () => bpmFlash.current && clearInterval(bpmFlash.current);
  }, []);

  return (
    <div className={classes.Beatmap} style={style}>
      {beatmap && (
        <>
          <Cover
            url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`}
            height={130}
            noFade={noFade}
          />
          <Text color="#fff">{title}</Text>
          <Text color="#fff">{artist}</Text>
          {version && <Text color="#fff">{`[${version || ''}]`}</Text>}
          <PreviewBeatmapBtn theme={theme} beatmapSetId={beatmapset_id || id} setIsPLaying={setIsPLaying} />
          <DownloadBeatmapBtn
            autoDl={autoDl}
            url={beatconnectDlLink || getDownloadUrl(beatmap)}
            infos={{ title, artist, creator, id: beatmapset_id || id }}
          />
          <Button
            push
            color={theme.palette.primary.accent}
            onClick={() => shell.openExternal(getBeatmapInfosUrl(beatmap))}
            hidden={!beatmap.title}
          >
            {renderIcons('Search', theme.accentContrast)}
          </Button>
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
            {beatmap.status && <Badge status={beatmap.status} />}
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
export default compose(
  withTheme,
  InjectSheet(styles),
)(memo(Beatmap, areEqual));
