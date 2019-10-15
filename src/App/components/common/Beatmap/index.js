import React, { useState, useEffect, memo, useRef } from 'react';
import Cover from './Cover';
import { Button, Text } from 'react-desktop/windows';
import DownloadBeatmapBtn from './DownloadBeatmapBtn';
import PreviewBeatmapBtn from './PreviewBeatmapBtn';
import { shell } from 'electron';
import renderIcons from '../../../utils/renderIcons';
import getBeatmapInfosUrl from '../../../utils/getBeatmapInfosUrl';
import Badge from '../Badge';

const reqImgAssets = require.context('../../../../assets/img', true, /\.png$/);

const Beatmap = ({ theme, beatmap, width, noFade, autoDl }) => {
  // console.log('updated', beatmap)
  const getDownloadUrl = ({ id, unique_id }) => {
    return `https://beatconnect.io/b/${id}/${unique_id}`;
  };
  const [brightness, setBrightness] = useState(0.95);
  const [isPlaying, setIsPLaying] = useState(false);
  const { beatmapset_id, id, title, artist, creator, version, beatconnectDlLink } = beatmap;

  const bpmFlash = useRef(null);

  const style = isPlaying
    ? {
        width: width || '',
        filter: `brightness(${brightness})`,
        transitionDuration: `${50}ms`,
      }
    : {
        width: width || '',
      };

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
    return () => (bpmFlash.current ? clearInterval(bpmFlash.current) : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  useEffect(() => {
    return () => (bpmFlash.current ? clearInterval(bpmFlash.current) : undefined);
  }, []);

  return (
    <div className="Beatmap" style={style} onClick={() => setIsPLaying(true)}>
      {beatmap ? (
        <React.Fragment>
          <Cover
            url={`https://assets.ppy.sh/beatmaps/${beatmapset_id || id}/covers/cover.jpg`}
            height={130}
            noFade={noFade}
          />
          <Text color="#fff">{title}</Text>
          <Text color="#fff">{artist}</Text>
          {version ? <Text color="#fff">{`[${version || ''}]`}</Text> : null}
          <PreviewBeatmapBtn theme={theme} beatmapSetId={beatmapset_id || id} setIsPLaying={setIsPLaying} />
          <DownloadBeatmapBtn
            theme={theme}
            autoDl={autoDl}
            url={beatconnectDlLink || getDownloadUrl(beatmap)}
            infos={{ title, artist, creator, id: beatmapset_id || id }}
          />
          <Button
            push
            color={theme.color}
            onClick={() => shell.openExternal(getBeatmapInfosUrl(beatmap))}
            hidden={!beatmap.title}
          >
            {renderIcons('Search', theme.style)}
          </Button>
          <div
            className="rightContainer"
            style={{ position: 'absolute', right: '1%', bottom: '4%', display: 'inline-flex', margin: '0.2vw' }}
          >
            <div className="availableModes" style={{ padding: '0 3px', display: 'inline-flex' }}>
              {beatmap.mode_std ? (
                <img alt="std" title="Standard" className="pill std" style={modePillsStyle('std')} />
              ) : null}
              {beatmap.mode_mania ? (
                <img alt="mania" title="Mania" className="pill mania" style={modePillsStyle('mania')} />
              ) : null}
              {beatmap.mode_taiko ? (
                <img alt="taiko" title="Taiko" className="pill taiko" style={modePillsStyle('taiko')} />
              ) : null}
              {beatmap.mode_ctb ? (
                <img alt="ctb" title="Catch The Beat" className="pill ctb" style={modePillsStyle('ctb')} />
              ) : null}
            </div>
            {beatmap.status ? <Badge status={beatmap.status} /> : null}
          </div>
        </React.Fragment>
      ) : null}
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
