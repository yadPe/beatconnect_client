import React, { useContext } from 'react';
import { VariableSizeList } from 'react-window';
import { connect } from 'react-redux';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './Item';
import config from '../../../../shared/config';

const DownloadedItems = ({ window }) => {
  const { history } = useContext(HistoryContext);
  const items = [];
  Object.values(history).forEach(item => {
    const { id, date, name } = item;
    items.push(<DownloadsItem id={id} date={date} name={name} status="downloaded" key={id} />);
  });
  items.sort((a, b) => b.props.date - a.props.date);

  const renderItems = ({ index, style }) => (index === 0 ? <div /> : <div style={style}>{items[index - 1]}</div>);
  return (
    <div className="downloadMenu DownloadsItem" style={{ width: '100%' }}>
      <VariableSizeList
        height={window.height}
        itemCount={items.length + 1}
        itemSize={index => (index === 0 ? config.display.topBarHeight : 130)}
        overscanCount={5}
        width="100%"
        className="downloadMenu customScroll"
      >
        {items.length > 0 ? renderItems : 'The beatmaps you download will go here'}
      </VariableSizeList>
    </div>
  );
};

const mapStateToProps = ({ app }) => ({ window: app.window });
export default connect(mapStateToProps)(DownloadedItems);
