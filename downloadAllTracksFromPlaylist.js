const axios = require('axios');
const downloadTrack = require('./downloadTrack');


async function downloadAllTracksFromPlaylist(userName, playlistId) {
    const allTracksForDownload = await getPlaylistTracksIds(userName, playlistId);
    for(const trackId of allTracksForDownload) {
        await downloadTrack(trackId)
    }
}

async function getPlaylistTracksIds(userName, playlistId) {
    try {
        const url = `https://music.yandex.ru/handlers/playlist.jsx?owner=${userName}&kinds=${playlistId}`;
        const {data} = await axios.get(url);
        return data.playlist.trackIds;
    } catch (err) {
        throw new Error(err);
    }

}

async function getAllUserOpenedPlaylists(userName) {
    try {
        const url = `https://music.yandex.ru/handlers/library.jsx?owner=${userName}&filter=playlists`
        const {data} = await axios.get(url);
        return data
    }
    catch (err) {
        throw new Error(err);
    }
}

module.exports = downloadAllTracksFromPlaylist;


