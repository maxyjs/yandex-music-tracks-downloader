const axios = require('axios');

class UserYmService {
    constructor(authenticationData){
        this.authenticationData = authenticationData;
    }

    async getAllUserOpenedPlaylists() {

        const outputField = "playlists";

        try {
            const url = `https://music.yandex.ru/handlers/library.jsx?owner=${this.authenticationData.userName}&filter=playlists`
            const {data} = await axios.get(url);
            return this._parseData(data, outputField)
        }
        catch (err) {
            throw new Error(err);
        }

    }

    async getAllUserOpenedPlaylistsWithoutFavorite() {
        const allUserOpenedPlaylists = await this.getAllUserOpenedPlaylists();
        allUserOpenedPlaylists.shift();
        return allUserOpenedPlaylists;
    }

    async getPlaylistsHasMark(mark){
        const allUserOpenedPlaylists = await this.getAllUserOpenedPlaylistsWithoutFavorite();
        return allUserOpenedPlaylists.filter(playlist => playlist.title.includes(mark))
    }

    async getAllTracksFromPlaylistFavorite() {
        const allUserOpenedPlaylists = await this.getAllUserOpenedPlaylists();
        const outputData = allUserOpenedPlaylists;
        ///const outputData = {...allUserOpenedPlaylists[0], ...allUserOpenedPlaylists[1]}
        return outputData; //temp
    }

    _parseData(data, outputField) {
        let output = [];
        if(data === UserYmService._isEmptyObject(data)) return output;

        output = data[outputField];
        return output;
    }

    static _isEmptyObject(obj) {
        return Object.keys(obj).length === 0;
    }
}

module.exports = UserYmService;
