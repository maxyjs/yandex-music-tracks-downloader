const downloadAllTracksFromPlaylist = require('./downloadAllTracksFromPlaylist');

const userName = "testymtest"; // UserName Yandex Music User
const playlistId = "1001"; // https://music.yandex.ru/users/[UserName]/playlists/[playlistId here]

downloadAllTracksFromPlaylist(userName, playlistId);