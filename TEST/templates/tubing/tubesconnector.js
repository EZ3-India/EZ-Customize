var ExamplesLinks=[
  'http://3ddoctors.net/templates/tubing/tubesconnector.html?Dist=20&ConeT=2&Equal=false&OuterD=48&OuterD2=32&InnerD=44&InnerD2=28&OuterW=true&InnerW=true&OuterW2=true&InnerW2=true&WallH=10&WallH2=10&WallT=2&WallT2=2&Chamfer=1&Chamfer2=1&Tolerance=0.3&Tolerance2=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubesconnector.html?Dist=10&ConeT=2&Equal=true&OuterD=32&OuterD2=22&InnerD=28&InnerD2=18&OuterW=true&InnerW=true&OuterW2=true&InnerW2=true&WallH=10&WallH2=10&WallT=2&WallT2=2&Chamfer=1&Chamfer2=1&Tolerance=0.3&Tolerance2=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubesconnector.html?Dist=20&ConeT=2&Equal=false&OuterD=48&OuterD2=32&InnerD=44&InnerD2=28&OuterW=true&InnerW=true&OuterW2=true&InnerW2=false&WallH=15&WallH2=10&WallT=2&WallT2=2&Chamfer=1&Chamfer2=1&Tolerance=0.3&Tolerance2=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubesconnector.html?Dist=20&ConeT=2&Equal=false&OuterD=48&OuterD2=11&InnerD=44&InnerD2=9&OuterW=true&InnerW=true&OuterW2=false&InnerW2=true&WallH=10&WallH2=4&WallT=2&WallT2=2&Chamfer=1&Chamfer2=1&Tolerance=0.3&Tolerance2=0.3'
  ]
  
function main()
{  
  var OuterD = Number(document.getElementById('OuterD').value);
  var InnerD = Number(document.getElementById('InnerD').value);
  var WallH = Number(document.getElementById('WallH').value);
  var WallT = Number(document.getElementById('WallT').value);
  var Chamfer = Number(document.getElementById('Chamfer').value);
  var Tolerance = Number(document.getElementById('Tolerance').value);
  var InnerW = document.getElementById('InnerW').checked;
  var OuterW = document.getElementById('OuterW').checked;
  Chamfer=Math.min(Chamfer,WallH-0.1,WallT-0.1);
  
  
  
  var Equal = document.getElementById('Equal').checked;
  if (Equal==true) {
	  var OuterD2 = OuterD;
  	  var InnerD2 = InnerD;
      var WallH2 = WallH;
      var WallT2 = WallT;
      var Chamfer2 = Chamfer;
      var Tolerance2 = Tolerance;
      var InnerW2 = InnerW;
      var OuterW2 = OuterW;
  }
  else {
	var OuterD2 = Number(document.getElementById('OuterD2').value);
    var InnerD2 = Number(document.getElementById('InnerD2').value);
    var WallH2 = Number(document.getElementById('WallH2').value);
    var WallT2 = Number(document.getElementById('WallT2').value);
    var Chamfer2 = Number(document.getElementById('Chamfer2').value);
    var Tolerance2 = Number(document.getElementById('Tolerance2').value);
    var InnerW2 = document.getElementById('InnerW2').checked;
    var OuterW2 = document.getElementById('OuterW2').checked;
    Chamfer2=Math.min(Chamfer2,WallH2-0.1,WallT2-0.1);
  } 
    
  var Dist = Number(document.getElementById('Dist').value);
  var ConeT = Number(document.getElementById('ConeT').value);
  
  var R=new CAG();
  if (OuterW==true) {
	  R=R.union(new CAG.rectangle({corner1: [OuterD/2+Tolerance+WallT, 0], corner2: [OuterD/2+Tolerance, WallH]}));
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[OuterD/2+Tolerance,Chamfer], [OuterD/2+Tolerance+Chamfer,0],[OuterD/2+Tolerance,0]]));
  }
  if ((InnerW==true)&&(InnerD>2*(WallT+Tolerance))) {
	  R=R.union(new CAG.rectangle({corner1: [InnerD/2-Tolerance, 0], corner2: [InnerD/2-Tolerance-WallT, WallH]}));
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[InnerD/2-Tolerance,Chamfer], [InnerD/2-Tolerance-Chamfer,0],[InnerD/2-Tolerance,0]]));
  }
    
  if (OuterW2==true) {
	  R=R.union(new CAG.rectangle({corner1: [OuterD2/2+Tolerance2+WallT2, Dist+WallH], corner2: [OuterD2/2+Tolerance2, WallH2+Dist+WallH]}));
	  if (Chamfer2>0) R=R.subtract(new CAG.fromPoints([[OuterD2/2+Tolerance2,WallH2-Chamfer2+Dist+WallH], [OuterD2/2+Tolerance2+Chamfer2,WallH2+Dist+WallH],[OuterD2/2+Tolerance2,WallH2+Dist+WallH]]));
  }
  if ((InnerW2==true)&&(InnerD2>2*(WallT2+Tolerance2))) {
	  R=R.union(new CAG.rectangle({corner1: [InnerD2/2-Tolerance2, Dist+WallH], corner2: [InnerD2/2-Tolerance2-WallT2, WallH2+Dist+WallH]}));
	  if (Chamfer2>0) R=R.subtract(new CAG.fromPoints([[InnerD2/2-Tolerance2,WallH2-Chamfer2+Dist+WallH], [InnerD2/2-Tolerance2-Chamfer2,WallH2+Dist+WallH],[InnerD2/2-Tolerance2,WallH2+Dist+WallH]]));
  }
  
  var points = [];
  var percent=0.05;
  var level=Dist*percent;
  if (OuterW==true) points.push([OuterD/2+Tolerance+WallT,WallH]); else points.push([OuterD/2,WallH]); //0
  if (OuterW==true) points.push([OuterD/2+Tolerance+WallT,WallH+Dist*percent]); else points.push([OuterD/2,WallH+Dist*percent]); //1
  
  var K=percent*2;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K+ConeT/2,WallH+Dist*K]); //2
  K=percent*3;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K+ConeT/2,WallH+Dist*K]); //3
  K=1-percent*3;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K+ConeT/2,WallH+Dist*K]); //4
  K=1-percent*2;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K+ConeT/2,WallH+Dist*K]); //5
  
  K=1-percent;
  if (OuterW2==true) points.push([OuterD2/2+Tolerance2+WallT2,WallH+Dist*K]); else points.push([OuterD2/2,WallH+Dist*K]); //6
  if (OuterW2==true) points.push([OuterD2/2+Tolerance2+WallT2,WallH+Dist]); else points.push([OuterD2/2,WallH+Dist]); //7
  if (InnerW2==true) points.push([InnerD2/2-Tolerance2-WallT2,WallH+Dist]); else points.push([InnerD2/2,WallH+Dist]); //8
  if (InnerW2==true) points.push([InnerD2/2-Tolerance2-WallT2,WallH+Dist*K]); else points.push([InnerD2/2,WallH+Dist*K]); //9
  
  K=1-percent*2;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K-ConeT/2,WallH+Dist*K]); //10
  K=1-percent*3;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K-ConeT/2,WallH+Dist*K]); //11
  K=percent*3;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K-ConeT/2,WallH+Dist*K]); //12
  K=percent*2;
  points.push([(OuterD+InnerD)/4*(1-K)+(OuterD2+InnerD2)/4*K-ConeT/2,WallH+Dist*K]); //13
  
  if (InnerW==true) points.push([InnerD/2-Tolerance-WallT,WallH+Dist*percent]); else points.push([InnerD/2,WallH+Dist*percent]); //14
  if (InnerW==true) points.push([InnerD/2-Tolerance-WallT,WallH]); else points.push([InnerD/2,WallH]); //15
  
  var path = new CSG.Path2D([points[0]]);
  path = path.appendBezier([points[1], points[2], points[3]],{resolution: 36});
  path = path.appendPoint(points[4]);
  path = path.appendBezier([points[5], points[6], points[7]],{resolution: 36});
  path = path.appendPoint(points[8]);
  path = path.appendBezier([points[9], points[10], points[11]],{resolution: 36});
  path = path.appendPoint(points[12]);
  path = path.appendBezier([points[13], points[14], points[15]],{resolution: 36});
  path = path.close(); 

  R=R.union(path.innerToCAG());
    
  R=revolveZ(R,60);
  return [
    { name: "Tube_End_Cap", caption: "Tube End Cap", data: R } 
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