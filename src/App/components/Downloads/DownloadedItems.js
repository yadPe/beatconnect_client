import React, { useContext } from 'react';
import { FixedSizeList } from 'react-window';
import { connect } from 'react-redux';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './Item';
import config from '../../../config';

const DownloadedItems = ({ theme, window }) => {
  const { history } = useContext(HistoryContext);
  const items = [];
  Object.values(history).forEach(item => {
    const { id, date, name } = item;
    items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status="downloaded" key={id} />);
  });
  items.sort((a, b) => b.props.date - a.props.date);

  const renderItems = ({ index, style }) => <div style={style}>{items[index]}</div>;
  return (
    <div className="downloadMenu DownloadsItem" style={{ width: '100%' }}>
      <FixedSizeList
        height={window.height - (config.display.titleBarHeight + config.display.topBarHeight)}
        itemCount={items.length}
        itemSize={130}
        overscanCount={2}
        width="100%"
        className="downloadMenu customScroll"
      >
        {items.length > 0 ? renderItems : 'The beatmaps you download will go here'}
      </FixedSizeList>
    </div>
  );
};

const mapStateToProps = ({ main }) => ({ window: main.window });
export default connect(mapStateToProps)(DownloadedItems);
