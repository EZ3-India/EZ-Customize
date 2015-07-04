FontTable = [
{font: 'Aharoni Bold', 		file: 'ahronbd.ttf' , 			lang: ['Hebrew'] },
// {font: 'Alef Bold', 		file: 'Alef-bold.ttf' , 		lang: ['Hebrew'] },
// {font: 'Alef', 			file: 'Alef-regular_1.ttf' , 		lang: ['Hebrew'] },
// {font: 'Arial', 		file: 'arial.ttf' , 			lang: ['Latin','Hebrew','Arabic'] },
{font: 'Arial Bold', 		file: 'arialbd.ttf' , 			lang: ['Latin','Hebrew','Arabic'] },
// {font: 'Arial Black', 		file: 'ariblk.ttf' , 			lang: ['Latin'] },
// {font: 'Arial Rounded MT Bold', file: 'ARLRDBD.TTF' , 			lang: ['Latin'] },
{font: 'Berlin Sans FB', 	file: 'BRLNSR.TTF' , 			lang: ['Latin'] },
{font: 'Berlin Sans FB Demi Bold', 	file: 'BRLNSDB.TTF' , 		lang: ['Latin'] },
//{font: 'Berlin Sans FB Bold', file: 'BRLNSB.TTF' , 			lang: ['Latin'] },
{font: 'Bookman Old Style Bold',file: 'BOOKOSB.TTF' , 			lang: ['Latin']},
{font: 'Calibri', 		file: 'calibri.ttf' , 			lang: ['Latin'] },
{font: 'Calibri Bold', 		file: 'calibrib.ttf' , 			lang: ['Latin'] },
{font: 'Collegiate Black', 	file: 'CollegiateBlackFLF.ttf' , 	lang: ['Latin'] },
{font: 'Comic Sans MS', 	file: 'comic.ttf' , 			lang: ['Latin'] },
{font: 'Comic Sans MS Bold', 	file: 'comicbd.ttf' , 			lang: ['Latin'] },
// {font: 'Courier New', 		file: 'cour.ttf' ,			lang: ['Latin','Hebrew'] },
// {font: 'Courier New Bold', 	file: 'courbd.ttf' , 			lang: ['Latin','Hebrew'] },
// {font: 'David', 		file: 'david.ttf' , 			lang: ['Hebrew'] },
// {font: 'David Bold', 		file: 'davidbd.ttf' , 		 	lang: ['Hebrew'] },
// {font: 'FrankRuehl', 		file: 'frank.ttf' , 			lang: ['Hebrew'] },
//{font: 'Gan CLM Bold', 		file: 'ganclm_bold-webfont.ttf' , 	lang: ['Hebrew'] },
// {font: 'Georgia', 		file: 'georgia.ttf' ,	 		lang: ['Latin'] },
{font: 'Georgia Bold', 		file: 'georgiab.ttf' , 			lang: ['Latin'] },
{font: 'Guttman Yad-Brush', 	file: 'GYADBR.TTF' , 			lang: ['Hebrew'] },
// {font: 'Guttman Rashi Bold', 	file: 'RASHIB.TTF' , 			lang: ['Hebrew'] },
// {font: 'Guttman Yad-Brush', 	file: 'GYADBR.TTF' , 			lang: ['Hebrew'] },
// {font: 'Guttman STAM', 		file: 'STAM.TTF' , 			lang: ['Hebrew'] },
//{font: 'Helsinki', 		file: 'helsinki.ttf' ,	 		lang: ['Latin'] },
//{font: 'Komika Title', 		file: 'KOMTIT__.ttf' , 			lang: ['Latin'] },
{font: 'Lintsec', 		file: 'Lintsec.ttf' , 			lang: ['Latin'] },
// {font: 'Narkisim', 		file: 'nrkis.ttf' , 			lang: ['Hebrew'] },
{font: 'Rockwell', 		file: 'rockwell.ttf' , 			lang: ['Latin'] },
//{font: 'Rockwell Bold', 	file: 'rockwellbd.ttf' , 		lang: ['Latin'] },
// {font: 'Tahoma', 		file: 'tahoma.ttf' , 			lang: ['Hebrew'] },
// {font: 'Tahoma Bold', 		file: 'tahomabd.ttf' , 			lang: ['Hebrew'] },
{font: 'VAG Rounded Bold', 	file: 'VAG_Rounded_Bold.ttf' , 			lang: ['Latin'] },
{font: 'Verdana', 		file: 'verdana.ttf' , 			lang: ['Latin'] },
{font: 'Verdana Bold', 		file: 'verdanab.ttf' , 			lang: ['Latin'] }
//{font: 'Ubuntu-Title', 		file: 'Ubuntu-Title.ttf' , 		lang: ['Latin'] }


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
