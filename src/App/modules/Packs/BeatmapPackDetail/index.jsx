/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { shell } from 'electron';
import InjectSheet, { withTheme } from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import { compose } from 'redux';
import { connect } from 'react-redux';
import reqImgAssets from '../../../helpers/reqImgAssets';
import { useAudioPlayer } from '../../../Providers/AudioPlayerProvider.bs';
import DownloadBeatmapBtn from '../../common/Beatmap/DownloadBeatmapBtn';
import renderIcons from '../../../helpers/renderIcons';
import getBeatmapInfosUrl from '../../../helpers/getBeatmapInfosUrl';
import Header from './Header';
import config from '../../../../shared/config';

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

const BeatmapPackDetail = ({ classes, windowSize, panelExpended, pack, select }) => {
  const [filter, setFilter] = useState('');
  useEffect(() => {
    select({ header: <Header pack={pack} quit={() => select({ pack: null })} filter={{ filter, setFilter }} /> });
  }, []);

  const audioPlayer = useAudioPlayer();
  const playPreview = (beatmapSetId, isPlaying, songTitle) =>
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId, null, songTitle);

  const filteredBeatmapsets =
    filter !== ''
      ? pack.beatmapsets.filter(
          ({ title, artist }) =>
            title.toLowerCase().includes(filter.toLowerCase()) || artist.toLowerCase().includes(filter.toLowerCase()),
        )
      : pack.beatmapsets;

  const itemCount = filteredBeatmapsets.length + 1; // +1 for top spacer

  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;

  const renderRow = ({ index, style }) => {
    if (index === 0) {
      return <div style={style} key="PackListSpacer" />;
    }

    const offsetedIndex = index - 1;
    const item = filteredBeatmapsets[offsetedIndex];
    const { id, title, artist } = item;
    const isPlaying = audioPlayer.playingState.beatmapSetId === id;
    const wrapperStyle = {
      backgroundColor: isPlaying && 'rgba(255,255,255,.05)',
    };
    const playIcoStyle = {
      opacity: isPlaying && 0.9,
      backgroundImage: `url(${reqImgAssets(isPlaying ? './pause-button.png' : './play-button.png')})`,
    };

    return (
      <div style={style} key={id}>
        <div className={classes.listItem} style={wrapperStyle}>
          <div className={`${classes.thumbnail} thumbnail`} style={{ backgroundImage: `url(${getThumbUrl(id)})` }}>
            <div
              className="playIco clickable"
              style={playIcoStyle}
              role="button"
              onClick={() => playPreview(id, isPlaying, `${title} - ${artist}`)}
            />
          </div>
          <div className={classes.title}>{title}</div>
          <div className={classes.artist}>{artist}</div>
          <DownloadBeatmapBtn
            beatmapSet={item}
            title="Download"
            noStyle
            className={`${classes.downloadButton} clickable`}
          />
          <div
            onClick={() => shell.openExternal(getBeatmapInfosUrl(item))}
            role="button"
            title="See beatmap page"
            className={`${classes.beatmapPageButton}  clickable`}
          >
            {renderIcons({ name: 'Search' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.wrapper}>
      <List height={listHeight} itemCount={itemCount} itemSize={50} width={listWidth}>
        {renderRow}
      </List>
    </div>
  );
};

const mapStateToProps = ({ app, settings }) => ({
  windowSize: app.window,
  panelExpended: settings.userPreferences.sidePanelExpended,
});
export default compose(
  connect(mapStateToProps),
  withTheme,
  InjectSheet(styles),
)(BeatmapPackDetail);
