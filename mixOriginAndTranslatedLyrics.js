function mixOriginAndTranslatedLyrics(translatedAndOrigin) {

    let {originalText, translatedText} = translatedAndOrigin;
    const originalTextArr = originalText.split('\n');
    let translatedTextArr = translatedText.split('\n');
    translatedTextArr = modifyTitle(translatedTextArr);

    const mixedTextArr = [];

    for (let i = 0; i < originalTextArr.length; i++) {
        mixedTextArr.push(originalTextArr[i] + '\n');
        mixedTextArr.push(translatedTextArr[i] + '\n' || '');
    }

    return mixedTextArr.join('')
}

function modifyTitle(translatedTextArr){

    let title = translatedTextArr[0];
    const newTitle = title.toUpperCase();
    translatedTextArr[0] = newTitle;

    return translatedTextArr;
}

module.exports = mixOriginAndTranslatedLyrics;