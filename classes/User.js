const UserYmService = require('./UserYmService.js');
const CacheManager = require('./CacheManager.js');


class User {
    constructor(userDirectory) {
        this.userDirectory = userDirectory;
        this.configUser = require(userDirectory + "\\Settings\\config.json");
        this._initUserYmService(this.configUser);
        this.cacheManager = new CacheManager(this.configUser.userName)
    }

    _initUserYmService(configUser){
        this.userYmService = new UserYmService(configUser)
    }

    async getPlaylistsForDownload(options = {}){
        const {isDownloadDownloadedPlaylists} = options;
        const mark = this.configUser.playlistsForDownloadMark;
        let playlistsForDownload = await this.userYmService.getPlaylistsHasMark(mark)
        
        if(isDownloadDownloadedPlaylists) {
            return playlistsForDownload;
        } else {
            const downloadedIds = this.getDownloadedPlaylistsIds();
            return _getOnlyNotDownloadedPlaylists(playlistsForDownload, downloadedIds)
        }

        function _getOnlyNotDownloadedPlaylists(allPlaylists, downloadedIds) {

            const allPlaylistsIds = allPlaylists.map(playlist => playlist.kind);
            const result = [];
            for (let i = 0; i < allPlaylistsIds.length; i++) {
                if(!downloadedIds.includes(allPlaylistsIds[i])) {
                    result.push(allPlaylists[i])
                }
            }
            
            return result;
        }
    }

    getDownloadedPlaylistsIds() {
        return require(this.userDirectory + "\\cache\\cache.json").downloadedPlaylistsIds
    }

    async getOnlyNewTracksFromPlaylistFavorite() {
        const allTracksPlaylistFavorite = await this.userYmService.getAllTracksFromPlaylistFavorite();
        ///const allTracks =
        ///const playlistFavoriteTracksDownloaded = this.cacheManager.getCacheField("playlistFavoriteTracksDownloaded")

        //const notDownloadedTracks = [...new Set([...playlistFavoriteTracksDownloaded, ...allTracksPlaylistFavoriteTracks])];
        return allTracksPlaylistFavorite; //fixme: Playlist favorites not possible to access
    }
}

module.exports = User;
