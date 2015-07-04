var ExamplesLinks=[
  'http://3ddoctors.net/templates/tubing/tubethreadcap.html?OuterD=32&InnerD=28&BottomT=2&HeadT=10&OuterW=true&InnerW=true&WallH=15&WallT=1.5&Chamfer=1&Tolerance=0.3&Pitch=4&Rounds=2.5&ThreadWall=1.5&Extra=0&ThreadTolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubethreadcap.html?OuterD=32&InnerD=28&BottomT=2&HeadT=5&OuterW=true&InnerW=true&WallH=15&WallT=1.5&Chamfer=1&Tolerance=0.3&Pitch=2&Rounds=5&ThreadWall=1.5&Extra=0&ThreadTolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubethreadcap.html?OuterD=32&InnerD=28&BottomT=2&HeadT=20&OuterW=true&InnerW=true&WallH=15&WallT=1.5&Chamfer=1&Tolerance=0.3&Pitch=4&Rounds=2.5&ThreadWall=1.5&Extra=4&ThreadTolerance=0.3'
  ,
  'http://3ddoctors.net/templates/tubing/tubethreadcap.html?OuterD=42&InnerD=38&BottomT=2&HeadT=20&OuterW=true&InnerW=true&WallH=15&WallT=2&Chamfer=1&Tolerance=0.3&Pitch=8&Rounds=2.5&ThreadWall=1.5&Extra=4&ThreadTolerance=0.3'
  ]
  
function main()
{  
	//var ff="x^2";
	//var fff="return ("+ff+");";
    //var f = new Function('x', fff);

   // alert(f(3));
 


  var OuterD = Number(document.getElementById('OuterD').value);
  var InnerD = Number(document.getElementById('InnerD').value);
  var BottomT = Number(document.getElementById('BottomT').value);
  var HeadT = Number(document.getElementById('HeadT').value);
  var WallH = Number(document.getElementById('WallH').value);
  var WallT = Number(document.getElementById('WallT').value);
  var Chamfer = Number(document.getElementById('Chamfer').value);
  var Tolerance = Number(document.getElementById('Tolerance').value);
 
  var InnerW = document.getElementById('InnerW').checked;
  var OuterW = document.getElementById('OuterW').checked;
    
  Chamfer=Math.min(Chamfer,WallH-0.1,WallT-0.1);
  
  var Pitch = Number(document.getElementById('Pitch').value);
  var Rounds = Number(document.getElementById('Rounds').value);
  var ThreadWall = Number(document.getElementById('ThreadWall').value);
  var Extra = Number(document.getElementById('Extra').value);
  var ThreadTolerance = Number(document.getElementById('ThreadTolerance').value);
  
  var RESO = 40;
  
  if (BottomT==0) BottomT=0.2;
  if (HeadT==0) BottomT=1;
  //var cap = CSG.cylinder({start: [0, 0, WallH],end: [0, 0, BottomT+WallH], radius: OuterD/2,  resolution: RESO  });
  //var cap2 = CSG.cylinder({start: [0, 0, WallH],end: [0, 0, BottomT+WallH], radius: OuterD/2,  resolution: RESO  });
  var CapOuter=OuterD/2;
  
  var R=new CAG.rectangle({corner1: [InnerD/2, 0], corner2: [OuterD/2, BottomT]});
  
  
  var ThreadInWall=InnerD/2;
  if (OuterW==true) {
	  CapOuter=OuterD/2+Tolerance+WallT;
	  R=R.union(new CAG.rectangle({corner1: [CapOuter, 0], corner2: [OuterD/2+Tolerance, WallH+BottomT]}));
	  if ((Tolerance>0)&&(BottomT>0)) R=R.union(new CAG.rectangle({corner1: [InnerD/2, 0], corner2: [OuterD/2+Tolerance+WallT, BottomT]}));
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[OuterD/2+Tolerance,WallH+BottomT-Chamfer], [OuterD/2+Tolerance+Chamfer,WallH+BottomT],[OuterD/2+Tolerance,WallH+BottomT]]));
  }
  if ((InnerW==true)&&(InnerD>2*(WallT+Tolerance))) {
	  R=R.union(new CAG.rectangle({corner1: [InnerD/2-Tolerance, 0], corner2: [InnerD/2-Tolerance-WallT, WallH+BottomT]}));
	  if (Tolerance>0) R=R.union(new CAG.rectangle({corner1: [InnerD/2-Tolerance-WallT, 0], corner2: [OuterD/2, BottomT]}));
	  ThreadInWall=InnerD/2-Tolerance-WallT;
	  if (Chamfer>0) R=R.subtract(new CAG.fromPoints([[InnerD/2-Tolerance,WallH+BottomT-Chamfer], [InnerD/2-Tolerance-Chamfer,WallH+BottomT],[InnerD/2-Tolerance,WallH+BottomT]]));
  }
  else {R=R.union(new CAG.rectangle({corner1: [InnerD/2,0], corner2: [OuterD/2, 0+BottomT]})); cap=new CSG(); }
  
  R=R.mirroredY().translate([0,WallH+BottomT]);
  var RO=new CAG.rectangle({corner1: [0, WallH+BottomT-HeadT], corner2: [CapOuter, WallH+BottomT]});
  
  //outer thread part
  var ThreadOutWall=ThreadInWall+Pitch/4+ThreadTolerance+ThreadWall*2;
  var RO=RO.union(new CAG.rectangle({corner1: [ThreadInWall+Pitch/4+ThreadTolerance+ThreadWall, WallH+BottomT], corner2: [ThreadOutWall, WallH+BottomT+Pitch*(Rounds)+Extra]}));
  //inner thread part
  R=R.union(new CAG.rectangle({corner1: [ThreadInWall, WallH+BottomT], corner2: [ThreadInWall+ThreadWall, WallH+BottomT+Pitch*(Rounds)+Extra]}));
  
  var MM=ThreadInWall+2*ThreadWall+ThreadTolerance+Pitch;
  
  //inner thread part
  var THR=CAG.fromPoints([[ThreadInWall+ThreadWall,WallH+BottomT+Pitch/4], [ThreadInWall+ThreadWall+Pitch/4,WallH+BottomT+Pitch/2], [ThreadInWall+ThreadWall+Pitch/4,WallH+BottomT+Pitch*0.75], [ThreadInWall+ThreadWall,WallH+BottomT+Pitch]]);
  var Thread=threadZ(THR,RESO,Pitch,360*(Rounds+0.75)).translate([0,0,-Pitch]).subtract( 
  	CSG.cube({corner1: [-MM, -MM, 0],corner2: [MM, MM, WallH+BottomT]}).union(CSG.cube({corner1: [-MM, -MM, WallH+BottomT+Pitch*Rounds],corner2: [MM, MM, WallH+BottomT+Pitch*(Rounds+2)]}))
    );
    
  R=revolveZ(R,RESO).union(Thread);
  
  //outer thread part
  var THR=CAG.fromPoints([[ThreadInWall+ThreadWall+ThreadTolerance+Pitch/4,WallH+BottomT+Pitch/4], [ThreadInWall+ThreadWall+ThreadTolerance+Pitch/4,WallH+BottomT+Pitch], [ThreadInWall+ThreadWall+ThreadTolerance,WallH+BottomT+Pitch*0.75], [ThreadInWall+ThreadWall+ThreadTolerance,WallH+BottomT+Pitch/2]]);
  Thread=threadZ(THR,RESO,Pitch,360*(Rounds+0.75)).translate([0,0,-Pitch]).subtract(
  	CSG.cube({corner1: [-MM, -MM, 0],corner2: [MM, MM, WallH+BottomT]}).union(CSG.cube({corner1: [-MM, -MM, WallH+BottomT+Pitch*Rounds],corner2: [MM, MM, WallH+BottomT+Pitch*(Rounds+2)]}))
    );
  
    
  if ((ThreadOutWall<CapOuter)&&(Pitch*(Rounds)+Extra>(CapOuter-ThreadOutWall))) {  
    RO=RO.union(CAG.fromPoints([[CapOuter,WallH+BottomT],[ThreadOutWall,WallH+BottomT],[ThreadOutWall,WallH+BottomT+CapOuter-ThreadOutWall]]));
	}

  RO=revolveZs(RO,RESO,CapOuter,Math.max(ThreadOutWall,CapOuter-2),WallH+BottomT).union(Thread).translate([0,0,-(WallH+BottomT-HeadT)]);
  MM=RO.getBounds()[1].x+2;
  
  
  
  return [
    { name: "Tube_Threaded_Connector", caption: "Tube Threaded Connector", data: R.translate([MM,0,0]).union(RO.translate([-MM,0,0]))},  
    { name: "Tube_Connector_Part1", caption: "Part #1", data: R},  
    { name: "Tube_Connector_Part2", caption: "Part #2", data: RO }  
   	];
}

function threadZ(Cag, resolution,pitch, degrees)
	{
		
		var DegStep=360/resolution;
		var DegStepR=2*Math.PI/resolution;
	    var lines = [];
	    Cag.sides.map(function(side) {lines.push([side.vertex0.pos.x,side.vertex0.pos.y,side.vertex1.pos.x,side.vertex1.pos.y]);});
	    var cx=0;
	    var cy=0;
	    var Zstep=pitch/resolution;
		var CurZ=0;
	    var polygons = [];
	    var DegR=0;
	    
	     //beginning
	    var vert = [];
	    for(var i=0;i<lines.length;i++) {
	       vert.push(new CSG.Vertex(new CSG.Vector3D(lines[i][0],0,lines[i][1])));
			}
		var poly2 = new CSG.Polygon(vert);
		polygons.push(poly2);
		
		//going up
	    for(var Deg=0;Deg<degrees;Deg+=DegStep)
			{
				DegR=Deg*Math.PI/180;
				for(var i=0;i<lines.length;i++) {
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1]+CurZ+Zstep)),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3]+CurZ+Zstep)),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3]+CurZ)),
                    //new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]+CurZ))
                    
                    ]);                
					polygons.push(poly);	
					
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1]+CurZ+Zstep)),
					//new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3]+CurZ+Zstep)),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3]+CurZ)),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]+CurZ))
                    
                    ]);                
					polygons.push(poly);
								
				}
			CurZ+=Zstep;		
		}    
	
		//end
		var vert = [];
	    for(var i=lines.length-1;i>=0;i--) {
	       vert.push(new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1]+CurZ)));
				}
		var poly2 = new CSG.Polygon(vert);
		polygons.push(poly2);
		
		
	    return new CSG.fromPolygons(polygons).canonicalized();
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

function xfunc(x,deg,xout,xin) {
	if (x==xout) {
	     var k=(Math.sin(deg*8)+1)*4;
	     
	     if (k>1) k=1;
	     if (k<0) k=0;
	     if (xout>xin) {return (xin+(xout-xin)*k); } else {return xout;} //(xout-(xout-xin)*k); }
	     return (xin+(xout-xin)*k);
	}
	else return x;
}


function revolveZs(Cag, resolution,Xout,Xin,Yup)
	{
		
		var DegStep=360/resolution;
		var DegStepR=2*Math.PI/resolution;
	    var lines = [];
	    Cag.sides.map(function(side) {lines.push([side.vertex0.pos.x,side.vertex0.pos.y,side.vertex1.pos.x,side.vertex1.pos.y]);});
	    var x1=0;
	    var x2=0;
	    
	    var polygons = [];
	    var DegR=0;
	    for(var Deg=0;Deg<360;Deg+=DegStep)
			{
				DegR=Deg*Math.PI/180;
				for(var i=0;i<lines.length;i++) {
		          if ((lines[i][0]!=0)&&(lines[i][2]!=0)) {
			          
			        if (((lines[i][0]==Xout)&&( lines[i][1]<=Yup))||((lines[i][2]==Xout)&&(lines[i][3]<=Yup))) {
				       x1=lines[i][0];
				       x2=lines[i][2];
				    
				    if (xfunc(Xout,DegR+DegStepR,Xout,Xin) <  xfunc(Xout,DegR,Xout,Xin)) {		            
				       var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x2,DegR,Xout,Xin)*Math.sin(DegR),lines[i][3]))]); 
                    //new CSG.Vertex(new CSG.Vector3D(x1*Math.cos(DegR),x1*Math.sin(DegR),lines[i][1]))
                    polygons.push(poly);		
                    
                    var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][1])),
					//new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x2,DegR,Xout,Xin)*Math.sin(DegR),lines[i][3])), 
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x1,DegR,Xout,Xin)*Math.sin(DegR),lines[i][1]))]);  
                    
                    polygons.push(poly);
        		      }
        		      else {		            
				       var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x1,DegR,Xout,Xin)*Math.sin(DegR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x2,DegR,Xout,Xin)*Math.sin(DegR),lines[i][3]))]); 
                    //new CSG.Vertex(new CSG.Vector3D(x1*Math.cos(DegR),x1*Math.sin(DegR),lines[i][1]))
                    polygons.push(poly);		
                    
                    var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x1,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][1])),
					//new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])), 
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x1,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x1,DegR,Xout,Xin)*Math.sin(DegR),lines[i][1]))]);  
                    
                    polygons.push(poly);
        		      }
        		      
                    } 
				    else {
					var poly = new CSG.Polygon([
					new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))
                    
                    ]); 
                    polygons.push(poly);		 
                    }              
							
				  }		
				  else if (lines[i][2]!=0) {
					  
					if ((lines[i][2]==Xout)&&(lines[i][3]<=Yup)) {
				       x2=lines[i][2];
				           
					var poly = new CSG.Polygon([
					//new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.cos(DegR+DegStepR),xfunc(x2,DegR+DegStepR,Xout,Xin)*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(xfunc(x2,DegR,Xout,Xin)*Math.cos(DegR),xfunc(x2,DegR,Xout,Xin)*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))
                    
                    ]);                
					polygons.push(poly);
				}
				else {
					var poly = new CSG.Polygon([
					//new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR+DegStepR),lines[i][0]*Math.sin(DegR+DegStepR),lines[i][1])),
					new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR+DegStepR),lines[i][2]*Math.sin(DegR+DegStepR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][2]*Math.cos(DegR),lines[i][2]*Math.sin(DegR),lines[i][3])),
                    new CSG.Vertex(new CSG.Vector3D(lines[i][0]*Math.cos(DegR),lines[i][0]*Math.sin(DegR),lines[i][1]))
                    
                    ]);                
					polygons.push(poly);				
				  }
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
