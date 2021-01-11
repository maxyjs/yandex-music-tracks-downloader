const axios = require('axios');
const md5 = require('blueimp-md5');
const BASE_URL = "https://music.yandex.ru";
const cookie = require('./data/cookie');

const options = {
    headers: {
        'X-Retpath-Y': encodeURIComponent('https://music.yandex.ru/'),
        Cookie: cookie
    },
    redirect: 'error',
    withCredentials: true
};

function parseJsonResponse(response) {
    if (response.status !== 200) {
        throw new Error(`${response.status} (${response.statusText})`);
    }
    
    return response.data;
}

async function getTrackDownloadInfo(trackId) {

    const trackInfoUrl = `${BASE_URL}/api/v2.1/handlers/track/${trackId}/track/download/m?hq=1`;
    const trackInfo = await parseJsonResponse(await axios.get(trackInfoUrl, options));
    const downloadInfo = await parseJsonResponse(await axios.get(`${trackInfo.src}&format=json`));
    
    const salt = 'XGRlBW9FXlekgbPrRHuSiA';
    const hash = md5(salt + downloadInfo.path.substr(1) + downloadInfo.s);

    return {
        url: `https://${downloadInfo.host}/get-mp3/${hash}/${downloadInfo.ts + downloadInfo.path}`,
        codec: trackInfo.codec // mp3, aac
    };
}

module.exports = getTrackDownloadInfo;

