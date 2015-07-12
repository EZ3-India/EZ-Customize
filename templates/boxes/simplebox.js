
var sizeX1=0;
var sizeY1=0;
var fillet=0;

function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;

  sizeX1		=Number(document.getElementById('sizeX').value);
  sizeY1		=Number(document.getElementById('sizeY').value);
  var wall 		=Number(document.getElementById('wall').value);
  fillet		=Number(document.getElementById('fillet').value);
  var bottomz		=Number(document.getElementById('bottomZ').value);
  var inside1		=Number(document.getElementById('insideZ').value);
  var coverz		=Number(document.getElementById('coverZ').value);
  var tolerance 	=Number(document.getElementById('tolerance').value);


  var result = new CSG();

  var B=new CAG.roundedRectangle({corner1: [-sizeX1/2,-sizeY1/2], corner2: [sizeX1/2,sizeY1/2], roundradius: fillet, resolution: 60});
  B=BOX1(B,bottomz,coverz,bottomz+inside1+coverz,wall,tolerance);
  if (coverz>0) {

          //creating text
 	  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
 	  T=T.extrude({offset: [0,0,TextThickness]});

 	  //centering text & lifting on the cover
 	  var T8 = txtCAG("8",FontSize,TextNarrowing ,TextItalic);
      T8=-(T8.getBounds()[1].y + T8.getBounds()[0].y)/2;
  	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,T8,coverz]).setColor(0.9, 0.9, 0.9);  // setColor(1, 0.925, 0.7);

          //resize T if needed
          var sc=Math.max(T.getBounds()[1].x/B.cover.getBounds()[1].x,T.getBounds()[1].y/B.cover.getBounds()[1].y,T.getBounds()[0].y/B.cover.getBounds()[0].y);
          if (sc>1) { T=T.scale([1/sc, 1/sc, 1]);}
          B.cover=B.cover.setColor(0.8,0.8,0.8);
          if (TextThickness>0) B.cover=B.cover.union(T); else B.cover=B.cover.subtract(T);
  }

  if (coverz>0) {
  return [
    { name: "Illustration", caption: "Illustration", data: B.box.union(B.cover.translate([0,0,bottomz+inside1+coverz])) } ,
    { name: "Box", caption: "Box", data: B.box } ,
    { name: "Cover", caption: "Cover", data: B.cover }
   	];
  }
  else {
  return [ { name: "Box", caption: "Box", data: B.box } ];
  }
}

function NotBelew0(x) { if (x>0) return x; else return 0 }

function BOX1(boxcag, bottom, coverz,totalz,wall,tolerance)
{

	var shrink=(wall-tolerance)/2; var curFillet=fillet-shrink;
	//var c2=boxcag.scale([(sizeX1-shrink)/sizeX1,(sizeY1-shrink)/sizeY1]); // boxcag.contract((wall-tolerance)/2);
	if (curFillet>0) var c2=new CAG.roundedRectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink], roundradius: curFillet, resolution: 60});
	else var c2=new CAG.rectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink]});

    shrink+=tolerance; curFillet=fillet-shrink;
	//var c3=boxcag.scale([(sizeX1-shrink)/sizeX1,(sizeY1-shrink)/sizeY1]); //  c2.contract(tolerance);
	if (curFillet>0) var c3=new CAG.roundedRectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink], roundradius: curFillet, resolution: 60});
	else var c3=new CAG.rectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink]});

	shrink+=(wall-tolerance)/2; curFillet=fillet-shrink;
	//var c4=boxcag.scale([(sizeX1-shrink)/sizeX1,(sizeY1-shrink)/sizeY1]); //  c3.contract((wall-tolerance)/2);
	if (curFillet>0) var c4=new CAG.roundedRectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink], roundradius: curFillet, resolution: 60});
	else var c4=new CAG.rectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink]});

	shrink+=tolerance; curFillet=fillet-shrink;
	//var c5=boxcag.scale([(sizeX1-shrink)/sizeX1,(sizeY1-shrink)/sizeY1]); //  c4.contract(tolerance);
    if (curFillet>0) var c5=new CAG.roundedRectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink], roundradius: curFillet, resolution: 60});
	else var c5=new CAG.rectangle({corner1: [-sizeX1/2+shrink,-sizeY1/2+shrink], corner2: [sizeX1/2-shrink,sizeY1/2-shrink]});



	//var c2=boxcag.contract((wall-tolerance)/2);
	//if (tolerance>0) { var c3=c2.contract(tolerance);} else {var c3=c2;}
	//var c4=c3.contract((wall-tolerance)/2);
	//if (tolerance>0) { var c5=c4.contract(tolerance);} else {var c5=c4;}

    var box=boxcag.extrude({offset: [0,0,bottom]});
    var wallcag=boxcag.subtract(c4);


	box=box.union(wallcag.extrude({offset: [0,0,totalz-coverz]}));

        if (coverz<tolerance) { var z1=coverz/2;}
        else {
          if (coverz<tolerance+3) {var z1=(coverz-tolerance)/2; }
          else {var z1=coverz/3;}
        }

	if (z1>0) {box=box.union(wallcag.intersect(c3).extrude({offset: [0,0,z1]}).translate([0,0,totalz-coverz]));}


        if (coverz>0) {
        	var cover=boxcag.subtract(c2).union(c5).extrude({offset: [0,0,coverz-z1]});
        	cover=cover.union(boxcag.extrude({offset: [0,0,z1]}).translate([0,0,coverz-z1]));
        }
        else { cover=new CSG(); }
       	return {box: box , cover: cover} ;
}
