import React, { useEffect } from 'react';
import Start from './Start';
import Matchs from './Matchs'

const Bot = ({ connected, matchs, bot, theme, setHeaderContent }) => {
  useEffect(() => {
    setHeaderContent(<Start connected={connected} theme={theme} />)
    return () => setHeaderContent(null)
  }, [setHeaderContent, connected, theme])

  return (
    <div className='menuContainer'>
      <Matchs matchs={matchs} theme={theme} bot={bot} connected={connected} />
    </div>
  );
}

export default Bot; 