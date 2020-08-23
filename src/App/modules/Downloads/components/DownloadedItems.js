import React, { useContext } from 'react';
import { VariableSizeList } from 'react-window';
import { connect } from 'react-redux';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './Item';
import config from '../../../../shared/config';

const DownloadedItems = ({ window }) => {
  const { history } = useContext(HistoryContext);
  const sortedHistory = Object.values(history).sort((itemA, itemB) => itemB.date - itemA.date);
  const items = sortedHistory.map(item => {
    const { id, date, name } = item;
    return isScrolling => (
      <DownloadsItem id={id} date={date} name={name} status="downloaded" key={id} isScrolling={isScrolling} />
    );
  });

  const renderItems = ({ index, style, isScrolling }) =>
    index === 0 ? <div /> : <div style={style}>{items[index - 1](isScrolling)}</div>;
  return (
    <div className="downloadMenu DownloadsItem" style={{ width: '100%' }}>
      {items.length ? (
        <VariableSizeList
          height={window.height}
          itemCount={items.length + 1}
          itemSize={index => (index === 0 ? config.display.topBarHeight : 130)}
          overscanCount={5}
          width="100%"
          className="downloadMenu customScroll"
          useIsScrolling
        >
          {renderItems}
        </VariableSizeList>
      ) : (
        <span style={{ marginTop: `calc(${config.display.topBarHeight}px + 1rem)`, display: 'block' }}>
          The beatmaps you download will go here
        </span>
      )}
    </div>
  );
};

const mapStateToProps = ({ app }) => ({ window: app.window });
export default connect(mapStateToProps)(DownloadedItems);
