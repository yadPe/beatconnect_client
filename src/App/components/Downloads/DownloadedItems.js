import React, { useContext } from 'react';
import { FixedSizeList } from 'react-window';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { connect } from 'react-redux';
import DownloadsItem from './Item';

const DownloadedItems = ({ theme, window }) => {
  console.log('DownloadedItems updated')
  const { history } = useContext(HistoryContext);
  const items = [];
  for (let item in history) {
    const { id, date, name } = history[item];
    items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status='downloaded' key={id} />);
  }
  items.sort((a, b) => b.props.date - a.props.date);

  const renderItems = ({index, style}) => (
    <div style={style}>
      {items[index]}
    </div>
  )
  return (
    <div className='downloadMenu DownloadsItem' style={{width: '100%'}}>
      <FixedSizeList
        height={window.height - 79}
        itemCount={items.length}
        itemSize={130}
        width={'100%'}
        className={'downloadMenu'}
      >
        {items.length > 0 ? renderItems : 'The beatmaps you download will go here'}
      </FixedSizeList>
    </div>
  );
}

const mapStateToProps = ({ main }) => ({ window: main.window });
export default connect(mapStateToProps)(DownloadedItems);