const getTrackDownloadInfo = require('./getTrackDownloadInfo');
const https = require('https');



async function getTrackAsBinaryData(trackId) {

    const trackInfo = await getTrackDownloadInfo(trackId);

    const {codec, url} = trackInfo;

    const trackASBinaryData = await getBinaryData(url);

    return {trackASBinaryData, codec};

    function getBinaryData(url) {
        return new Promise((response) => {
            https.get(url, (res) => {
                const data = [];
                res.on('data', (chunk) => {
                    data.push(...chunk);
                });
                res.on('end', () => {
                    const trackASBinaryData = Buffer.from(data);
                    response(trackASBinaryData);
                });
            });
        });
    }
}



module.exports = getTrackAsBinaryData;
