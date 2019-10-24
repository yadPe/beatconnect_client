import React, { useContext } from 'react';
import InjectSheet from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import { compose } from 'redux';
import { connect } from 'react-redux';
import year from './yearly.json';
import reqImgAssets from '../../utils/reqImgAssets.js';
import { AudioPlayerContext } from '../../../Providers/AudioPlayerProvider.js';

const styles = {
  wrapper: {
    // padding: '1.5rem 4rem',
  },
  listItem: {
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    // borderBottom: '1px solid rgba(255, 255, 255, .08)',
    boxShadow: '0px 24px 1px -24px rgba(255, 255, 255, .2)',
    '&:hover .playIco': {
      opacity: 0.9,
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
      cursor: 'pointer',
    },
  },
  title: {
    display: 'flex',
    flex: '6 1 0',
    justifyContent: 'space-between',
    overflow: 'hidden',
    fontSize: '15pt',
    alignItems: 'center',
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
};

const getThumbUrl = beatmapId => `https://b.ppy.sh/thumb/${beatmapId}.jpg`;

const BeatmapPackDetail = ({ classes, windowSize, panelExpended, pack = year[1] }) => {
  const listWidth = windowSize.width - (panelExpended ? 150 : 48);
  const listHeight = windowSize.height - 79;

  const audioPlayer = useContext(AudioPlayerContext);

  const playPreview = (beatmapSetId, isPlaying) =>
    isPlaying ? audioPlayer.pause() : audioPlayer.setAudio(beatmapSetId);

  const { beatmapsets } = pack;
  // optimization needed (useCallback or memo ?)
  const renderRow = ({ index, style }) => {
    const isPlaying = audioPlayer.isPlaying === beatmapsets[index].id;
    const wrapperStyle = {
      backgroundColor: isPlaying && 'rgba(255,255,255,.05)',
    };
    const playIcoStyle = {
      opacity: isPlaying && 0.9,
      backgroundImage: `url(${reqImgAssets(isPlaying ? './pause-button.png' : './play-button.png')})`,
    };
    return (
      <div style={style}>
        <div className={classes.listItem} style={wrapperStyle}>
          {/* <div>{`.${index + 1}`}</div> */}
          <div
            className={`${classes.thumbnail} thumbnail`}
            style={{ backgroundImage: `url(${getThumbUrl(beatmapsets[index].id)})` }}
          >
            <div
              className="playIco"
              style={playIcoStyle}
              onClick={() => playPreview(beatmapsets[index].id, isPlaying)}
            />
          </div>
          <div className={classes.title}>{beatmapsets[index].title}</div>
          <div className={classes.artist}>{beatmapsets[index].artist}</div>
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
