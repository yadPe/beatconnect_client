import React, { useState } from 'react';
import renderIcons from '../../../utils/renderIcons'
import { ProgressCircle, Button, Text } from 'react-desktop/windows';
import { remote, shell } from 'electron';
import DownloadManager from '../../../utils/DownloadManager'
const downloadManager = remote.require("electron-download-manager");

const DownloadBeatmapBtn = ({ theme, url }) => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadBeatmap = () => {
    setIsDownloading(true)
    downloadManager.download({
      url,
      onProgress: ({ progress }) => {
        //setIsDownloading(progress)
      }
    },
      (err, infos) => {
        if (err) console.error(err)
        shell.openItem(infos.filePath)
        setIsDownloading(false)

        console.log('Finished dl', infos)
      })
  }
  return (
    <Button
      push
      color={theme.color}
      onClick={downloadBeatmap}>
      {
        isDownloading ?
          <ProgressCircle
            className='ProgressCircle'
            color='#fff'
            size={25}
          /> :
          renderIcons('Download', theme.style)
      }
    </Button>
  );
}

export default DownloadBeatmapBtn;