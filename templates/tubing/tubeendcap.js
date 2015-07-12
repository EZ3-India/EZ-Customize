

function main()
{
  var OuterD = Number(document.getElementById('OuterD').value);
  var InnerD = Number(document.getElementById('InnerD').value);
  var BottomT = Number(document.getElementById('BottomT').value);
  var WallH = Number(document.getElementById('WallH').value);
  var WallT = Number(document.getElementById('WallT').value);
  var Chamfer = Number(document.getElementById('Chamfer').value);
  var Tolerance = Number(document.getElementById('Tolerance').value);

  var InnerW = document.getElementById('InnerW').checked;
  var OuterW = document.getElementById('OuterW').checked;

  Chamfer=Math.min(Chamfer,WallH-0.1,WallT-0.1);

  if (BottomT>0) var cap = CSG.cylinder({start: [0, 0, 0],end: [0, 0, BottomT], radius: OuterD/2,  resolution: 72  });
  else var cap=new CSG();

  var R=new CAG();

  if (OuterW==true) {
	  R=R.union(new CAG.rectangle({corner1: [OuterD/2+Tolerance+WallT, 0], corner2: [OuterD/2+Tolerance, WallH+BottomT]}));
	  if ((Tolerance>0)&&(BottomT>0)) R=R.union(new CAG.rectangle({corner1: [InnerD/2-Tolerance-WallT, 0], corner2: [OuterD/2+Tolerance+WallT, BottomT]}));
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[OuterD/2+Tolerance,WallH+BottomT-Chamfer], [OuterD/2+Tolerance+Chamfer,WallH+BottomT],[OuterD/2+Tolerance,WallH+BottomT]]));
  }
  if ((InnerW==true)&&(InnerD>2*(WallT+Tolerance))) {
	  R=R.union(new CAG.rectangle({corner1: [InnerD/2-Tolerance, 0], corner2: [InnerD/2-Tolerance-WallT, WallH+BottomT]}));
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[InnerD/2-Tolerance,WallH+BottomT-Chamfer], [InnerD/2-Tolerance-Chamfer,WallH+BottomT],[InnerD/2-Tolerance,WallH+BottomT]]));
  }


  R=cap.union(revolveZ(R,72));


  return [
    { name: "Tube_End_Cap", caption: "Tube End Cap", data: R }
   	];
}

function revolveY(Cag, resolution)
	{
		var ResDeg=2*Math.PI/resolution;
		var HalfHeight=Cag.getBounds()[1].x*Math.tan(ResDeg/2);
		var Left=HalfHeight*Math.tan(ResDeg/2);
		var Half=Cag.extrude({offset: [-Left, 0, HalfHeight]});

		var CU=CSG.cube({corner1: [0, Cag.getBounds()[0].y-5, 0],corner2: [Cag.getBounds()[1].x, Cag.getBounds()[1].y+5, 15]}).rotateY(-180/resolution);
	    Half=Half.subtract(CU);
	    var H=new CSG();
	    Half=Half.union(Half.mirroredZ());

	    for(var i=0;i<resolution;i+=2){
		    H=H.unionForNonIntersecting(Half.rotateY(360/resolution*i));
	    }

	    H=H.union(H.rotateY(360/resolution));
	    return H;
}

function revolveZ(Cag, resolution) // not dealing with X=0  go to tubethreadcap.js for the good one
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
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))

                    ]);
					polygons.push(poly);
				}
		}
	    return new CSG.fromPolygons(polygons);
}
