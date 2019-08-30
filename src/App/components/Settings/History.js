import React, { useContext } from 'react';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { Button } from 'react-desktop/windows';
import { ipcRenderer } from 'electron';

const History = ({ theme }) => {
  const { history, clear, set } = useContext(HistoryContext)
  return (
    <React.Fragment>
      <p>History</p>
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={clear}
      >
        Clear history
      </Button>
      <Button
        className='btn'
        push
        color={theme.color}
        onClick={() => {
          // TODO 
          ipcRenderer.send('osuSongsScan', 'D:/Games/osu!') // User osu folder path
          ipcRenderer.on('osuSongsScanResults', (e, args) => {
            args = JSON.parse(args)
            if (args.err) console.error(`Error while scannings song: ${args.err}`)
            else set({ ...history, ...args })
          })
        }}
      >
        scan
      </Button>
    </React.Fragment>
  );
}

export default History;