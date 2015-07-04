var ExamplesLinks=[
  'http://www.3ddoctors.net/templates/connectors/spacer.html?ID=3.5&OD=10&height=8&ITC=1&IBC=0.5&OTC=0&OBC=0.5'
  ,
  'http://www.3ddoctors.net/templates/connectors/spacer.html?ID=8&OD=22&height=7&ITC=1&IBC=1&OTC=1&OBC=1'
  ,
  'http://www.3ddoctors.net/templates/connectors/spacer.html?ID=4&OD=24&height=2&ITC=1&IBC=0&OTC=1&OBC=0'
  ,
  'http://www.3ddoctors.net/templates/connectors/spacer.html?ID=20&OD=24&height=5&ITC=0.5&IBC=0.5&OTC=0.5&OBC=0.5'
  ]
  
function main()
{  
  var ID=Number(document.getElementById('ID').value);
  var OD=Number(document.getElementById('OD').value);
  
  var ITC=Number(document.getElementById('ITC').value);
  var OTC=Number(document.getElementById('OTC').value);
  var IBC=Number(document.getElementById('IBC').value);
  var OBC=Number(document.getElementById('OBC').value);
 
  var H=Number(document.getElementById('height').value);
  
  var points = []
  
  var B=new CAG.rectangle({corner1: [ID/2,0], corner2: [OD/2,H]});
  if(IBC>0) B=B.subtract(new CAG.circle({center: [ID/2, 0], radius: IBC, resolution: 4}));
  if(ITC>0) B=B.subtract(new CAG.circle({center: [ID/2, H], radius: ITC, resolution: 4}));
  if(OBC>0) B=B.subtract(new CAG.circle({center: [OD/2, 0], radius: OBC, resolution: 4}));
  if(OTC>0) B=B.subtract(new CAG.circle({center: [OD/2, H], radius: OTC, resolution: 4}));
  
  B=revolveZ(B,72);
  
 return [
    { name: "Spacer", caption: "Spacer", data: B } 
   	];
 
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
