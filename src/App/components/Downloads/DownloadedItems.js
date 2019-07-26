import React, { useContext } from 'react'
import { HistoryContext } from '../../../HistoryProvider';
import DownloadsItem from './DownloadsItem';

const DownloadedItems = ({ theme }) => {
  const { history } = useContext(HistoryContext);
  console.log(history)
  const renderDownloads = () => {
    const items = [];
    for (let item in history) {
      const { id, date, name } = history[item];
      items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} />);
    }
    //items.sort((a, b) => b.date - a.date);
    //console.log(items)
    return items.reverse();
  }
  return (
    <React.Fragment>
      <div className='separator' />
      {renderDownloads()}
    </React.Fragment>
  );
}

export default DownloadedItems;