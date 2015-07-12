var ExamplesLinks=[
  '.html?OuterD=22&InnerD=8&H=7&T=0.5&P=0.2&M=1&fW=0&fH=0'
  ,
  'aa?OuterD=30&InnerD=10&H=8&T=0.5&P=0.2&M=1&fW=3&fH=1.5'
  ,
  '?OuterD=75&InnerD=50&H=10&T=0.5&P=0.2&M=1&fW=0&fH=0'
  ,
  '?OuterD=40&InnerD=5&H=10&T=0.5&P=0.2&M=1&fW=2&fH=1'
  ]
  
function main()
{  
  var OuterD =Number(document.getElementById('OuterD').value);
  var InnerD =Number(document.getElementById('InnerD').value);
  var t=Number(document.getElementById('T').value);
  var p=Number(document.getElementById('P').value);
  var H=Number(document.getElementById('H').value);
  var m=Number(document.getElementById('M').value);
  var fH=Number(document.getElementById('fH').value);
  var fW=Number(document.getElementById('fW').value);
  
  if (m<=0) {m=1;}
  
  var K=(OuterD-InnerD)/4;
  var a=0
  var a2=0;
  var i=0;
  while (a<m) {
	  i++;
	  var H4=H/(1+2*(i));
      a=(K-t-H4)/2;
  	  a2=(K-t-H4)/2;
      var DA=H4/3+(t-p);
      a+=DA/2;
      a2-=DA/2;
      if (i==10) {alert('Something wrong with the parameters, make it bigger'); gProcessor.abort();};
      
  }
    
  var CYL = new CSG.Path2D([[0,0], [0,H],[a+H4/2,H],[a,H-H4/2]],false);
  for(j=0;j<i;j++){
	  CYL=appendB(CYL,a,H-H4/2-j*2*H4,a+H4,H-1.5*H4-j*2*H4,a,H-2.5*H4-j*2*H4,H4/3);
  }
  CYL=CYL.appendPoint([a+H4/2,0]);
  CYL=CYL.close().innerToCAG();
  var CYLR=CYL.getBounds()[1].x;

  
  var OUT = new CSG.Path2D([[K,0], [K,H],[K-a2-H4/2,H],[K-a2-H4,H-H4/2]],false);
  for(j=0;j<i;j++){
	  OUT=appendB(OUT,K-a2-H4,H-H4/2-j*2*H4,K-a2-(t-p),H-1.5*H4-j*2*H4,K-a2-H4,H-2.5*H4-j*2*H4,H4/3);
  }
  OUT=OUT.appendPoint([K-a2-H4/2,0]);
  OUT=OUT.close().innerToCAG();
  
  //return OUT.union(CYL);
  
  
  OUT=OUT.union(OUT.mirroredX()).translate([(OuterD+InnerD)/4,0]);
  if((fH>0)&&(fW>0)) {
	  OUT=OUT.union(new CAG.rectangle({corner1: [OuterD/2,0], corner2: [OuterD/2+fW,fH]}));
  }
  
  
  OUT=revolveZ(OUT,60);
  
  CYL=revolveZ(CYL,36).translate([(OuterD+InnerD)/4,0]);
  var A=new CSG();
  
  var VA=2*Math.atan((CYLR+t/2)/((InnerD+OuterD)/4))*180/Math.PI;
  var PD=(InnerD+OuterD)/2*Math.PI;
  i=Math.floor(360/VA);
  
  //i=Math.floor(PD/(2*CYLR+t));
  for(j=0;j<360;j+=360/i){
	  A=A.unionForNonIntersecting(CYL.rotateZ(j));
  }
  
  OUT=OUT.unionForNonIntersecting(A);
  
  //OUT=OUT.subtract(new CSG.cube({corner1: [-100, 0, 0],corner2: [100, -50, 30]}));
  
  
  return [
    { name: "Tube_Connector_Part2", caption: "Part #2", data: OUT }  
   	];
}

function appendB(pat, x1,y1,x2,y2,x3,y3,dx){
	var p1=dx/Math.abs(x2-x1);
	
	//var p2=poin;
	//var p1=1-poin;
	var p2=1-p1;
	
	var x4=x1*p1+x2*p2;
	var y4=y1*p1+y2*p2;
	var x5=x3*p1+x2*p2;
	var y5=y3*p1+y2*p2;
	
	//pat=pat.appendPoint([x4,y4]);
	//pat=pat.appendBezier([[x2,y2],[x5,y5]]);
	//pat=pat.appendPoint([x3,y3]);
	
	pat=pat.appendBezier([[x4,y4],[(x4+x5)/2,y2]]);
	pat=pat.appendBezier([[x5,y5],[x3,y3]]);
    return pat;
}

function revolveZ(Cag, resolution) // the good one, deal with lines on the axis
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


