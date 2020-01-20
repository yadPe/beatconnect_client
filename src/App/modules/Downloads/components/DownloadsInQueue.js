import React from 'react';
import DownloadsItem from './Item';
import config from '../../../../shared/config';

const DownloadsInQueue = ({ queue, removeItemfromQueue }) => {
  const renderDownloads = () => {
    if (!queue.length) return null;
    return (
      <div className="downloadMenu DownloadsInQueue" style={{ marginBottom: '5vh' }}>
        {queue.slice(1).map(item => {
          const {
            beatmapSetId,
            beatmapSetInfos: { fullTitle },
          } = item;
          const unQueue = () => removeItemfromQueue(beatmapSetId);
          return (
            <DownloadsItem
              id={beatmapSetId}
              name={fullTitle}
              cancel={unQueue}
              status={config.download.status.queued}
              key={beatmapSetId}
            />
          );
        })}
      </div>
    );
  };
  return <>{renderDownloads()}</>;
};

export default DownloadsInQueue;
