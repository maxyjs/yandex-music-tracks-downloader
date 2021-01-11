const translate = require('@vitalets/google-translate-api');

async function translateLyrics(textLanguage, text, title) {
    
    text = addTitle(text, title);
    
    try {
        const result = await translate(text, {from: textLanguage, to: 'ru'});
        return {
            originalText: text,
            translatedText: result.text
        };
    } catch (e) {
        console.error( "translateLyrics error:\n", e );
        return null;
    }

    function addTitle(text, title) {
        return `${title}\n${text}`
    }
}

module.exports = translateLyrics;
