import { useDownloadQueue } from '.';

// return download progress of item or -2
export const useCurrentDownloadItem = itemId => {
  const { currentDownload, queue } = useDownloadQueue();

  if (currentDownload && currentDownload.beatmapSetId === itemId) return currentDownload.progressPercent;
  if (currentDownload && queue.some(item => item.beatmapSetId === itemId)) return -1;
  return -2;
};
