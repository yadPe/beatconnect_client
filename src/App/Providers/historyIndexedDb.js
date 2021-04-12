import Dexie from 'dexie';

class HistoryDb extends Dexie {
  constructor() {
    super("HistoryDb");
    this.version(1).stores({
      beatmapSets: '&id,md5', // additional fields : date,title,artist,creator,isUnplayed,audioPath,previewOffset
    });
  }
};

export const db = new HistoryDb;

export const populateWithExistingHistory = async history => {
  return db.beatmapSets.bulkAdd(Object.values(history));
};

