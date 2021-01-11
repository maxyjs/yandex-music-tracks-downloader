const ID3Writer = require('browser-id3-writer');
//'artists': 'TPE1',
// Artists name bug!

var mask = {
    'artists': 'TPE1',
    'title': 'TIT2',
    'genres': 'TCON',
    'durationMs': 'TLEN',
    'lyrics': 'USLT',
    'coverArrayBuffer': 'APIC',
    'officialAudioSourceWebpage': 'WOAS',
    'albumTitle': 'TALB',
    'trackPosition': 'TRCK',
};


function writeID3Tags(binaryData, trackInfo) {

        const trackInfoValid = getValidTrackInfo(trackInfo);
        const writer = new ID3Writer(binaryData);

        setAllFrame(writer, trackInfoValid);
        writer.addTag();

        return Buffer.from(writer.arrayBuffer);

    function setAllFrame(writer, trackInfoValid) {
        
        const keys = Object.keys(trackInfoValid);

        keys.forEach(key => {
            try{
                writer.setFrame(mask[key], trackInfoValid[key])
            }
            catch (err) {
                console.error( err );
            }
        })
    }

}

function getValidTrackInfo(trackInfo) {

    const entries = Object.entries(trackInfo);
    const trackInfoValid = {};

    for (const [key, value] of entries) {
        if(key !== "albumId" && key !== "id")
        {
            if(value) trackInfoValid[key] = trackInfo[key]
        }
    }

    return trackInfoValid;
}

module.exports = writeID3Tags;
