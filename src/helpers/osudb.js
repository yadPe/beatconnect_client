var fs = require("fs");
var uleb128 = require("uleb128");
var Long = require("long");

// ---- //

exports.readOsuDB = readOsuDB;
exports.readCollectionDB = readCollectionDB;
exports.writeCollectionDB = writeCollectionDB;
exports.readScoresDB = readScoresDB;
exports.writeScoresDB = writeScoresDB;

// ---- //

var windowsTickEpoch = Long.fromInt(621355968).multiply(100000);

// ---- //

function readString(buf, offset) {
    if (buf[offset++] != 11) {
        return {
            str: "",
            length: 1
        };
    }

    var strlen = uleb128.decode(buf.slice(offset));
    var bytesLen = strlen.length + strlen.value;
    var str = buf.toString("utf-8", offset + strlen.length, offset + bytesLen);

    return {
        str: str,
        length: bytesLen + 1
    };
}

function createString(str) {
    var strlen128 = uleb128.encode(str.length);
    var strBuf = new Buffer(1 + strlen128.length + str.length);
    strBuf[0] = 0x0b;
    for (var i = 0; i < strlen128.length; i++) strBuf[i + 1] = strlen128[i];
    strBuf.write(str, 1 + strlen128.length);
    return strBuf;
}

function readLongStr(buf, offset) {
    var l1 = buf.readInt32LE(offset);
    var l2 = buf.readInt32LE(offset + 4);
    return new Long(l1, l2).toString();
}

function createLongStr(str) {
    var buf = new Buffer(8);
    var l = Long.fromString(str + "");
    buf.writeInt32LE(l.getLowBits(), 0);
    buf.writeInt32LE(l.getHighBits(), 4);
    return buf;
}

function winTickToMs(num) {
    var l = Long.fromString(num + "");
    if (l.compare(0) === 0) return 0;
    return l.divide(10000).subtract(windowsTickEpoch).toString() * 1;
}

// ---- //

function readOsuDB(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, function (err, buf) {
            if (err || !buf) return reject(err);

            var collections = {};

            var version = buf.readInt32LE(0);
            var folderCount = buf.readInt32LE(4);

            // todo: account unlock time

            var player = readString(buf, 17);
            var beatmapCount = buf.readInt32LE(17 + player.length);
            var offset = 21 + player.length;

            var beatmaps = [];

            for (var i = 0; i < beatmapCount; i++) {
                var beatmap = {};

                var gets1 = ["artist", "artistUnicode", "title", "titleUnicode",
                    "creator", "difficulty", "audioFilename", "md5", "osuPath"];
                beatmap.size = buf.readInt32LE((offset += 4) - 4)

                for (var get in gets1) {
                    var strobj = readString(buf, offset);
                    beatmap[gets1[get]] = strobj.str;
                    offset += strobj.length;
                }

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
                    for (j = 0; j < 4; j++) {
                        var unknownNumCount = buf.readInt32LE((offset += 4) - 4);
                        for (var k = 0; k < unknownNumCount; k++) {
                            if (buf[offset++] != 0x08) reject("Invalid beatmap!");
                            var unknownNum = buf.readInt32LE((offset += 4) - 4);
                            if (buf[offset++] != 0x0D) reject("Invalid beatmap!");
                            var unknownDub = buf.readDoubleLE((offset += 8) - 8);
                        }
                    }
                }

                beatmap.drainTime = buf.readInt32LE((offset += 4) - 4);
                beatmap.totalTime = buf.readInt32LE((offset += 4) - 4);
                beatmap.audioPreviewTime = buf.readInt32LE((offset += 4) - 4);

                // Timing points
                beatmap.timingPoints = [];
                var timingPointCount = buf.readInt32LE((offset += 4) - 4);
                for (j = 0; j < timingPointCount; j++) {
                    beatmap.timingPoints[j] = {
                        msPerBeat: buf.readDoubleLE((offset += 8) - 8),
                        offset: buf.readDoubleLE((offset += 8) - 8),
                        inherited: buf[offset++]
                    };
                }

                beatmap.beatmapId = buf.readInt32LE((offset += 4) - 4);
                beatmap.beatmapSetId = buf.readInt32LE((offset += 4) - 4);
                beatmap.threadId = buf.readInt32LE((offset += 4) - 4);

                offset += 4; // Unknown bytes

                beatmap.localBeatmapOffset = buf.readUInt16LE((offset += 2) - 2);
                beatmap.stackLeniency = buf.readFloatLE((offset += 4) - 4);
                beatmap.mode = buf[offset++];

                var source = readString(buf, offset);
                offset += source.length;
                beatmap.source = source.str;
                var tags = readString(buf, offset);
                offset += tags.length;
                beatmap.tags = tags.str;

                beatmap.onlineTags = buf.readUInt16LE((offset += 2) - 2);

                var font = readString(buf, offset);
                offset += font.length;
                beatmap.font = font.str;

                beatmap.isUnplayed = buf[offset++];

                beatmap.lastPlayedWindows = readLongStr(buf, (offset += 8) - 8);
                beatmap.lastPlayedMs = winTickToMs(beatmap.lastPlayedWindows);

                beatmap.isOsz2 = buf[offset++];

                var beatmapFolder = readString(buf, offset);
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
                beatmaps: beatmaps
            });
        });
    })
}


function readCollectionDB(path, callback) {
    fs.readFile(path, function(err, buf) {
        if (err || !buf) throw "Failed to open collection.db";

        var collections = {};

        var version = buf.readInt32LE(0);
        var collectionCount = buf.readInt32LE(4);
        var offset = 8;
        for (var i = 0; i < collectionCount; i++) {
            var name = readString(buf, offset);
            offset += name.length;
            collections[name.str] = [];

            var beatmapCount = buf.readInt32LE(offset);
            offset += 4;

            for (var j = 0; j < beatmapCount; j++) {
                var md5 = readString(buf, offset);
                offset += md5.length;
                collections[name.str].push(md5.str);
            }
        }

        callback(collections);
    });
}

function writeCollectionDB(path, collections, callback) {
    var buf = new Buffer(8);

    buf.writeInt32LE(20160212);
    buf.writeInt32LE(Object.keys(collections).length, 4);

    for (var name in collections) {
        buf = Buffer.concat([buf, createString(name)]);

        var beatmapCountBuf = new Buffer(4);
        beatmapCountBuf.writeInt32LE(collections[name].length);
        buf = Buffer.concat([buf, beatmapCountBuf]);

        for (var j = 0; j < collections[name].length; j++) {
            buf = Buffer.concat([buf, createString(collections[name][j])]);
        }
    }

    fs.writeFile(path, buf, callback);
}

function readScoresDB(path, callback) {
    fs.readFile(path, function(err, buf) {
        if (err || !buf) throw "Failed to open scores.db";

        var beatmaps = {};

        var version = buf.readInt32LE(0);
        var beatmapCount = buf.readInt32LE(4);
        var offset = 8;
        for (var i = 0; i < beatmapCount; i++) {
            var md5 = readString(buf, offset);
            if (!beatmaps[md5.str]) beatmaps[md5.str] = [];
            offset += md5.length;

            var scoreCount = buf.readInt32LE((offset += 4) - 4);

            for (var j = 0; j < scoreCount; j++) {
                var score = {};

                score.mode = buf[offset++];
                score.version = buf.readInt32LE((offset += 4) - 4);

                var gets = ["beatmapMd5", "player", "replayMd5"];
                for (var get in gets) {
                    var strobj = readString(buf, offset);
                    score[gets[get]] = strobj.str;
                    offset += strobj.length;
                }

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
    var buf = new Buffer(8);

    buf.writeInt32LE(20160215);
    buf.writeInt32LE(Object.keys(beatmaps).length, 4);

    for (var md5 in beatmaps) {
        buf = Buffer.concat([buf, createString(md5)]);

        var scoreCountBuf = new Buffer(4);
        scoreCountBuf.writeInt32LE(beatmaps[md5].length);
        buf = Buffer.concat([buf, scoreCountBuf]);

        for (var i = 0; i < beatmaps[md5].length; i++) {
            var score = beatmaps[md5][i];

            var modeVersionBuf = new Buffer(5);
            modeVersionBuf[0] = score.mode;
            modeVersionBuf.writeInt32LE(score.version, 1);
            buf = Buffer.concat([buf, modeVersionBuf]);

            buf = Buffer.concat([buf, createString(score.beatmapMd5)]);
            buf = Buffer.concat([buf, createString(score.player)]);
            buf = Buffer.concat([buf, createString(score.replayMd5)]);

            var scoreDeBuf = new Buffer(23);
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
            buf = Buffer.concat([buf, createString("")]);

            buf = Buffer.concat([buf, createLongStr(score.timestampWindows)]);

            var unknownBuf = new Buffer(4);
            unknownBuf.writeInt32LE(-1, 0);
            buf = Buffer.concat([buf, unknownBuf]);

            buf = Buffer.concat([buf, createLongStr(score.onlineScoreId)]);
        }
    }

    fs.writeFile(path, buf, callback);
}
