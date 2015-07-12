var ExamplesLinks=[
  ''
  ,
  ''
  ,
  ''
  ,
  ''
  ]
  
function main()
{  
 
  var N=Number(document.getElementById('N').value);
  var space=Number(document.getElementById('space').value);
  
  var baseW = Number(document.getElementById('baseW').value);
  var baseT = Number(document.getElementById('baseT').value);
  var baseChamfer = Number(document.getElementById('baseChamfer').value);
  
  var grooveDeep = Number(document.getElementById('grooveDeep').value);
  var grooveW =Number(document.getElementById('grooveW').value);
  var pegT = Number(document.getElementById('pegT').value);

  var headH = Number(document.getElementById('headH').value);
  
  var headE = Number(document.getElementById('headE').value);
  var pegH = Number(document.getElementById('pegH').value);
   
  var PEG = new CAG.circle({center: [0, 0], radius: pegT+grooveW/2});
  PEG=PEG.subtract(new CAG.circle({center: [0, 0], radius: grooveW/2}));
  PEG=PEG.subtract(new CAG.rectangle({corner1: [-grooveW/2, 0], corner2: [grooveW/2, -grooveDeep]}));
  PEG=PEG.subtract(new CAG.rectangle({corner1: [-grooveW/2-pegT, 0], corner2: [grooveW/2+pegT, -grooveDeep]}));
  
  PEG=PEG.union(new CAG.rectangle({corner1: [grooveW/2, 0], corner2: [grooveW/2+pegT, -grooveDeep/2]}));
  PEG=PEG.union(new CAG.circle({center: [(grooveW+pegT)/2, -grooveDeep/2], radius: pegT/2}));
  PEG=PEG.union(new CAG.rectangle({corner1: [-grooveW/2, 0], corner2: [-grooveW/2-pegT, -grooveDeep/2]}));
  PEG=PEG.union(new CAG.circle({center: [(-grooveW-pegT)/2, -grooveDeep/2], radius: pegT/2}));
  
  var Head = new CAG.circle({center: [0, 0], radius: pegT+grooveW/2});
  Head=Head.subtract(new CAG.rectangle({corner1: [-grooveW/2-pegT, 0], corner2: [grooveW/2+pegT, -pegT-grooveW/2]})); 
  Head=Head.union(new CAG.rectangle({corner1: [grooveW/2, 0], corner2: [grooveW/2+pegT, -grooveDeep/2]}));
  Head=Head.union(new CAG.rectangle({corner1: [-grooveW/2-pegT/2, 0], corner2: [grooveW/2+pegT/2, -grooveDeep/2-pegT/2]}));
  
  Head=Head.union(new CAG.circle({center: [(grooveW+pegT)/2, -grooveDeep/2], radius: pegT/2}));
  Head=Head.union(new CAG.rectangle({corner1: [-grooveW/2, 0], corner2: [-grooveW/2-pegT, -grooveDeep/2]}));
  Head=Head.union(new CAG.circle({center: [(-grooveW-pegT)/2, -grooveDeep/2], radius: pegT/2}));
       
  PEG=PEG.extrude({offset: [0,0,pegH+baseT]});
  //PEG=PEG.union(Head.extrude({offset: [0,0,-headH-headE]}).translate([0,0,pegH+baseT]));
  
  var SX=(grooveW+pegT*2+2*headE)/(grooveW+pegT*2);
  var SY=(grooveDeep+pegT+2*headE)/(grooveDeep+pegT);
  
  PEG=PEG.union(Head.extrude({offset: [0,0,headE] , scale: [SX,SY]}).translate([0,0,baseT+pegH-headH-headE]));
  PEG=PEG.union(Head.scale([SX,SY]).extrude({offset: [0,0,headH]}).translate([0,0,baseT+pegH-headH]));
  
  PEG=PEG.translate([-(PEG.getBounds()[1].y + PEG.getBounds()[0].y)/2 ,0,0]);
  
  var LOOM = new CSG();
  
  
  //ROUND
  
	  var R=space/2/Math.sin(Math.PI/N);
	  PEG=PEG.translate([0,-R,0]);
	  for(var i=0; i<360;i+=360/N) {
		  LOOM=LOOM.unionForNonIntersecting(PEG.rotateZ(i));
      }
      
      var Base=new CAG.rectangle({corner1: [R-baseW/2, 0], corner2: [R+baseW/2,baseT]});
      if (baseChamfer>0) {
	      Base=Base.subtract(new CAG.circle({center: [R-baseW/2, baseT], radius: baseChamfer , resolution: 4}));
          Base=Base.subtract(new CAG.circle({center: [R+baseW/2, baseT], radius: baseChamfer , resolution: 4}));
      }
      
      Base=revolveZ(Base,72);
      
      LOOM=LOOM.union(Base); 
 
  

return [
    { name: "Knitting_Loom", caption: "Knitting Loom", data: LOOM } 
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