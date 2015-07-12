
function main()
{
	var txt		=document.getElementById('textField').value;
    var FontSize 		=Number(document.getElementById('FontSize').value);
    var TextThickness 	=Number(document.getElementById('TextThickness').value);
    var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
    var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;
    var mirror		=document.getElementById('mirror').checked;

    var SelectP 		=document.getElementById('SelectP').value;
	var ShapeSize 		=Number(document.getElementById('ShapeSize').value);
    var BeadH 			=Number(document.getElementById('BeadH').value);
    var SelectTop 		=document.getElementById('SelectTop').value;
    var SelectBottom	=document.getElementById('SelectBottom').value;
    var TopEdgeSize 	=0.01*Number(document.getElementById('TopEdgeSize').value);
    var BottomEdgeSize	=0.01*Number(document.getElementById('BottomEdgeSize').value);
    var HoleD			=Number(document.getElementById('HoleD').value);
    var HoleL			=Number(document.getElementById('HoleL').value);

    if (SelectP=='Circle') 	{var Rad=ShapeSize*0.5;  		var RESO=60;	var Angle=0;}
    if (SelectP=='Square') 	{var Rad=ShapeSize*0.707107;	var RESO=4;		var Angle=45;}
    if (SelectP=='Diamond') {var Rad=ShapeSize*0.707107;	var RESO=4;		var Angle=0;}
    if (SelectP=='Pentagon'){var Rad=ShapeSize*0.52573;  	var RESO=5;		var Angle=90;}
    if (SelectP=='HexV') 	{var Rad=ShapeSize*0.57735;  	var RESO=6;		var Angle=30;}
    if (SelectP=='HexH') 	{var Rad=ShapeSize*0.57735;  	var RESO=6;		var Angle=0;}
    if (SelectP=='Octagon') {var Rad=ShapeSize*0.5412;  	var RESO=8;		var Angle=22.5;}


    if (SelectBottom=='None') BottomEdgeSize=0;
    if (SelectTop=='None')    TopEdgeSize=0;

    var TS=Math.min(Rad,BeadH)*TopEdgeSize;
    var BS=Math.min(Rad,BeadH)*BottomEdgeSize;
    if (TS+BS>BeadH) { TS=TS/(TS+BS)*BeadH; BS=BeadH-TS;}  // resize both to fit the height

    var B=new CAG.rectangle({corner1: [0, 0], corner2: [Rad, BeadH]});
    //reduce edges

    if ((SelectBottom=='Cove')&&(BS>0)) 	B=B.subtract(new CAG.circle({center: [Rad, 0], radius: BS, resolution: 60}));
    if ((SelectTop=='Cove')&&(TS>0))  		B=B.subtract(new CAG.circle({center: [Rad, BeadH], radius: TS, resolution: 60}));
    if ((SelectBottom=='Bevel')&&(BS>0))  	B=B.subtract(new CAG.circle({center: [Rad, 0], radius: BS, resolution: 4}));
    if ((SelectTop=='Bevel')&&(TS>0))  		B=B.subtract(new CAG.circle({center: [Rad, BeadH], radius: TS, resolution: 4}));

    if ((SelectBottom=='Round')&&(BS>0)) 	B=B.subtract(new CAG.circle({center: [Rad, 0], radius: BS, resolution: 4}).subtract(new CAG.circle({center: [Rad-BS, BS], radius: BS, resolution: 60})));
    if ((SelectTop=='Round')&&(TS>0)) 		B=B.subtract(new CAG.circle({center: [Rad, BeadH], radius: TS, resolution: 4}).subtract(new CAG.circle({center: [Rad-TS, BeadH-TS], radius: TS, resolution: 60})));

    B=revolveZ(B,RESO).rotateZ(Angle);

    //creating text
     var T8 = txtCAG("8",FontSize,TextNarrowing ,TextItalic);
     var DX=Math.max(2*Rad,(T8.getBounds()[1].x - T8.getBounds()[0].x))+1;
     T8=-(T8.getBounds()[1].y + T8.getBounds()[0].y)/2;

     var Result = new CSG();
     txt=txt.split("");
     var T;

     var CurX=-(DX*txt.length-1)/2+Rad;
     for (var i=0;i<txt.length;i++) {
	     T = txtCAG(txt[i],FontSize,TextNarrowing ,TextItalic);
     	 T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,T8]);
         if (mirror==true) { T=T.mirroredX();}
         if (TextThickness>0) T=B.union(T.extrude({offset: [0,0,TextThickness+TS]}).translate([0,0,BeadH-TS]).setColor(0.8, 0.8, 0.8));
         else T=B.subtract(T.extrude({offset: [0,0,TextThickness]}).translate([0,0,BeadH]).setColor(0.8, 0.8, 0.8));
         if (HoleD>0) T=T.subtract(CSG.cylinder({start: [-Rad-1, HoleL, BeadH/2],end: [Rad+1, HoleL, BeadH/2],radius: HoleD/2,resolution: 24}));
         Result=Result.unionForNonIntersecting(T.translate([CurX,0,0]));
         CurX+=DX;
     }





  return [
    { name: "Beads", caption: "Beads", data: Result}
   	];
}

function revolveZ(Cag, resolution)
	{
		var DegStep=360/resolution;
		var DegStepR=2*Math.PI/resolution;
	    var lines = [];
	    Cag.sides.map(function(side) {lines.push([side.vertex0.pos.x,side.vertex0.pos.y,side.vertex1.pos.x,side.vertex1.pos.y]);});

	    var polygons = [];
	    var DegR=0;
	    for(var Deg=0;Deg<360;Deg+=DegStep)
			{
				DegR=Deg*Math.PI/180;
				for(var i=0;i<lines.length;i++) {
		          if ((lines[i][0]!=0)&&(lines[i][2]!=0)) {
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))

                    ]);
					polygons.push(poly);
				  }
				  else if (lines[i][2]!=0) {
					var poly = new CSG.Polygon([
					//new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))

                    ]);
					polygons.push(poly);
				  }
				  else if (lines[i][0]!=0) {
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					//new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))

                    ]);
					polygons.push(poly);
				  }
		       }
		}
	    return new CSG.fromPolygons(polygons);
}
