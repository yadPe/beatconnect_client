import React, { useContext } from 'react'
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './DownloadsItem';

const DownloadedItems = ({ theme }) => {
  const { history } = useContext(HistoryContext);
  //console.log(history)
  const renderDownloads = () => {
    const items = [];
    for (let item in history) {
      const { id, date, name } = history[item];
      items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status='downloaded' />);
    }
    //items.sort((a, b) => b.date - a.date);
    //console.log(items)
    return items.sort((a, b) => b.props.date - a.props.date);
  }
  return (
    <React.Fragment>
      {renderDownloads()}
    </React.Fragment>
  );
}

export default DownloadedItems;