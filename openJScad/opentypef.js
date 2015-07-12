var font = null;
var fontSize = 25;
var isRTL = false;
var drawPoints = false;
var drawMetrics = false;
var kerning = true;
var previewPath = null;

function txtCAG(textToRender, fsize, narrowing, italictan) {
    if (!font) return new CAG();
    if (isRTL==false) { var textToRenderA=textToRender;}
    else { var textToRenderA=textToRender.split("").reverse().join("");}
    return font.getCAG(textToRenderA, 0, 0+(font.descender+font.ascender)/2/ font.unitsPerEm * fsize, fsize, {kerning: kerning}, narrowing, italictan);
}

function renderText(textToRender, narrowing, italictan) {
    if (!font) return;
    if (isRTL==false) { var textToRenderA=textToRender;}
    else { var textToRenderA=textToRender.split("").reverse().join("");}

    var previewCtx = document.getElementById('preview').getContext("2d");
    previewCtx.clearRect(0, 0, 940, 300);
    fontSize=30;
    font.draw(previewCtx, textToRenderA, 0, 25+(font.descender+font.ascender)/2/ font.unitsPerEm * fontSize, fontSize, {kerning: kerning}, narrowing, italictan);
}

// Create a canvas and adds it to the document.
// Returns the 2d drawing context.

function showErrorMessage(message) {
    var el = document.getElementById('message');
    if (!message || message.trim().length === 0) {
        el.style.display = 'none';
    } else {
        el.style.display = 'block';
    }
    el.innerHTML = message;
}

function onFontLoaded(font,textToRender, narrowing, italictan) {
    window.font = font;
    renderText(textToRender, narrowing, italictan);
}

function onFontLoadedNoRender(font) {
    window.font = font;
}
function onReadFile(e) {
    document.getElementById('font-name').innerHTML = '';
    var file = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        try {
            alert(file);
            font = opentype.parse(e.target.result);
            onFontLoaded(font);
            showErrorMessage('');
        } catch (err) {
            showErrorMessage(err.toString());
        }
    }
    reader.onerror = function (err) {
        showErrorMessage(err.toString());
    }

    reader.readAsArrayBuffer(file);
}

function LoadFont(fontFileName,textToRender, narrowing, italictan) {

opentype.load(fontFileName, function (err, font) {
    var amount, glyph, ctx, x, y, fontSize;
    if (err) {
        showErrorMessage(err.toString());
       return;
    }
    onFontLoaded(font,textToRender, narrowing, italictan);
});

};

function LoadFontUpdateSolid(fontFileName,textToRender, narrowing, italictan) {

opentype.load(fontFileName, function (err, font) {
    var amount, glyph, ctx, x, y, fontSize;
    if (err) {
        showErrorMessage(err.toString());
       return;
    }
    onFontLoaded(font,textToRender, narrowing, italictan);
    updateSolid();
});

};

function LoadFontNoUpdateNoPreview(fontFileName) {
opentype.load(fontFileName, function (err, font) {
    var amount, glyph, ctx, x, y, fontSize;
    if (err) {
        showErrorMessage(err.toString());
       return;
    }
      onFontLoadedNoRender(font);
//    onFontLoaded(font,textToRender, narrowing, italictan);
//    updateSolid();
});

};

