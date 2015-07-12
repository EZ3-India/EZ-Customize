var ExamplesLinks=[
  'ml?TubeD=10&WallT=2&Chamfer=1&DLL=12&Depth=20&HoleD=0&en1=true&theta1=90&phi1=180&en2=true&theta2=90&phi2=135&en3=true&theta3=0&phi3=0&en4=false&theta4=90&phi4=0&en5=false&theta5=90&phi5=0&en6=false&theta6=90&phi6=0&en7=false&theta7=90&phi7=0&en8=false&theta8=90&phi8=0&en9=false&theta9=90&phi9=0&en10=false&theta10=90&phi10=0&RESO=36'
  ,
  'l?TubeD=10&WallT=2&Chamfer=1&DLL=10&Depth=20&HoleD=3&en1=true&theta1=90&phi1=0&en2=true&theta2=90&phi2=90&en3=true&theta3=0&phi3=0&en4=false&theta4=90&phi4=0&en5=false&theta5=90&phi5=0&en6=false&theta6=90&phi6=0&en7=false&theta7=90&phi7=0&en8=false&theta8=90&phi8=0&en9=false&theta9=90&phi9=0&en10=false&theta10=90&phi10=0&RESO=4'
  ,
  'l?TubeD=10&WallT=2&Chamfer=1&DLL=10&Depth=20&HoleD=3&en1=true&theta1=90&phi1=0&en2=true&theta2=90&phi2=90&en3=true&theta3=0&phi3=0&en4=true&theta4=90&phi4=180&en5=false&theta5=90&phi5=0&en6=false&theta6=90&phi6=0&en7=false&theta7=90&phi7=0&en8=false&theta8=90&phi8=0&en9=false&theta9=90&phi9=0&en10=false&theta10=90&phi10=0&RESO=4'
  ,
  'l?TubeD=20&WallT=2&Chamfer=1&DLL=25&Depth=20&HoleD=3&en1=true&theta1=58.283&phi1=0&en2=true&theta2=58.283&phi2=72&en3=true&theta3=58.283&phi3=144&en4=true&theta4=58.283&phi4=-72&en5=true&theta5=58.283&phi5=-144&en6=false&theta6=90&phi6=0&en7=false&theta7=90&phi7=0&en8=false&theta8=90&phi8=0&en9=false&theta9=90&phi9=0&en10=false&theta10=90&phi10=0&RESO=36'
  ]
  
function main()
{  
  var TubeD = Number(document.getElementById('TubeD').value);
  var RESO = Number(document.getElementById('RESO').value);
  var WallT = Number(document.getElementById('WallT').value);
  var DLL = Number(document.getElementById('DLL').value);
  var Chamfer = Number(document.getElementById('Chamfer').value);
  var Depth = Number(document.getElementById('Depth').value);
  var HoleD = Number(document.getElementById('HoleD').value);
  var HoleL = Depth/2;//Number(document.getElementById('HoleL').value);
  if (Chamfer>WallT) Chamfer=WallT*0.8;
  if (Chamfer>Depth) Chamfer=Depth*0.8;
  
  //var OpenW = Number(document.getElementById('OpenW').value);
  //var OpenDepth = Number(document.getElementById('OpenDepth').value);
  
  
  //var Exits=[
  //				{Theta: 90,  Phi: 0,   DL: 10, Txt: "WW"},
  //				{Theta: 90 , Phi: 45,  DL: 10, Txt: "BC"},
  //			    {Theta: 00 , Phi: 202.5,  DL: 10, Txt: "D7"}
  //			 ];
  
  var Exits = [];
  
  for(var i=1;i<=10;i++) {
	  if (document.getElementById('en'+i.toString()).checked == true) {
	  	Exits.push({Theta: Number(document.getElementById('theta'+i.toString()).value), Phi: Number(document.getElementById('phi'+i.toString()).value), DL: DLL});
		}
}
  
  var OD=TubeD+2*WallT;
  if (RESO<10) {OD=OD/Math.cos(Math.PI/RESO);}
  if (RESO<10) {var TubeR=TubeD/2/Math.cos(Math.PI/RESO);} else { var TubeR=TubeD/2;}
  
  var RAD=OD/2;
  
  var CON = new CSG();
  var CONsub = new CSG();
  //var CONtext= new CSG();
    
  for (var i=0; i<Exits.length;i++) {
	  var Theta=Exits[i].Theta;
	  var Phi=Exits[i].Phi;
	  var DL=Exits[i].DL;
	  //var txt=Exits[i].Txt;
	  
      var R=new CAG.rectangle({corner1: [0, 0], corner2: [RAD,DL]});
      
	  if (RESO<1000) {R=R.union(new CAG.rectangle({corner1: [TubeD/8, 0], corner2: [RAD,DL+Depth]}));} else {R=R.union(new CAG.rectangle({corner1: [TubeR, 0], corner2: [RAD,DL+Depth]}));}
	  if ((Chamfer>0)&&(RESO>10)) R=R.subtract(new CAG.circle({center: [TubeR, DL+Depth], radius: Chamfer/Math.cos(Math.PI/RESO), resolution: 4}) );
	  //if ((Chamfer>0)&&(RESO==4)) R=R.subtract(new CAG.rectangle({corner1: [TubeR, DL+Depth], corner2: [0, DL+Depth-Chamfer/Math.cos(Math.PI/RESO)]}) );
	  R=revolveZ(R,RESO);
	  
	  var Rsub = new CSG();
	  Rsub=Rsub.union(CSG.cylinder({start: [0, 0, DL+Depth],end: [0, 0, DL],radius: TubeD/2, resolution: 36 }));
	  if ((Chamfer>0)&&(RESO==4)) Rsub=Rsub.union(revolveZ(CAG.circle({center: [TubeD/2, DL+Depth], radius: Chamfer, resolution: 4}),36));
	  
	  
	  if (RESO<50) { R=R.rotateZ(180/RESO);}
	  
	  //if (RESO<10) {var T=TextCSG(txt,RAD/1.5,RAD*Math.cos(Math.PI/RESO)+1); } else  {var T=TextCSG(txt,RAD/1.5,RAD+1); } 
	  //T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,-T.getBounds()[0].y,0]).setColor(0.9, 0.9, 0.9).rotateX(-90).rotateZ(180).translate([0,0,DL+Depth-OpenDepth]);
	  
	  
	  if(HoleD>0) R=R.subtract(CSG.cylinder({start: [-RAD*2, 0, DL+Depth-HoleL],end: [RAD*2, 0, DL+Depth-HoleL],radius: HoleD/2, resolution: 16 }));
	  
	  //R=R.subtract(CSG.cube({corner1: [-OpenW/2, 0, DL+Depth],corner2: [OpenW/2, -RAD*2, DL+Depth-OpenDepth]}));
	  
	  R=R.rotateX(-Theta).rotateZ(Phi);
	  Rsub=Rsub.rotateX(-Theta).rotateZ(Phi);
	  //T=T.rotateX(-Theta).rotateZ(Phi);
	  
	  CON=CON.union(R);
	  CONsub=CONsub.union(Rsub);
	  //CONtext=CONtext.union(T);
  }
  
  var F=CSG.sphere({center: [0, 0, 0],radius:RAD, resolution: Math.max(36,RESO)});
 
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([0, 0, -1], [0, 0, CON.getBounds()[0].z]));
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([0, 0, 1], [0, 0, CON.getBounds()[1].z]));
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([1, 0, 0], [ CON.getBounds()[1].x, 0,0]));
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([-1, 0, 0], [ CON.getBounds()[0].x, 0,0]));
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([0, 1, 0], [ 0,CON.getBounds()[1].y, 0]));
  F=F.cutByPlane(CSG.Plane.fromNormalAndPoint([0, -1, 0], [ 0,CON.getBounds()[0].y, 0]));
  
  CON=CON.subtract(CONsub);
  
  CON=CON.union(F).translate([0,0,-CON.getBounds()[0].z]);
  
  
 	  
  return [
      { name: "TubeTrussConnector", caption: "Tube Truss Connector", data: CON } 
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