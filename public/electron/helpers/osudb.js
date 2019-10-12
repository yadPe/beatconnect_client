/* eslint-disable no-loop-func */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */

const fs = require('fs');
const uleb128 = require('uleb128');
const Long = require('long');

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

function readOsuDB(path) {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line consistent-return
    fs.readFile(path, (err, buf) => {
      if (err || !buf) return reject(err);

      const version = buf.readInt32LE(0);
      const _folderCount = buf.readInt32LE(4);

      const player = readString(buf, 17);
      const beatmapCount = buf.readInt32LE(17 + player.length);
      let offset = 21 + player.length;

      const beatmaps = [];

      for (let i = 0; i < beatmapCount; i++) {
        const beatmap = {};

        const gets1 = [
          'artist',
          'artistUnicode',
          'title',
          'titleUnicode',
          'creator',
          'difficulty',
          'audioFilename',
          'md5',
          'osuPath',
        ];
        beatmap.size = buf.readInt32LE((offset += 4) - 4);

        gets1.forEach(get => {
          const strobj = readString(buf, offset);
          beatmap[get] = strobj.str;
          offset += strobj.length;
        });

        beatmap.rankedStatus = buf[offset++];
        beatmap.hitcircleCount = buf.readUInt16LE((offset += 2) - 2);
        beatmap.sliderCount = buf.readUInt16LE((offset += 2) - 2);
        beatmap.spinnerCount = buf.readUInt16LE((offset += 2) - 2);

        // Timestamp
        beatmap.lastModificationWindows = readLongStr(buf, (offset += 8) - 8);
        beatmap.lastModificationMs = winTickToMs(beatmap.lastModificationWindows);

        if (version < 20140609) {
          beatmap.AR = buf[offset++];
          beatmap.CS = buf[offset++];
          beatmap.HP = buf[offset++];
          beatmap.OD = buf[offset++];
        } else {
          beatmap.AR = buf.readFloatLE((offset += 4) - 4);
          beatmap.CS = buf.readFloatLE((offset += 4) - 4);
          beatmap.HP = buf.readFloatLE((offset += 4) - 4);
          beatmap.OD = buf.readFloatLE((offset += 4) - 4);
        }

        beatmap.sliderVelocity = buf.readDoubleLE((offset += 8) - 8);

        // Purpose for this is unknown so it will be ignored
        if (version >= 20140609) {
          for (let j = 0; j < 4; j++) {
            const unknownNumCount = buf.readInt32LE((offset += 4) - 4);
            for (let k = 0; k < unknownNumCount; k++) {
              if (buf[offset++] != 0x08) return reject(new Error('Invalid beatmap!'));
              buf.readInt32LE((offset += 4) - 4);
              if (buf[offset++] != 0x0d) return reject(new Error('Invalid beatmap!'));
              buf.readDoubleLE((offset += 8) - 8);
            }
          }
        }

        beatmap.drainTime = buf.readInt32LE((offset += 4) - 4);
        beatmap.totalTime = buf.readInt32LE((offset += 4) - 4);
        beatmap.audioPreviewTime = buf.readInt32LE((offset += 4) - 4);

        // Timing points
        beatmap.timingPoints = [];
        const timingPointCount = buf.readInt32LE((offset += 4) - 4);
        for (let j = 0; j < timingPointCount; j++) {
          beatmap.timingPoints[j] = {
            msPerBeat: buf.readDoubleLE((offset += 8) - 8),
            offset: buf.readDoubleLE((offset += 8) - 8),
            inherited: buf[offset++],
          };
        }

        beatmap.beatmapId = buf.readInt32LE((offset += 4) - 4);
        beatmap.beatmapSetId = buf.readInt32LE((offset += 4) - 4);
        beatmap.threadId = buf.readInt32LE((offset += 4) - 4);

        offset += 4; // Unknown bytes

        beatmap.localBeatmapOffset = buf.readUInt16LE((offset += 2) - 2);
        beatmap.stackLeniency = buf.readFloatLE((offset += 4) - 4);
        beatmap.mode = buf[offset++];

        const source = readString(buf, offset);
        offset += source.length;
        beatmap.source = source.str;
        const tags = readString(buf, offset);
        offset += tags.length;
        beatmap.tags = tags.str;

        beatmap.onlineTags = buf.readUInt16LE((offset += 2) - 2);

        const font = readString(buf, offset);
        offset += font.length;
        beatmap.font = font.str;

        beatmap.isUnplayed = buf[offset++];

        beatmap.lastPlayedWindows = readLongStr(buf, (offset += 8) - 8);
        beatmap.lastPlayedMs = winTickToMs(beatmap.lastPlayedWindows);

        beatmap.isOsz2 = buf[offset++];

        const beatmapFolder = readString(buf, offset);
        offset += beatmapFolder.length;
        beatmap.beatmapFolder = beatmapFolder.str;

        beatmap.lastCheckWindows = readLongStr(buf, (offset += 8) - 8);
        beatmap.lastCheckMs = winTickToMs(beatmap.lastCheckWindows);

        beatmap.ignoreHitsounds = buf[offset++];
        beatmap.ignoreSkin = buf[offset++];
        beatmap.disableStoryboard = buf[offset++];
        beatmap.disableVideo = buf[offset++];
        beatmap.visualOverride = buf[offset++];

        if (version < 20140609) offset++; // Unknown
        offset += 4; // Unknown

        beatmap.maniaScrollSpeed = buf[offset++];

        beatmaps.push(beatmap);
      }
      resolve({
        player: player.str,
        beatmaps,
      });
    });
  });
}

function readCollectionDB(path, callback) {
  fs.readFile(path, (err, buf) => {
    if (err || !buf) throw new Error('Failed to open collection.db');

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

    callback(collections);
  });
}

function writeCollectionDB(path, collections, callback) {
  let buf = Buffer.alloc(8);

  buf.writeInt32LE(20160212);
  buf.writeInt32LE(Object.keys(collections).length, 4);

  collections.forEach(name => {
    buf = Buffer.concat([buf, createString(name)]);

    const beatmapCountBuf = Buffer.alloc(4);
    beatmapCountBuf.writeInt32LE(name.length);
    buf = Buffer.concat([buf, beatmapCountBuf]);

    for (let j = 0; j < name.length; j++) {
      buf = Buffer.concat([buf, createString(name[j])]);
    }
  });

  fs.writeFile(path, buf, callback);
}

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

module.exports = {
  readOsuDB,
  readCollectionDB,
  writeCollectionDB,
  readScoresDB,
  writeScoresDB,
};
