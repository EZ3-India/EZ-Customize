
function main()
{


  var txtA		=document.getElementById('textField').value;
  var txtB		=document.getElementById('textB').value;
  var txtC		=document.getElementById('textC').value;
  var txtD		=document.getElementById('textD').value;

  if(txtA.length>0) {txtA=txtA.split(/\r\n|\r|\n/g); }
  if(txtB.length>0) {txtB=txtB.split(/\r\n|\r|\n/g); }
  if(txtC.length>0) {txtC=txtC.split(/\r\n|\r|\n/g); }
  if(txtD.length>0) {txtD=txtD.split(/\r\n|\r|\n/g); }

  var FontSize 		=20;
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;
  var mirror		=document.getElementById('mirror').checked;
  var Equal			=document.getElementById('Equal').checked;


  var BaseE 	=Number(document.getElementById('BaseE').value);
  var AngleDeg 	=Number(document.getElementById('Angle').value);
  var Angle 	=AngleDeg*3.14159265359/180;

  var Thickness 	=Number(document.getElementById('Thickness').value);
  var ThickH		=Thickness/Math.sin(Angle);
  var HoleE 	=Number(document.getElementById('HoleE').value);

  var BottomMargin=Number(document.getElementById('BottomMargin').value);
  var SideMargin=Number(document.getElementById('SideMargin').value);
  var LineC 	=Number(document.getElementById('LineC').value)*0.01;

  var TopE	 	=HoleE;
  var BaseR		=BaseE*0.7071067812;
  var TopR		=TopE*0.7071067812;
  var BaseIR    =(BaseE-2*ThickH)*0.7071067812;
  var TopIR     =(TopE)*0.7071067812;

  var Height=Math.tan(Angle)*(BaseE - TopE)/2
  var HeightI=Math.tan(Angle)*(BaseE-2*ThickH - TopE)/2


  var result = new CSG();



  var cone = CSG.cylinder({start: [0, 0, 0],end: [0, 0,Height],radiusStart: BaseR,radiusEnd: TopR,resolution: 4});
  if (Thickness>0) {
  	cone=cone.subtract(CSG.cylinder({start: [0, 0, 0],end: [0, 0,HeightI],radiusStart: BaseIR,radiusEnd: TopIR,resolution: 4}));
  }
  if (HoleE>0) {
	  cone=cone.subtract(CSG.cylinder({start: [0, 0, 0],end: [0, 0,Height],radiusStart: TopIR,radiusEnd: TopIR,resolution: 4}));
  }
  cone=cone.rotateZ(45);


  // determine text height
  var T = txtCAG("8",FontSize,TextNarrowing ,TextItalic);
  var lineH=(T.getBounds()[1].y - T.getBounds()[0].y)*LineC;


  var pointsA = [];
  var pointsB = [];
  var pointsC = [];
  var pointsD = [];

  var trapezH=Math.pow(Math.pow((BaseE-TopE)/2 ,2)+Math.pow(Height,2),0.5);
  var ScaleA =9999;
  var ScaleB =9999;
  var ScaleC =9999;
  var ScaleD =9999;

  var pa=BaseE/2;
  var pb=0;
  var pc=TopE/2;
  var pd=trapezH;

  pa-=SideMargin;
  pc-=SideMargin;

  pb-=BottomMargin;
  pd-=BottomMargin;

  //creating text
  var AA = new CAG();
  for(var i=0;i<txtA.length;i++) {
	  T=txtCAG(txtA[i],FontSize,TextNarrowing ,TextItalic).translate([0,-lineH*i,0]);
	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]);
	  pointsA.push([T.getBounds()[1].x,T.getBounds()[1].y]);
      AA = AA.union(T);
  }
  var AA0 = -AA.getBounds()[0].y
  AA=AA.translate([0,AA0,0]);  // bottom alignment


  var BB = new CAG();
  for(var i=0;i<txtB.length;i++) {
	  T=txtCAG(txtB[i],FontSize,TextNarrowing ,TextItalic).translate([0,-lineH*i,0]);
	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]);
	  pointsB.push([T.getBounds()[1].x,T.getBounds()[1].y]);
      BB = BB.union(T);
  }
  var BB0 = -BB.getBounds()[0].y
  BB=BB.translate([0,BB0,0]);  // bottom alignment

  var CC = new CAG();
  for(var i=0;i<txtC.length;i++) {
	  T=txtCAG(txtC[i],FontSize,TextNarrowing ,TextItalic).translate([0,-lineH*i,0]);
	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]);
	  pointsC.push([T.getBounds()[1].x,T.getBounds()[1].y]);
      CC = CC.union(T);
  }
  var CC0 = -CC.getBounds()[0].y
  CC=CC.translate([0,CC0,0]);  // bottom alignment

  var DD = new CAG();
  for(var i=0;i<txtD.length;i++) {
	  T=txtCAG(txtD[i],FontSize,TextNarrowing ,TextItalic).translate([0,-lineH*i,0]);
	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]);
	  pointsD.push([T.getBounds()[1].x,T.getBounds()[1].y]);
      DD = DD.union(T);
  }
  var DD0 = -DD.getBounds()[0].y
  DD=DD.translate([0,DD0,0]);  // bottom alignment




  if (mirror==true) { AA=AA.mirroredX(); BB=BB.mirroredX(); CC=CC.mirroredX(); DD=DD.mirroredX();}//mirroring

  // search for minimum scaling
  ScaleA=Math.min(ScaleA,pd/(pointsA[0][1]+AA0));
  ScaleB=Math.min(ScaleB,pd/(pointsA[0][1]+BB0));
  ScaleC=Math.min(ScaleC,pd/(pointsA[0][1]+CC0));
  ScaleD=Math.min(ScaleD,pd/(pointsA[0][1]+DD0));

  for(var i=0;i<pointsA.length;i++)
  	{
	  	var news=(pb*pc-pa*pd)/(pointsA[i][0]*(pb-pd)+(pointsA[i][1]+AA0)*(pc-pa));
	  	ScaleA=Math.min(ScaleA,news);
    }
  for(var i=0;i<pointsB.length;i++)
  	{
	  	var news=(pb*pc-pa*pd)/(pointsB[i][0]*(pb-pd)+(pointsB[i][1]+BB0)*(pc-pa));
	  	ScaleB=Math.min(ScaleB,news);

    }
  for(var i=0;i<pointsC.length;i++)
  	{
	  	var news=(pb*pc-pa*pd)/(pointsC[i][0]*(pb-pd)+(pointsC[i][1]+CC0)*(pc-pa));
	  	ScaleC=Math.min(ScaleC,news);
    }
  for(var i=0;i<pointsD.length;i++)
  	{
	  	var news=(pb*pc-pa*pd)/(pointsD[i][0]*(pb-pd)+(pointsD[i][1]+DD0)*(pc-pa));
	  	ScaleD=Math.min(ScaleD,news);
    }

  if (Equal==true) {
  	ScaleA=Math.min(ScaleA,ScaleB,ScaleC,ScaleD);
  	ScaleB=ScaleA;
  	ScaleC=ScaleA;
  	ScaleD=ScaleA;
	}

  AA=AA.scale(ScaleA).translate([0,BottomMargin,0]);
  BB=BB.scale(ScaleB).translate([0,BottomMargin,0]);
  CC=CC.scale(ScaleC).translate([0,BottomMargin,0]);
  DD=DD.scale(ScaleD).translate([0,BottomMargin,0]);

  AA=AA.extrude({offset: [0,0,TextThickness]});
  AA=AA.rotateX(AngleDeg).translate([0,-BaseE/2,0]);

  BB=BB.extrude({offset: [0,0,TextThickness]});
  BB=BB.rotateX(AngleDeg).translate([0,-BaseE/2,0]).rotateZ(90);

  CC=CC.extrude({offset: [0,0,TextThickness]});
  CC=CC.rotateX(AngleDeg).translate([0,-BaseE/2,0]).rotateZ(180);

  DD=DD.extrude({offset: [0,0,TextThickness]});
  DD=DD.rotateX(AngleDeg).translate([0,-BaseE/2,0]).rotateZ(270);

  AA=AA.unionForNonIntersecting(BB);
  AA=AA.unionForNonIntersecting(CC);
  AA=AA.unionForNonIntersecting(DD).setColor(1, 0.95, 0.8);

  if (TextThickness>0) cone=cone.union(AA); else cone=cone.subtract(AA);

  return [
    { name: "Pyramid_Text", caption: "Pyramid Text", data: cone }
   	];
}
