const axios = require('axios');
const https = require('https');
const translateLyrics = require('./translateLyrics.js');
const mixOriginAndTranslatedLyrics = require('./mixOriginAndTranslatedLyrics.js');

async function getDataForID3Tags(trackId, options) {

    const trackInfoRawData = await getTrackInfoRawData(trackId);
    const lyrics = await getLyrics(trackInfoRawData, options);
    const albumId = trackInfoRawData.track.albums[0].id;
    const albumInfoRawData = await getAlbumInfoRawData(albumId);
    const { title: albumTitle, coverUri: coverUriRaw } = albumInfoRawData;
    const coverArrayBuffer = await getCoverBuffer(coverUriRaw);
    const genres = [albumInfoRawData.genre];
    const title = getTrackTitle(trackInfoRawData);
    const artists = getArtists(trackInfoRawData);
    
    return {
        genres,
        albumTitle,
        artists,
        title,
        coverArrayBuffer,
        lyrics
    }

    function getTrackTitle(trackInfoRawData) {
        let title = trackInfoRawData.track.title;

        if(trackInfoRawData.track.version) {
            title += ` ${trackInfoRawData.track.version}`
        }

        return title
    }
}

async function getTrackInfoRawData(trackId) {
    const trackInfoUrl = `https://music.yandex.ru/handlers/track.jsx?track=${trackId}`;
    return await _getRawData(trackInfoUrl)
}

async function getAlbumInfoRawData(albumId) {
    const albumInfoUrl = `https://music.yandex.ru/handlers/album.jsx?album=${albumId}&hq=1`;
    return await _getRawData(albumInfoUrl)
}

async function getArtistInfoRawData(artistId) {
    const artistInfoUrl = `https://music.yandex.ru/handlers/artist.jsx?artist=${artistId}&what=artist&hq=1`;
    return await _getRawData(artistInfoUrl)
}

async function getCoverBuffer(coverUriRaw) {
    // There are albums without cover art
    if (!coverUriRaw) return undefined;
    const coverUri = 'https://' + coverUriRaw.replace('%%', 'm1000x1000')
    try {
        return await getBuffer(coverUri)
    }
    catch (err) {
        return undefined;
    }
}

function getBuffer(coverUri) {
    return new Promise((response, reject) => {
        var buffer;
        try {
            https.get(coverUri, (res) => {
                const data = [];
                res.on('data', (chunk) => {
                    data.push(...chunk);
                });
                res.on('end', () => {

                    buffer = Buffer.from(data);

                    response(
                        {
                            type: 3,
                            description: '',
                            data: buffer
                        }
                    );
                });
            });
        }
        catch (err) {
            reject(err)
        }

    })

}

async function _getRawData(url) {
    try {
        const {data} = await axios.get(url);
        return data
    }
    catch (error) {
        console.warn ( error );
        throw new Error;
    }
}

function getArtists(trackInfoRawData){
    let artists = [];
    artists = trackInfoRawData.artists.map(({ name }) =>{
        return name
    });
    return artists
}

async function getLyrics(trackInfoRawData, options){

    var lyricText = "";

    if(!options.shouldAddLyrics) return lyricText;

    let lyricsFromRawData = getLyricsFromRawData(trackInfoRawData);

    if (lyricsFromRawData && detectNeedTranslate(lyricsFromRawData) ) {
        let translatedAndOrigin = await translateLyrics(lyricsFromRawData.textLanguage, lyricsFromRawData.fullLyrics, trackInfoRawData.track.title)
        lyricText = mixOriginAndTranslatedLyrics(translatedAndOrigin);
        return {
            description: '',
            lyrics: lyricText,
            language: lyricsFromRawData.textLanguage
        }
    }

    return lyricText;

    function getLyricsFromRawData(trackInfoRawData){
        return trackInfoRawData.lyric && Array.isArray(trackInfoRawData.lyric) && trackInfoRawData.lyric[0] && trackInfoRawData.lyric[0]
    }

    function detectNeedTranslate(lyricsFromRawData){
        return lyricsFromRawData.textLanguage !== "ru"
    }
}




module.exports = getDataForID3Tags;
