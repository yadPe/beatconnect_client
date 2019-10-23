import React from 'react';
import InjectSheet from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import { compose } from 'redux';
import { connect } from 'react-redux';
import year from './yearly.json';

const styles = {
  wrapper: {
    padding: '1.5rem 4rem',
  },
  listItem: {
    flex: '1',
    display: 'flex',
    overflow: 'hidden',
    borderBottom: '1px solid rgba(255, 255, 255, .08)',
  },
  thumbnail: {
    backgroundSize: 'cover',
    width: '50px',
    height: '40px',
    marginRight: '13px',
    marginBottom: '5px',
  },
  title: {
    display: 'flex',
    flex: '6 1 0',
    justifyContent: 'space-between',
    overflow: 'hidden',
    fontSize: '15pt',
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
  const { beatmapsets } = pack;
  const renderRow = ({ index, style }) => (
    <div style={style}>
      <div className={classes.listItem}>
        {/* <div>{`.${index + 1}`}</div> */}
        <div className={classes.thumbnail} style={{ backgroundImage: `url(${getThumbUrl(beatmapsets[index].id)})` }} />
        <div className={classes.title}>{beatmapsets[index].title}</div>
        <div className={classes.artist}>{beatmapsets[index].artist}</div>
      </div>
    </div>
  );
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
