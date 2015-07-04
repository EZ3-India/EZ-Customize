var ExamplesLinks=[
  'http://3ddoctors.net/templates/connectors/shaftplain.html?shaftD=5&H1=4&BaseD=80&N=4&holed=3&radius=36&addcylinder=true&ACdiameter=22&H2=10&addribs=true&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=6&T3thick=3&T4diameter=10&T4depth=6&Nspokes=6&spokeWidth=4&spokeAngle=30&spokeFillet=3&selectG=3'
  ,
  'http://3ddoctors.net/templates/connectors/shaftplain.html?shaftD=5&H1=8&BaseD=80&N=8&holed=3&radius=36&addcylinder=false&ACdiameter=22&H2=10&addribs=true&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=6&T3thick=3&T4diameter=10&T4depth=6&Nspokes=8&spokeWidth=4&spokeAngle=0&spokeFillet=3&selectG=3'
  ,
  'http://3ddoctors.net/templates/connectors/shaftplain.html?shaftD=5&H1=4&BaseD=36&N=6&holed=3&radius=15&addcylinder=true&ACdiameter=22&H2=10&addribs=false&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=6&T3thick=3&T4diameter=10&T4depth=6&Nspokes=0&spokeWidth=4&spokeAngle=0&spokeFillet=3&selectG=3'
  ,
  'http://3ddoctors.net/templates/connectors/shaftplain.html?shaftD=5&H1=4&BaseD=80&N=4&holed=3&radius=36&addcylinder=true&ACdiameter=12&H2=30&addribs=true&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=6&T3thick=3&T4diameter=10&T4depth=6&Nspokes=7&spokeWidth=4&spokeAngle=0&spokeFillet=3&selectG=2'
  ]
  
function main()
{  

  var N=Number(document.getElementById('N').value);
  var PitchDiameter = Number(document.getElementById('radius').value)*2;
  var holed = Number(document.getElementById('holed').value);
  
  var OuterDiameter = Number(document.getElementById('BaseD').value);
  var RootDiameter = PitchDiameter-(2*holed);

  var H1 = Number(document.getElementById('H1').value);
  var H2 = Number(document.getElementById('H2').value);
  var shaftD = Number(document.getElementById('shaftD').value);
 
  var addcylinder = document.getElementById('addcylinder').checked;
  var cylinderD = Number(document.getElementById('ACdiameter').value);
  var addribs = document.getElementById('addribs').checked;
  if (addcylinder == false) { addribs = false;}
  
  var griptype = document.getElementById('selectG').value; // 0-none 1-shegem 2-grubscrew 3-grubscrew & nut 4-Hex bolt
  
  var T1width = Number(document.getElementById('T1width').value);
  var T1radius = Number(document.getElementById('T1d').value) + shaftD/2;

  var T2diameter = Number(document.getElementById('T2diameter').value);
 
  var T3diameter = Number(document.getElementById('T3diameter').value);
  var T3nutdiameter = Number(document.getElementById('T3nutdiameter').value);
  var T3thick = Number(document.getElementById('T3thick').value);
  
  var T4diameter = Number(document.getElementById('T4diameter').value);
  var T4depth = Number(document.getElementById('T4depth').value);

  var Nspokes = Number(document.getElementById('Nspokes').value);
  var spokeAngle = Number(document.getElementById('spokeAngle').value);
  var spokeWidth = Number(document.getElementById('spokeWidth').value);
  var spokeFillet = Number(document.getElementById('spokeFillet').value);
  
  
  var ODcircle= new CAG.circle({center: [0, 0], radius: OuterDiameter/2 });

  var gear = new CAG;

  gear=gear.union(ODcircle);
  var hole= new CAG.circle({center: [0, 0], radius: holed/2});
  for(var t=180/N;t<360+180/N;t+=360/N) {
	gear=gear.subtract(hole.translate([PitchDiameter/2,0,0]).rotateZ(t));
  }

  gear=gear.extrude({offset: [0, 0, H1]});

  // gear is done -> add cyliner
  
  var griptop; 
  var gripbottom;

  if (addcylinder) 
	{
	  var cyl = new CAG.circle({center: [0, 0], radius: cylinderD/2}).extrude({offset: [0, 0, H2]}).translate([0,0,H1]);
 	  gear=gear.union(cyl);
	  griptop=H1+H2;
      gripbottom=H1;
      var spokeR=cylinderD/2+spokeWidth/2;//+Module*0.5; 
    }
  else  
  	{ 
	  griptop=H1; 
	  gripbottom=0;
	  var spokeR=shaftD/2*3; 
	}
  
  var subt = new CSG();
  
  if (griptype==1)
	{
	subt = subt.union(CSG.cube({corner1: [-T1width/2, 0, -1],corner2: [T1width/2, T1radius, griptop+1] }));	
    }
  
  if (griptype==2)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop+gripbottom)/2],  end: [OuterDiameter, 0, (griptop+gripbottom)/2],  radius: T2diameter/2 }));	
    }
    
  if (griptype==3)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop+gripbottom)/2],  end: [OuterDiameter,0, (griptop+gripbottom)/2],  radius: T3diameter/2 }));	
	var nutloc;
	if (addcylinder) 
		{
			nutloc=(shaftD+ cylinderD) /4; 
			if (nutloc-T3thick/2-shaftD/2 > 5 ) { nutloc= 5+T3thick/2+shaftD/2;}
		} 
	else 
		{
			nutloc=(shaftD+ RootDiameter)/4 ; 
			if (nutloc-T3thick/2-shaftD/2 > 4 ) { nutloc= 4+T3thick/2+shaftD/2; spokeR=shaftD/2+4+T3thick+4; }
		}
		
	
	
	subt = subt.union(CSG.cylinder({ start: [nutloc-T3thick/2, 0, 0],  end: [nutloc+T3thick/2, 0, 0],  radius: T3nutdiameter/1.732050808 ,resolution: 6 }).rotateX(30).translate([0,0,(griptop+gripbottom)/2]));	
	subt = subt.union(CSG.cube({corner1: [nutloc-T3thick/2, -T3nutdiameter/2, (griptop+gripbottom)/2],corner2: [nutloc+T3thick/2,T3nutdiameter/2, griptop+1] }));	
    }
    
  if (griptype==4)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop-T4depth],  end: [0, 0, griptop],  radius: T4diameter/ 1.732050808,resolution: 6}));	
    }
    
    
  if (shaftD>0) {
	  subt=subt.union(CSG.cylinder({  start: [0, 0, -1],  end: [0, 0, griptop+1],  radius: shaftD/2}));
  }
  
  var Rbig =PitchDiameter - OuterDiameter/2; 
  
  if  ((Nspokes!=0)&&(spokeWidth!=0)) // Reduce Material
  	{
	
	if (Rbig>spokeR) {   // if not there is nothing to subtract
	var subt2 = new CAG.circle({center: [0, 0], radius: Rbig});
	subt2=subt2.subtract(CAG.circle({center: [0, 0], radius: spokeR}));
	
	var l1 = new CAG.rectangle({corner1: [-spokeWidth/2, 0], corner2: [spokeWidth/2, OuterDiameter+spokeR]});
	if ((spokeAngle!=0)&&(spokeAngle>=-90)&&(spokeAngle<=90)) {
		l1=l1.translate([0,-spokeR]).rotateZ(spokeAngle).translate([0,spokeR]);
	}
	
	for(var i1=-90+180/Nspokes;i1<360-90+180/Nspokes;i1+=360/Nspokes) 
		{
			subt2= subt2.subtract(l1.rotateZ(i1));
		}
	if (spokeFillet>0) { subt2=subt2.contract(spokeFillet).expand(spokeFillet,32);}
	gear=gear.subtract(subt2.extrude({offset: [0, 0, griptop]}));
	}
	}	
	
  // add ribs
  if (addribs == true) {
	if  ((Nspokes==0)||(spokeWidth==0)) { // no spokes
		Nspokes=N;  
		spokeAngle=0;
		while ((Nspokes>9)&&(Nspokes % 2 == 0)) {Nspokes=Nspokes/2;}
	    while ((Nspokes>9)&&(Nspokes % 3 == 0)) {Nspokes=Nspokes/3;}
		while ((Nspokes>9)&&(Nspokes % 5 == 0)) {Nspokes=Nspokes/5;}
		while ((Nspokes>9)&&(Nspokes % 7 == 0)) {Nspokes=Nspokes/7;}
		if (Nspokes<4) {Nspokes=6;}
	}
		
		
  	var ribpath=new CSG.Path2D([[0,H1+H2],[0,H1],[cylinderD/2,H1],[Rbig,H1]],false);
  	ribpath=ribpath.appendBezier([[cylinderD/2*5/6+Rbig/6,H1+H2*1/6], [cylinderD/2,H1+H2]]);
  	ribpath=ribpath.close();
	  
  	var ribs = ribpath.innerToCAG().extrude({offset: [0, 0, spokeWidth/2]}).translate([0,0,-spokeWidth/4]).rotateX(90);
  	ribs=ribs.translate([-spokeR,0,0]).rotateZ(spokeAngle).translate([spokeR,0,0]);
	  
  	for(var i1=180/Nspokes;i1<360+180/Nspokes;i1+=360/Nspokes) 
			{
				gear= gear.union(ribs.rotateZ(i1));
			}	
	}
 
  
  gear = gear.subtract(subt);
  
  
 return [
    { name: "shaft_plane_connector", caption: "Shaft-Plane Connector", data: gear } 
   	];
 
}