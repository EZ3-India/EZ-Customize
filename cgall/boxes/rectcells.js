
function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;

  var cellX		=Number(document.getElementById('sizeX').value);
  var cellY		=Number(document.getElementById('sizeY').value);
  var XX		=Number(document.getElementById('countX').value);
  var YY		=Number(document.getElementById('countY').value);
  var cellwall		=Number(document.getElementById('cellwall').value);
  var cellz		=Number(document.getElementById('cellZ').value);


  var wall 		=Number(document.getElementById('wall').value);
  //var fillet		=Number(document.getElementById('fillet').value);
  var bottomz		=Number(document.getElementById('bottomZ').value);
  var inside1		=Number(document.getElementById('insideZ').value);
  var coverz		=Number(document.getElementById('coverZ').value);
  var tolerance 	=Number(document.getElementById('tolerance').value);

  var sizeX0		=cellX*XX+cellwall*(XX-1);
  var sizeY0		=cellY*YY+cellwall*(YY-1);
  var sizeX1		=sizeX0+2*wall;
  var sizeY1		=sizeY0+2*wall;
  var fillet=wall*0.9;
  var result = new CSG();

  if (cellz>inside1) {callz=inside1;}

  //var B=new CAG.roundedRectangle({corner1: [-sizeX1/2,-sizeY1/2], corner2: [sizeX1/2,sizeY1/2], roundradius: fillet, resolution: 24});
  var B=new CAG.rectangle({corner1: [-sizeX0/2,-sizeY0/2], corner2: [sizeX0/2,sizeY0/2]});
  B=BOX1rects(B,bottomz,coverz,bottomz+inside1+coverz,wall,tolerance);
  if ((cellwall>0)&&(cellz>0)) {
    var C=new CAG.rectangle({corner1: [0, 0], corner2: [sizeX0, sizeY0]}).extrude({offset: [0,0,cellz]});
    var rec1=new CAG.rectangle({corner1: [0, 0], corner2: [cellX, cellY]}).extrude({offset: [0,0,cellz]});
    var rects= new CSG();
    for(var i=0;i<XX;i+=1) {
	for(var j=0;j<YY;j+=1)
		{
		rects=rects.unionForNonIntersecting(rec1.translate([i*(cellX+cellwall),j*(cellY+cellwall),0]));
		}
	}
  C=C.subtract(rects).translate([-sizeX0/2,-sizeY0/2,bottomz]);
  }
  B.box=B.box.union(C);

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
    { name: "Illustration", caption: "Illustration", data: B.box.union(B.cover.translate([0,0,bottomz+inside1+coverz*4])) } ,
    { name: "Box", caption: "Box", data: B.box } ,
    { name: "Cover", caption: "Cover", data: B.cover }
   	];
  }
  else {
  return [ { name: "Box", caption: "Box", data: B.box } ];
  }
}

function BOX1rects(boxcag, bottom, coverz,totalz,wall,tolerance)
{
	c4=boxcag;
	if (tolerance>0) { var c5=c4.contract(tolerance,48);} else {var c5=c4;}
	var c3=c4.expand((wall-tolerance)/2,48);
	if (tolerance>0) { var c2=c5.expand((wall+tolerance)/2,48);} else {var c2=c3;}
	var c1=boxcag.expand(wall,48);
        boxcag=c1;

	//var c2=boxcag.contract((wall-tolerance)/2);
	//if (tolerance>0) { var c3=c2.contract(tolerance);} else {var c3=c2;}
	//var c4=c3.contract((wall-tolerance)/2);
	//if (tolerance>0) { var c5=c4.contract(tolerance);} else {var c5=c4;}

        var box= boxcag.extrude({offset: [0,0,bottom]});
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
