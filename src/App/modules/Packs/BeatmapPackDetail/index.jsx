import React, { useEffect, useState } from 'react';
import InjectSheet, { withTheme } from 'react-jss';
import { FixedSizeList as List } from 'react-window';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import config from '../../../../shared/config';
import BeatmapListItem from './Item';

const styles = {
  wrapper: {
    overflow: 'hidden',
    '& svg': {
      display: 'block',
      margin: 'auto',
    },
  },
};

const BeatmapPackDetail = ({ classes, windowSize, pack, select }) => {
  const [filter, setFilter] = useState('');
  useEffect(() => {
    select({ header: <Header pack={pack} quit={() => select({ pack: null })} filter={{ filter, setFilter }} /> });
  }, []);

  const filteredBeatmapsets =
    filter !== ''
      ? pack.beatmapsets.filter(
          ({ title, artist }) =>
            title.toLowerCase().includes(filter.toLowerCase()) || artist.toLowerCase().includes(filter.toLowerCase()),
        )
      : pack.beatmapsets;

  const listWidth = windowSize.width - config.display.sidePanelCompactedLength;
  const listHeight = windowSize.height;

  return (
    <div className={classes.wrapper}>
      <List height={listHeight} itemCount={filteredBeatmapsets.length} itemSize={50} width={listWidth}>
        {({ index, style }) => (
          <BeatmapListItem
            style={{ ...style, top: `${parseFloat(style.top) + 50}px` }}
            item={filteredBeatmapsets[index]}
          />
        )}
      </List>
    </div>
  );
};

const mapStateToProps = ({ app }) => ({
  windowSize: app.window,
});
export default compose(
  connect(mapStateToProps),
  withTheme,
  InjectSheet(styles),
)(BeatmapPackDetail);
