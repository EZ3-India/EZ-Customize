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
  //var TubeD = Number(document.getElementById('TubeD').value);
 
  var baseH=Number(document.getElementById('baseH').value);
  var baseD=Number(document.getElementById('baseD').value);
  var signT=Number(document.getElementById('signT').value);
  var textT=Number(document.getElementById('textT').value);
  var signW=Number(document.getElementById('signW').value);
  var signH=Number(document.getElementById('signH').value);
  var Ledge=Number(document.getElementById('Ledge').value);
  var Lthick=Number(document.getElementById('Lthick').value);
  var Lcon=Number(document.getElementById('Lcon').value);
  var unit=document.getElementById('unit').value;  //Km or mi
  
  
  var dests=[];
  var latO=Number(document.getElementById("lat1").value);
  var lngO=Number(document.getElementById("lng1").value);
  var lat;
  var lng;
  var head;
  var dist;
  
  
   
  for(var i=2;i<=K;i++){
	  lat=Number(document.getElementById("lat"+(i).toString()).value);
	  lng=Number(document.getElementById("lng"+(i).toString()).value);
	  if (((lat!=0)||(lng!=0))&&(document.getElementById("tr"+(i).toString()).style.display!="none")) {
		  dist=google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latO, lngO),new google.maps.LatLng(lat, lng));
		  head=google.maps.geometry.spherical.computeHeading(new google.maps.LatLng(latO, lngO),new google.maps.LatLng(lat, lng));
		  var tmpText = new CSG();
		  tmpText=txtCAG(disttext(dist,unit),signH,1 ,0); 
		  		  
		  dests.push({head: head  , disttxtW: 5.1   , nametxtW: 6.1
		    , disttxt: tmpText
		    , nametxt: txtCAG(document.getElementById("cap"+(i).toString()).value,signH,1 ,0)
		    , part: new CSG()});
		  
      }
  }
  signcount=dests.length;
 
  var columnD=Math.max(Ledge*1.4142+4,signT); //will be calculated
  var baseH2=Math.min(baseH,baseD);
  
  var Base = new CSG.Path2D([[0,baseH],[0,0], [baseD/2,0],[baseD/2,baseH2*0.1]],false);
  Base=Base.appendBezier([[columnD/2,baseH2*0.5],[columnD/2,baseH2]], {resolution: 90});
  if (baseH2!=baseH) { Base=Base.appendPoint([columnD/2,baseH]);}
  Base=Base.close().innerToCAG();
  Base=revolveZ(Base,36);
 
  var L= new CAG.rectangle({center: [0, 0], radius: [Ledge/2, Ledge/2]});
  L=L.subtract(new CAG.rectangle({center: [Lthick, -Lthick], radius: [Ledge/2, Ledge/2]})).rotateZ(-45);
  
  Base=Base.subtract(L.extrude({offset: [0,0,baseH]}).translate([0,0,baseH/4]));
  
  var LH=L.extrude({offset: [0,0,signH]});
  var Llong=L.contract(Lcon).extrude({offset: [0,0,signcount*signH+baseH*0.75]});
  var Sign=new CAG.rectangle({corner1: [0, -signT/2],corner2: [columnD/2+signW, signT/2]});
  
  Sign=Sign.union(new CAG.circle({center: [0, 0], radius: columnD/2, resolution: 36})).extrude({offset: [0,0,signH]});//.subtract(L)
  Sign=Sign.union(new CSG.Path2D([[columnD/2+signW,signH],[columnD/2+signW,0],[columnD/2+signW+signH/3,signH/2]]).close().innerToCAG().extrude({offset: [0,0,signT]}).rotateX(90).translate([0,signT/2,0]));
 
  var COL=new CSG();
  var Alls= new CSG();
  COL=COL.union(Base);
  var curZ=baseH;
  var curY=0;
  COL=COL.union(Llong.translate([0,0,baseH*0.25]).setColor(1,0,0));
  
  // find scale factor
  //var T8 = txtCAG("M",20,1 ,0);
  //T8=-(T8.getBounds()[1].y + T8.getBounds()[0].y)/2;
  //alert(T8);
  var T8m=0.2246/20*signH; //size is 20;
  
  var Scale=99998.8;
  for(i=0;i<signcount;i++){
	  dests[i].disttxt=dests[i].disttxt.translate([-(dests[i].disttxt.getBounds()[1].x + dests[i].disttxt.getBounds()[0].x)/2 ,-T8m,0])
	  dests[i].disttxtW=(dests[i].disttxt.getBounds()[1].x -dests[i].disttxt.getBounds()[0].x);
	  
	  dests[i].nametxt=dests[i].nametxt.translate([-(dests[i].nametxt.getBounds()[1].x + dests[i].nametxt.getBounds()[0].x)/2 ,-T8m,0])
	  dests[i].nametxtW=(dests[i].nametxt.getBounds()[1].x -dests[i].nametxt.getBounds()[0].x);
	 
	  Scale=Math.min(Scale,signW/(dests[i].disttxtW+dests[i].nametxtW+signH*1.5),(signH/2-1)/dests[i].nametxt.getBounds()[1].y,(signH/2-1)/dests[i].disttxt.getBounds()[1].y);
  }
 
  for(i=0;i<signcount;i++){
	  dests[i].disttxt=dests[i].disttxt.scale([Scale,Scale]);
	  dests[i].nametxt=dests[i].nametxt.scale([Scale,Scale]);
	  dests[i].disttxtW=dests[i].disttxtW*Scale;
	  dests[i].nametxtW=dests[i].nametxtW*Scale;
  }
  
  var ang=0;
  
  for(i=0;i<signcount;i++){
	  dests[i].part=Sign; 
	  // add text .setColor(1, 0.925, 0.7)
	  dests[i].nametxt=dests[i].nametxt.extrude({offset: [0,0,textT]}).translate([0,signH/2,signT/2]).rotateX(90);
	  dests[i].nametxt=dests[i].nametxt.unionForNonIntersecting(dests[i].nametxt.rotateZ(180)).translate([columnD/2+signH/4+dests[i].nametxtW/2,0,0]); 
	  
	  dests[i].disttxt=dests[i].disttxt.extrude({offset: [0,0,textT]}).translate([0,signH/2,signT/2]).rotateX(90);
	  dests[i].disttxt=dests[i].disttxt.unionForNonIntersecting(dests[i].disttxt.rotateZ(180)).translate([columnD/2+signW-dests[i].disttxtW/2,0,0]); 
	 
	  dests[i].part=dests[i].part.subtract(LH.rotateZ(-90+dests[i].head));
	  dests[i].part=dests[i].part.unionForNonIntersecting(dests[i].disttxt.unionForNonIntersecting(dests[i].nametxt).setColor(0.8, 0.8, 0.8)); //text added
	  dests[i].part=dests[i].part; 
	  COL=COL.unionForNonIntersecting((dests[i].part.rotateZ(90-dests[i].head)).translate([0,0,curZ]));
	  
	  //Alls=Alls.unionForNonIntersecting(dests[i].part.translate([-columnD/2-signW/2-signH/6-2,0,0]).rotateZ(ang).translate([0,curY,0]));
	  ang=180-ang;
	  curY+=Math.max(signT+textT*2+2,columnD/2+1);
	  curZ+=signH;
  }
	  
  var EE=[];
  EE.push({ name: "Assembled", caption: "Assembled", data: COL });
  //EE.push({ name: "Base", caption: "Base", data: Base });
  //for(i=0;i<signcount;i++){
//	  EE.push({ name: "Sign"+(i+1).toString(), caption: "Sign"+(i+1).toString(), data: dests[i].part });
//  }
//  EE.push({ name: "Lbar", caption: "L Bar", data: Llong.rotateZ(45).translate([Ledge/2-Lcon,0,-(signcount*signH+baseH*0.75)/2]).rotateY(-90).setColor(1,0,0) } );
  return [{ name: "Assembled", caption: "Assembled", data: Llong }]; //EE;
}

function disttext(dist,unit){  //dist in meters
    if (unit=="Km") {
	    if (dist<960) {
		    return (Math.round(dist)).toString()+"m";
		} 
		else if (dist<=9649) {
			return (Math.round(dist*0.01)*0.1).toString()+"Km";
		} 
	    else {
		    return (Math.round(dist*0.001)).toString()+"Km";
	    }
    }
    else { //Imperial
    	dist=dist/0.3048;
    	if (dist <=1200) {
	    	return (Math.round(dist)).toString()+" ft";
    	}
	    if (dist <=1920) {
	    	return "1/4 mile";
    	}
	    if (dist <=3300) {
	    	return "1/2 mile";
    	}
	    if (dist <=4620) {
	    	return "3/4 mile";
    	}
	    else {
		   	return (Math.round(dist/5280)).toString()+" mi"
   		}
	}
	return "";
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