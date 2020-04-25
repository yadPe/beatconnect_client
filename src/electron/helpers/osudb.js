/* eslint-disable no-loop-func */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

const fs = require('fs');
const uleb128 = require('uleb128');
const Long = require('long');
const { read } = require('./OsuDbParser.bs');

const windowsTickEpoch = Long.fromInt(621355968).multiply(100000);

function readString(buf, offset) {
  // eslint-disable-next-line no-param-reassign
  if (buf[offset++] !== 11) {
    return {
      str: '',
      length: 1,
    };
  }

  const strlen = uleb128.decode(buf.slice(offset));
  const bytesLen = strlen.length + strlen.value;
  const str = buf.toString('utf-8', offset + strlen.length, offset + bytesLen);

  return {
    str,
    length: bytesLen + 1,
  };
}

function createString(str) {
  const strlen128 = uleb128.encode(str.length);
  const strBuf = Buffer.alloc(1 + strlen128.length + str.length);
  strBuf[0] = 0x0b;
  for (let i = 0; i < strlen128.length; i++) strBuf[i + 1] = strlen128[i];
  strBuf.write(str, 1 + strlen128.length);
  return strBuf;
}

function readLongStr(buf, offset) {
  const l1 = buf.readInt32LE(offset);
  const l2 = buf.readInt32LE(offset + 4);
  return new Long(l1, l2).toString();
}

function createLongStr(str) {
  const buf = Buffer.alloc(8);
  const l = Long.fromString(`${str}`);
  buf.writeInt32LE(l.getLowBits(), 0);
  buf.writeInt32LE(l.getHighBits(), 4);
  return buf;
}

function winTickToMs(num) {
  const l = Long.fromString(`${num}`);
  if (l.compare(0) === 0) return 0;
  return (
    l
      .divide(10000)
      .subtract(windowsTickEpoch)
      .toString() * 1
  );
}

// ---- //

const readCollectionDB = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, buf) => {
      if (err || !buf) reject(new Error('Failed to open collection.db'));

      const collections = {};

      const _version = buf.readInt32LE(0);
      const collectionCount = buf.readInt32LE(4);
      let offset = 8;
      for (let i = 0; i < collectionCount; i++) {
        const name = readString(buf, offset);
        offset += name.length;
        collections[name.str] = [];

        const beatmapCount = buf.readInt32LE(offset);
        offset += 4;

        for (let j = 0; j < beatmapCount; j++) {
          const md5 = readString(buf, offset);
          offset += md5.length;
          collections[name.str].push(md5.str);
        }
      }

      resolve(collections);
    });
  });

const writeCollectionDB = (path, collections) =>
  new Promise((resolve, reject) => {
    let buf = Buffer.alloc(8);

    buf.writeInt32LE(20160212);
    buf.writeInt32LE(Object.keys(collections).length, 4);

    const collectionNames = Object.keys(collections);

    collectionNames.forEach(name => {
      buf = Buffer.concat([buf, createString(name)]);

      const beatmapCountBuf = Buffer.alloc(4);
      beatmapCountBuf.writeInt32LE(collections[name].length);
      buf = Buffer.concat([buf, beatmapCountBuf]);

      for (let j = 0; j < collections[name].length; j++) {
        buf = Buffer.concat([buf, createString(collections[name][j])]);
      }
    });

    fs.writeFile(path, buf, err => {
      if (err) reject(err);
      else resolve();
    });
  });

function readScoresDB(path, callback) {
  fs.readFile(path, (err, buf) => {
    if (err || !buf) throw new Error('Failed to open scores.db');

    const beatmaps = {};

    const _version = buf.readInt32LE(0);
    const beatmapCount = buf.readInt32LE(4);
    let offset = 8;
    for (let i = 0; i < beatmapCount; i++) {
      const md5 = readString(buf, offset);
      if (!beatmaps[md5.str]) beatmaps[md5.str] = [];
      offset += md5.length;

      const scoreCount = buf.readInt32LE((offset += 4) - 4);

      for (let j = 0; j < scoreCount; j++) {
        const score = {};

        score.mode = buf[offset++];
        score.version = buf.readInt32LE((offset += 4) - 4);

        const gets = ['beatmapMd5', 'player', 'replayMd5'];
        gets.forEach(get => {
          const strobj = readString(buf, offset);
          score[get] = strobj.str;
          offset += strobj.length;
        });

        score.c300 = buf.readUInt16LE((offset += 2) - 2);
        score.c100 = buf.readUInt16LE((offset += 2) - 2);
        score.c50 = buf.readUInt16LE((offset += 2) - 2);
        score.cGeki = buf.readUInt16LE((offset += 2) - 2);
        score.cKatu = buf.readUInt16LE((offset += 2) - 2);
        score.cMiss = buf.readUInt16LE((offset += 2) - 2);
        score.replayScore = buf.readInt32LE((offset += 4) - 4);
        score.maxCombo = buf.readUInt16LE((offset += 2) - 2);
        score.perfectCombo = buf[offset++];
        score.mods = buf.readInt32LE((offset += 4) - 4);

        // Unknown
        offset += readString(buf, offset).length;

        // Timestamp
        score.timestampWindows = readLongStr(buf, (offset += 8) - 8);
        score.timestampMs = winTickToMs(score.timestampWindows);

        // Unknown
        offset += 4;

        // Online score id
        score.onlineScoreId = readLongStr(buf, (offset += 8) - 8);

        // Add
        beatmaps[md5.str].push(score);
      }
    }

    callback(beatmaps);
  });
}

function writeScoresDB(path, beatmaps, callback) {
  let buf = Buffer.alloc(8);

  buf.writeInt32LE(20160215);
  buf.writeInt32LE(Object.keys(beatmaps).length, 4);

  beatmaps.forEach(md5 => {
    buf = Buffer.concat([buf, createString(md5)]);

    const scoreCountBuf = Buffer.alloc(4);
    scoreCountBuf.writeInt32LE(md5.length);
    buf = Buffer.concat([buf, scoreCountBuf]);

    for (let i = 0; i < md5.length; i++) {
      const score = md5[i];

      const modeVersionBuf = Buffer.alloc(5);
      modeVersionBuf[0] = score.mode;
      modeVersionBuf.writeInt32LE(score.version, 1);
      buf = Buffer.concat([buf, modeVersionBuf]);

      buf = Buffer.concat([buf, createString(score.beatmapMd5)]);
      buf = Buffer.concat([buf, createString(score.player)]);
      buf = Buffer.concat([buf, createString(score.replayMd5)]);

      const scoreDeBuf = Buffer.alloc(23);
      scoreDeBuf.writeInt16LE(score.c300, 0);
      scoreDeBuf.writeInt16LE(score.c100, 2);
      scoreDeBuf.writeInt16LE(score.c50, 4);
      scoreDeBuf.writeInt16LE(score.cGeki, 6);
      scoreDeBuf.writeInt16LE(score.cKatu, 8);
      scoreDeBuf.writeInt16LE(score.cMiss, 10);
      scoreDeBuf.writeInt32LE(score.replayScore, 12);
      scoreDeBuf.writeInt16LE(score.maxCombo, 16);
      scoreDeBuf[18] = score.perfectCombo;
      scoreDeBuf.writeInt32LE(score.mods, 19);
      buf = Buffer.concat([buf, scoreDeBuf]);

      // Unknown
      buf = Buffer.concat([buf, createString('')]);

      buf = Buffer.concat([buf, createLongStr(score.timestampWindows)]);

      const unknownBuf = Buffer.alloc(4);
      unknownBuf.writeInt32LE(-1, 0);
      buf = Buffer.concat([buf, unknownBuf]);

      buf = Buffer.concat([buf, createLongStr(score.onlineScoreId)]);
    }
  });

  fs.writeFile(path, buf, callback);
}

const readOsuDB = path => read(fs.readFileSync(path));

module.exports = {
  readOsuDB,
  readCollectionDB,
  writeCollectionDB,
  readScoresDB,
  writeScoresDB,
};

// readCollectionDB('/Users/yannis/Downloads/collecDab.db', collections => {
//   console.log('READ : ', collections);
//   collections['Top KEK'] = [
//     'DABBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
//     'OMEGAROBDAB',
//     'SAMARCH',
//     '44444444444444444444444444444449',
//   ];
//   writeCollectionDB('/Users/yannis/Downloads/collection.db', collections, () => {
//     readCollectionDB('/Users/yannis/Downloads/collection.db', console.log);
//   });
// });
