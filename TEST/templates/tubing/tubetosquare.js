var ExamplesLinks=[
  'http://3ddoctors.net/templates/tubing/tubetosquare.html?Dist=20&ConeT=2&OuterD2=32&InnerD2=28&OuterD=42&InnerTD=2&OuterW2=true&InnerW2=true&OuterW=true&InnerW=true&WallH2=10&WallH=10&WallT2=2&WallT=2&Chamfer2=1&Chamfer=1&Tolerance2=0.3&Tolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubetosquare.html?Dist=30&ConeT=2&OuterD2=11&InnerD2=9&OuterD=42&InnerTD=1&OuterW2=false&InnerW2=true&OuterW=true&InnerW=true&WallH2=5&WallH=5&WallT2=2&WallT=2&Chamfer2=1&Chamfer=1&Tolerance2=0.3&Tolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubetosquare.html?Dist=40&ConeT=2&OuterD2=32&InnerD2=28&OuterD=42&InnerTD=2&OuterW2=true&InnerW2=true&OuterW=true&InnerW=false&WallH2=10&WallH=10&WallT2=2&WallT=2&Chamfer2=1&Chamfer=1&Tolerance2=0.3&Tolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubetosquare.html?Dist=10&ConeT=2&OuterD2=22&InnerD2=18&OuterD=32&InnerTD=1&OuterW2=true&InnerW2=true&OuterW=false&InnerW=true&WallH2=5&WallH=10&WallT2=2&WallT=2&Chamfer2=1&Chamfer=1&Tolerance2=0.3&Tolerance=0.3'
  ]
  
function main()
{  
  var OuterD = Number(document.getElementById('OuterD').value);
  var InnerTD = Number(document.getElementById('InnerTD').value);
  var InnerD= OuterD-2*InnerTD;
  var WallH = Number(document.getElementById('WallH').value);
  var WallT = Number(document.getElementById('WallT').value);
  var Chamfer = Number(document.getElementById('Chamfer').value);
  var Tolerance = Number(document.getElementById('Tolerance').value);
  var InnerW = document.getElementById('InnerW').checked;
  var OuterW = document.getElementById('OuterW').checked;
  Chamfer=Math.min(Chamfer,WallH-0.1,WallT-0.1);
  
  
  
  
 
  
	var OuterD2 = Number(document.getElementById('OuterD2').value);
    var InnerD2 = Number(document.getElementById('InnerD2').value);
    var WallH2 = Number(document.getElementById('WallH2').value);
    var WallT2 = Number(document.getElementById('WallT2').value);
    var Chamfer2 = Number(document.getElementById('Chamfer2').value);
    var Tolerance2 = Number(document.getElementById('Tolerance2').value);
    var InnerW2 = document.getElementById('InnerW2').checked;
    var OuterW2 = document.getElementById('OuterW2').checked;
    Chamfer2=Math.min(Chamfer2,WallH2-0.1,WallT2-0.1);
   
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
  var percent=0.10; // do not reach 0.5/3 
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
    
  R=revolveZtoSquare(R,72,WallH+Dist,WallH);
  return [
    { name: "Tube_End_Cap", caption: "Tube End Cap", data: R } 
   	];
}

function revolveZtoSquare(Cag, resolution,Zcircle,Zsquare)
	{
		var DegStep=360/resolution;
		var DegStepR=2*Math.PI/resolution;
	    var lines = [];
	    Cag.sides.map(function(side) {lines.push([side.vertex0.pos.x,side.vertex0.pos.y,side.vertex1.pos.x,side.vertex1.pos.y]);});
	    var x1=0;
	    var y1=0;
	    var x2=0;
	    var y2=0;
	    var cos1=0;
	    var cos2=0;
	    var sin1=0;
	    var sin2=0;
	    var p1=0;
	    var p2=0;
	    
	    var polygons = [];
	    var DegR=0;
	    var DegR2=0;
	    var DegC=0;
	    var DegC2=0;
	    for(var Deg=0;Deg<360;Deg+=DegStep)
			{
				DegR=(Deg+45)%90-45;
				DegR2=(Deg+DegStep+45)%90-45;
				
				
				
				DegR*=Math.PI/180;
				DegR2*=Math.PI/180;
				DegC=Deg*Math.PI/180;
				DegC2=(Deg+DegStep)*Math.PI/180;
				
				for(var i=0;i<lines.length;i++) {
					x1=lines[i][0];
					y1=lines[i][1];
					x2=lines[i][2];
					y2=lines[i][3];
					
					cos1=1;
					cos2=1;
					sin1=Math.sin(DegR)/Math.cos(DegR);
					sin2=Math.sin(DegR+DegStepR)/Math.cos(DegR+DegStepR);
					
					if ((Deg>=45)&&(Deg+DegStep<=135)) { DegR2=cos1; cos1=-sin1; sin1=DegR2;  DegR2=cos2; cos2=-sin2; sin2=DegR2; }
					else if ((Deg>=135)&&(Deg+DegStep<=225)) { cos1=-cos1; sin1=-sin1; cos2=-cos2; sin2=-sin2;}
					else if ((Deg>=225)&&(Deg+DegStep<=315)) { DegR2=cos1; cos1=sin1; sin1=-DegR2;  DegR2=cos2; cos2=sin2; sin2=-DegR2; }
					
					if (y1>=Zcircle) {p1=1;}
					else if (y1>Zsquare) {	p1=(y1-Zsquare)/(Zcircle-Zsquare);}
					else {p1=0;}
					if (y2>=Zcircle) {p2=1;}
					else if (y2>Zsquare) {p2=(y2-Zsquare)/(Zcircle-Zsquare);}
					else {p2=0;}
						
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(x1*(p1*Math.cos(DegC2)+(1-p1)*cos2),x1*(p1*Math.sin(DegC2)+(1-p1)*sin2),y1)),
					new CSG.Vertex(new CSG.Vector3D(x2*(p2*Math.cos(DegC2)+(1-p2)*cos2),x2*(p2*Math.sin(DegC2)+(1-p2)*sin2),y2)),
                    new CSG.Vertex(new CSG.Vector3D(x2*(p2*Math.cos(DegC)+(1-p2)*cos1),x2*(p2*Math.sin(DegC)+(1-p2)*sin1),y2)),
                    new CSG.Vertex(new CSG.Vector3D(x1*(p1*Math.cos(DegC)+(1-p1)*cos1),x1*(p1*Math.sin(DegC)+(1-p1)*sin1),y1))
                    
                    ]);                
					polygons.push(poly);				
				}		
		}    
	    return new CSG.fromPolygons(polygons);
}