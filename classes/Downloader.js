const User = require('./User.js');
const downloadTrack = require('./../downloadTrack.js');
const fs = require('fs');


class Downloader {
    constructor(userName, options) {
        this._init(userName);
        this.userName = userName;
        this.options = options;
    }

    _init(userName) {
        const userDirectory = `./Users/${userName}`

        try {
            const stats = fs.lstatSync(userDirectory);

            if (stats.isDirectory()) {
                this.userDirectory = userDirectory;
            }
        }
        catch (err) {
            throw err;
        }
    }
    
    async downloadAllPlaylistsHasMarkForUser() {

        const user = new User(this.userDirectory)
        const playlistsForDownload = await user.getPlaylistsForDownload(this.options)
        for(const playlist of playlistsForDownload) {
            const result = await this.downloadTracksFromPlaylist(playlist)
        }
    }

    async downloadTracksFromPlaylist(playlist) {
        const allTracksForDownload = playlist.tracks
        for(const track of allTracksForDownload) {
            const result = await downloadTrack(track, this.options)
            if(result instanceof Error ) console.warn ( result );
        }
    }

    async start (options) {
        const {downloadMode} = options
        if(!downloadMode) throw new Error(`Download mode has not been set!`)

        const user = new User(this.userDirectory)
        this.user = user

        try {
            this.startSelectedDownloadModeHandler(downloadMode)
        }
        catch(err) {
            throw new Error(err);
        }

    }

    async startSelectedDownloadModeHandler(downloadMode) {
        this[downloadMode]()
    }

    async downloadOnlyNewFavoriteTracks() {
        const result = await this.user.getOnlyNewTracksFromPlaylistFavorite()
        console.log('\x1b[36m%s\x1b[0m', "result = ", result);
    }

}