const fs = require('fs');

function saveTrack(binaryTrack, artists, title, codec, downloadsPath) {

    const fileExtension = codec === "mp3" ? "mp3" : "mp4";
    const trackName = `${artists} - ${title}`;
    
    const validTrackName = trackName.replace(/[\/:*?<>|~"]/g, '_');
    const trackPath = `${downloadsPath}\\${validTrackName}.${fileExtension}`;

    fs.writeFile(trackPath, binaryTrack, (err) => {
        if (err) throw new Error(err);
        console.log('\x1b[33m%s\x1b[0m', "File saved: ", trackPath);
        }
    );
}

module.exports = saveTrack;
