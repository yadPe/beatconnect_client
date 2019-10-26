/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useState } from 'react';
import { shell } from 'electron';
import InjectSheet from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { useTheme } from 'theming';
import year from '../yearly.json';
import reqImgAssets from '../../../utils/reqImgAssets';
import { AudioPlayerContext } from '../../../../Providers/AudioPlayerProvider';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import { getDownloadUrl } from '../../common/Beatmap';
import renderIcons from '../../../utils/renderIcons';
import getBeatmapInfosUrl from '../../../utils/getBeatmapInfosUrl';
import Header from './Header';

export { Header };

const styles = {
  wrapper: {
    // padding: '1.5rem 4rem',
    '& svg': {
      display: 'block',
      margin: 'auto',
    },
  },
  listItem: {
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    // borderBottom: '1px solid rgba(255, 255, 255, .08)',
    boxShadow: '0px 24px 1px -24px rgba(255, 255, 255, .3)',
    '&:hover .playIco': {
      opacity: 0.9,
    },
    '& .clickable': {
      cursor: 'pointer',
    },
  },
  thumbnail: {
    backgroundSize: 'cover',
    width: '50px',
    height: '40px',
    margin: '5px 15px 5px 35px',
    position: 'relative',
    '& .playIco': {
      position: 'absolute',
      content: '',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '20px',
    },
  },
  title: {
    display: 'flex',
    flex: '6 1 0',
    justifyContent: 'space-between',
    overflow: 'hidden',
    fontSize: '15pt',
    alignItems: 'center',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingRight: '10px',
  },
  artist: {
    flex: '9 1 0',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    color: '#aaa',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '13pt',
  },
  downloadButton: {
    display: 'flex',
  },
  beatmapPageButton: {
    marginRight: '35px',
    marginLeft: '15px',
    display: 'flex',
  },
};

const getThumbUrl = beatmapId => `https://b.ppy.sh/thumb/${beatmapId}.jpg`;

const BeatmapPackDetail = ({ classes, windowSize, panelExpended, pack = JSON.parse(year[1]), select }) => {
  const [filter, setFilter] = useState('');
  // select({ header: <Header pack={pack} quit={() => select({ content: null })} filter={{ filter, setFilter }} /> });
  useEffect(() => {
    select({ header: <Header pack={pack} quit={() => select({ pack: null })} filter={{ filter, setFilter }} /> });
  }, []);
  const listWidth = windowSize.width - (panelExpended ? 150 : 48);
  const listHeight = windowSize.height - 79;

  const audioPlayer = useContext(AudioPlayerContext);
  const playPreview = (beatmapSetId, isPlaying) =>
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId);
  const beatmapsets =
    filter !== ''
      ? pack.beatmapsets.filter(
          ({ title, artist }) =>
            title.toLowerCase().includes(filter.toLowerCase()) || artist.toLowerCase().includes(filter.toLowerCase()),
        )
      : pack.beatmapsets;
  // optimization needed (useCallback or memo ?) k
  const renderRow = ({ index, style }) => {
    const theme = useTheme();
    const isPlaying = audioPlayer.isPlaying === beatmapsets[index].id;
    const wrapperStyle = {
      backgroundColor: isPlaying && 'rgba(255,255,255,.05)',
    };
    const playIcoStyle = {
      opacity: isPlaying && 0.9,
      backgroundImage: `url(${reqImgAssets(isPlaying ? './pause-button.png' : './play-button.png')})`,
    };
    return (
      <div style={style} key={beatmapsets[index].id}>
        <div className={classes.listItem} style={wrapperStyle}>
          <div
            className={`${classes.thumbnail} thumbnail`}
            style={{ backgroundImage: `url(${getThumbUrl(beatmapsets[index].id)})` }}
          >
            <div
              className="playIco clickable"
              style={playIcoStyle}
              role="button"
              onClick={() => playPreview(beatmapsets[index].id, isPlaying)}
            />
          </div>
          <div className={classes.title}>{beatmapsets[index].title}</div>
          <div className={classes.artist}>{beatmapsets[index].artist}</div>
          <DownloadBeatmapBtn
            url={getDownloadUrl(beatmapsets[index])}
            infos={beatmapsets[index]}
            title="Download"
            noStyle
            className={`${classes.downloadButton} clickable`}
          />
          <div
            onClick={() => shell.openExternal(getBeatmapInfosUrl(beatmapsets[index]))}
            role="button"
            title="See beatmap page"
            className={`${classes.beatmapPageButton}  clickable`}
          >
            {renderIcons('Search', theme.style)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.wrapper}>
      <List height={listHeight} itemCount={beatmapsets.length} itemSize={50} width={listWidth}>
        {renderRow}
      </List>
    </div>
  );
};

const mapStateToProps = ({ main, settings }) => ({
  windowSize: main.window,
  panelExpended: settings.userPreferences.sidePanelExpended,
});
export default compose(
  connect(mapStateToProps),
  InjectSheet(styles),
)(BeatmapPackDetail);
