const fs = require('fs');
const { createString, readString } = require('../osudb');

const readCollectionDB = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, buf) => {
      if (err || !buf) return reject(new Error('Failed to open collection.db'));

      const collections = [];

      // eslint-disable-next-line no-underscore-dangle, no-unused-vars
      const _version = buf.readInt32LE(0);
      const collectionCount = buf.readInt32LE(4);
      let offset = 8;
      for (let i = 0; i < collectionCount; i++) {
        const name = readString(buf, offset);
        offset += name.length;

        collections[i] = [name.str, []];

        const beatmapCount = buf.readInt32LE(offset);
        offset += 4;

        for (let j = 0; j < beatmapCount; j++) {
          const md5 = readString(buf, offset);
          offset += md5.length;
          collections[i][1].push(md5.str);
        }
      }

      return resolve(collections);
    });
  });

const writeCollectionDB = (path, collections) =>
  new Promise((resolve, reject) => {
    let buf = Buffer.alloc(8);

    buf.writeInt32LE(20160212);
    buf.writeInt32LE(collections.length, 4);

    collections.forEach(([name, beatmapsMd5]) => {
      buf = Buffer.concat([buf, createString(name)]);

      const beatmapCountBuf = Buffer.alloc(4);
      beatmapCountBuf.writeInt32LE(beatmapsMd5.length);
      buf = Buffer.concat([buf, beatmapCountBuf]);

      for (let j = 0; j < beatmapsMd5.length; j++) {
        buf = Buffer.concat([buf, createString(beatmapsMd5[j])]);
      }
    });

    fs.writeFile(path, buf, err => {
      if (err) reject(err);
      else resolve();
    });
  });

module.exports = {
  readCollectionDB,
  writeCollectionDB,
};
