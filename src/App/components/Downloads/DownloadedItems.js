import React, { useContext, memo, useCallback } from 'react'
import { HistoryContext } from '../../../Providers/HistoryProvider';
import DownloadsItem from './DownloadsItem';

const DownloadedItems = ({ theme }) => {
  console.log('DownloadedItems updated')
  const { history } = useContext(HistoryContext);
    const items = [];
    for (let item in history) {
      console.log(item, 'loop')
      const { id, date, name } = history[item];
      items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status='downloaded' key={`downloaded${id}`} />);
    }
  items.sort((a, b) => b.props.date - a.props.date);
  //console.log(history)
  //const { history } = useContext(HistoryContext);
  //console.log(history)
  // const renderDownloads = useCallback(() => {
  //   const items = [];
  //   for (let item in history) {
  //     const { id, date, name } = history[item];
  //     items.push(<DownloadsItem id={id} date={date} name={name} theme={theme} status='downloaded' key={`downloaded${id}`} />);
  //   }
  //   //items.sort((a, b) => b.date - a.date);
  //   console.log('sort')
  //   return items.sort((a, b) => b.props.date - a.props.date);
  // }, [])
  return (
    <div className='downloadMenu DownloadsItem'>
      {items}
    </div>
  );
}

const areEqual = (prevProps, nextProps) => {
  console.log('equalllll ?')
  // return false
  const { history } = prevProps;
  const { newHistory } = nextProps;
  const isEqual = JSON.stringify(history) === JSON.stringify(newHistory)
  console.log('==================')
  console.log(isEqual)
  console.log('==================')
  return isEqual
  // if (progress){
  //   console.log('==================')
  //   console.log(status === newStatus && progress.progress === newProgress.progress)
  //   console.log('==================')
  //   return status === newStatus && progress.progress === newProgress.progress
  // }
  // console.log('==================')
  // console.log(status === newStatus)
  // console.log('==================')
  // return status === newStatus
}
export default memo(DownloadedItems, areEqual); 