const getTrackAsBinaryData = require('./getTrackAsBinaryData');
const getDataForID3Tags = require('./getDataForID3Tags.js');
const writeID3Tags = require('./writeID3Tags');
const saveTrack = require('./saveTrack');
const options = require('./Users/UserTest/Settings/config.json');

async function downloadTrack(trackId) {

    const {downloadsPath} = options;
    const promises = [
        getTrackAsBinaryData(trackId),
        getDataForID3Tags(trackId, options)
    ];

    const [trackAsBinaryDataObj, dataForID3Tags] = await Promise.all(promises);

    const {codec, trackASBinaryData: binaryData} = trackAsBinaryDataObj;

    const {artists, title} = dataForID3Tags;

    const binaryTrack = writeID3Tags(binaryData, dataForID3Tags);

    saveTrack(binaryTrack, artists, title, codec, downloadsPath);

    return true;
}

module.exports = downloadTrack;
