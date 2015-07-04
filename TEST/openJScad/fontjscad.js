FontTable = [
{font: 'Arial', 		file: 'arial.ttf' , 			lang: ['Latin','Hebrew','Arabic'] },
{font: 'Hallo', file: 'halloa.ttf' , 			lang: ['Latin'] },
{font: 'Kannada', file: 'hallo.ttf' , 			lang: ['Latin'] },
{font: 'Arial Bold', 		file: 'arialbd.ttf' , 			lang: ['Latin','Hebrew','Arabic'] },
{font: 'Arial Black', 		file: 'ariblk.ttf' , 			lang: ['Latin'] },
{font: 'Arial Rounded MT Bold', file: 'ARLRDBD.TTF' , 			lang: ['Latin'] }


];

var isRTL = false; //is Right To Left

function UpdateLangList(SelectID) {
	document.getElementById(SelectID).options[0]= new Option('Latin', 'Latin', true, true);
	document.getElementById(SelectID).options[1]= new Option('Arabic', 'Arabic', false, false);
	document.getElementById(SelectID).options[2]= new Option('Hebrew', 'Hebrew', false, false);
}

function UpdateFontList(SelectID, lang) {
	if ((lang=='Hebrew')||(lang=='Arabic')) {isRTL=true;} else {isRTL=false;}

	document.getElementById(SelectID).length=0;
        var hasthelang;
        var cou=0;
        var j=0;
        for(var i=0;i<FontTable.length;i++) {
		hasthelang=false;
                for(j=0;j<FontTable[i].lang.length;j++) { if (FontTable[i].lang[j]==lang) {hasthelang=true;}}
		if (hasthelang==true) {
			document.getElementById(SelectID).options[cou]= new Option(FontTable[i].font, FontTable[i].file, i==0, i==0);
			cou++;
		}
	}
	return 0;
}
