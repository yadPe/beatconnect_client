import React, { useContext } from 'react';
import { remote } from 'electron';
import { HistoryContext } from '../../../Providers/HistoryProvider';
import { Button } from 'react-desktop/windows';
import { ipcRenderer } from 'electron';
import { setOsuSongsPath } from './actions';

const History = ({ theme }) => {
  const { history, clear, set } = useContext(HistoryContext)
  const osuPathSetup = () => {
    const path = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    setOsuSongsPath(path[0])
    console.log(path)
  }

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
        onClick={osuPathSetup}
      >
        Select your Osu! Songs folder
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