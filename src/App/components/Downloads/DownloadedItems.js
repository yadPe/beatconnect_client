import React, { useContext, memo, useCallback } from 'react'
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './Item';

const DownloadedItems = ({ theme }) => {
  console.log('DownloadedItems updated')
  const { history } = useContext(HistoryContext);
    const items = [];
    for (let item in history) {
      const { id, date, name } = history[item];
      items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status='downloaded' key={id} />);
    }
  items.sort((a, b) => b.props.date - a.props.date);
  return (
    <div className='downloadMenu DownloadsItem'>
      {items.length > 0 ? items : 'The beatmaps you download will go here'}
    </div>
  );
}

export default DownloadedItems;