// this is the list of templates and their show images , tags and other properties

var templateList = [ 
// tags: mechanical, text, tubing
 {typ: 'STL', folder: 'connectors/shaftplain' , 	caption: 'Shaft-Plain Connector' , thumbnails: [4,3] , tags: ['mechanical',]}
,{typ: 'STL' ,folder: 'connectors/angle_bracket' , 	caption: 'Angle Bracket' , thumbnails: [1,4] , tags: ['mechanical']}
,{typ: 'STL' ,folder: 'textsigns/textsign' , 		caption: 'Text Signs' , thumbnails: [7,9,8,5] , tags: ['text']}
,{typ: 'STL' ,folder: 'gears/spurgear' , 			caption: 'Spur Gear' , thumbnails: [1,3] , tags: ['mechanical']}
,{typ: 'STL' ,folder: 'gears/bevelgears' , 			caption: 'Bevel Gear Pair' , thumbnails: [2,3] , tags: ['mechanical']}
,{typ: 'STL' ,folder: 'textsigns/startext' , 		caption: 'Text on a Star' , thumbnails: [2,3] , tags: ['text']}
,{typ: 'STL' ,folder: 'textsigns/pyramidtext' , 	caption: 'Text on a Pyramid' , thumbnails: [1,4] , tags: ['text']}
//,{typ: 'STL',folder: '' , 						caption: '' , thumbnails: [] , tags: []}
,{typ: 'STL' ,folder: 'tubing/tubeendcap' , 		caption: 'Tube End Cap' , thumbnails: [1,2] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'tubing/tubethreadcap' , 		caption: 'Tube Threaded Cap' , thumbnails: [1,2] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'cooking/starmold' , 			caption: 'Star Cookie Cutter' , thumbnails: [2,3] , tags: []}
,{typ: 'STL' ,folder: 'cooking/textmold' , 			caption: 'Letter Cookie Cutter' , thumbnails: [4,3] , tags: ['text']}
,{typ: 'STL' ,folder: 'tubing/tubesconnector' , 	caption: 'Tubes Connector' , thumbnails: [2,3] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'tubing/tubethread' , 		caption: 'Tube Threaded Conn.' , thumbnails: [3,2] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'jewellery/letterholes' , 	caption: 'Holed Letters' , thumbnails: [2,1] , tags: ['text']}
,{typ: 'STL' ,folder: 'jewellery/letterbead' , 		caption: 'Letter Beads' , thumbnails: [7,8] , tags: ['text']}
,{typ: 'STL' ,folder: 'tubing/tubetosquare' , 		caption: 'Tube To Square Profile' , thumbnails: [1,3] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'boxes/rectcells' , 			caption: 'Rectangular Cells' , thumbnails: [1,4] , tags: ['text']}
,{typ: 'STL' ,folder: 'boxes/simplebox' , 			caption: 'Box & Lid' , thumbnails: [4,2] , tags: ['text']}
,{typ: 'STL' ,folder: 'boxes/starbox' , 			caption: 'Star Shaped Box' , thumbnails: [1,2] , tags: ['text']}
,{typ: 'STL' ,folder: 'connectors/trussconnector' , caption: 'Tube Truss Connector' , thumbnails: [1,2,3,4] , tags: ['mechanical','tubing']}
,{typ: 'STL' ,folder: 'textsigns/desksign' 	, 		caption: 'Desk Sign' , thumbnails: [1,2] , tags: ['text']}
,{typ: 'STL' ,folder: 'connectors/spacer' 	, 		caption: 'Spacer / Washer / Ring' , thumbnails: [3,4] , tags: ['mechanical']}

   
   
];


function generateLib(divname,caption,typ,cols){ 
	var s='<table class="LIB"><td class="LIB_HD" colspan='+cols.toString()+'>'+caption+'</td><tr>';
	var counter=0; // how many cols per layer = pairs of thumbs (up to 4..)
	for (i = 0; i < templateList.length; i++) { 
		if (cols-counter==0) {s+='<tr>'; counter=0;}
		if ((templateList[i].thumbnails.length==4)&&(cols-counter>=2)) 
		  {howmanytodo=4; s+='<td class="LIB_TD2" colspan=2>'; counter+=2;} else {howmanytodo=2; s+='<td class="LIB_TD">'; counter+=1;}
		s+='<a href="'+templateList[i].folder+'.html">';
		s+='<div class="Tcap">'+templateList[i].caption+'</div><div class="Timg">';
		for (j=0; j<howmanytodo ; j++) {
			s+='<img width=92 src="'+templateList[i].folder+templateList[i].thumbnails[j].toString()+'.png">';
		}
		s+='</div></a></td>';
	}
	s+="</table>";
	document.getElementById(divname).innerHTML=s;
}

	