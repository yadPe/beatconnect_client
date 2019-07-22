import React, { useContext } from 'react'
import { HistoryContext } from '../../../HistoryProvider';

const Downloads = () => {
  const { history } = useContext(HistoryContext);
  console.log(history)
  const renderDownloads = () => {
    const items = [];
    for ( let item in history ){
      items.push(history[item]);
    }
    console.log(items)
    items.sort((a,b) => b.date - a.date);
    console.log(items)
    return items.map(item => <div>{JSON.stringify(item)}</div>)
  }
  return (
    <div className='menuContainer Downloads'>
      {renderDownloads()}
    </div>
  );
}

export default Downloads;