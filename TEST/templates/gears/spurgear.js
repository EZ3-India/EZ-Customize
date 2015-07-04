var ExamplesLinks=[
  'http://3ddoctors.net/templates/gears/spurgear.html?N=24&module=2&diameter=48&pressureangle=20&H1=5&shaftD=5&addcylinder=true&ACdiameter=25&H2=7&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=5.5&T3thick=3&T4diameter=10&T4depth=6&T5diameter=22&T5depth=7&Nspokes=0&spokeWidth=0&spokeAngle=0&spokeFillet=0&selectG=3'
  ,
  'http://3ddoctors.net/templates/gears/spurgear.html?N=24&module=2&diameter=48&pressureangle=20&H1=5&shaftD=8&addcylinder=true&ACdiameter=16&H2=5&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=5.5&T3thick=3&T4diameter=10&T4depth=6&T5diameter=22&T5depth=7&Nspokes=6&spokeWidth=3&spokeAngle=30&spokeFillet=2&selectG=1'
  ,
  'http://3ddoctors.net/templates/gears/spurgear.html?N=24&module=2&diameter=48&pressureangle=20&H1=6&shaftD=8&addcylinder=true&ACdiameter=16&H2=3&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=5.5&T3thick=3&T4diameter=10&T4depth=6&T5diameter=22&T5depth=7&Nspokes=6&spokeWidth=3&spokeAngle=-30&spokeFillet=2&selectG=4'
  ,
  'http://3ddoctors.net/templates/gears/spurgear.html?N=16&module=4&diameter=64&pressureangle=20&H1=8&shaftD=5&addcylinder=false&ACdiameter=16&H2=3&T1width=4&T1d=1&T2diameter=3&T3diameter=3&T3nutdiameter=5.5&T3thick=3&T4diameter=10&T4depth=6&T5diameter=22&T5depth=7&Nspokes=8&spokeWidth=5&spokeAngle=0&spokeFillet=3&selectG=3'
  ]
  
  
function main()
{  
  var Module=Number(document.getElementById('module').value);
  var N=Number(document.getElementById('N').value);
  var PitchDiameter = N*Module;
  var PressureAngle = Number(document.getElementById('pressureangle').value) *Math.PI/180.0;

  var OuterDiameter = PitchDiameter+2*Module;
  var RootDiameter = PitchDiameter-(2*Module*1.25);

  

  var H1 = Number(document.getElementById('H1').value);
  var H2 = Number(document.getElementById('H2').value);
  var shaftD = Number(document.getElementById('shaftD').value);
 
  var addcylinder = document.getElementById('addcylinder').checked;
  var cylinderD = Number(document.getElementById('ACdiameter').value);

  var griptype = document.getElementById('selectG').value; // 0-none 1-shegem 2-grubscrew 3-grubscrew & nut 4-Hex bolt
  
  var T1width = Number(document.getElementById('T1width').value);
  var T1radius = Number(document.getElementById('T1d').value) + shaftD/2;

  var T2diameter = Number(document.getElementById('T2diameter').value);
 
  var T3diameter = Number(document.getElementById('T3diameter').value);
  var T3nutdiameter = Number(document.getElementById('T3nutdiameter').value);
  var T3thick = Number(document.getElementById('T3thick').value);
  
  var T4diameter = Number(document.getElementById('T4diameter').value);
  var T4depth = Number(document.getElementById('T4depth').value);
  
  var T5diameter = Number(document.getElementById('T5diameter').value);
  var T5depth = Number(document.getElementById('T5depth').value);
  
  var Nspokes = Number(document.getElementById('Nspokes').value);
  var spokeAngle = Number(document.getElementById('spokeAngle').value);
  var spokeWidth = Number(document.getElementById('spokeWidth').value);
  var spokeFillet = Number(document.getElementById('spokeFillet').value);
  
  
  
  // creating the 2D shape - start with involute
  var gear=createGear(PitchDiameter,RootDiameter,OuterDiameter,PressureAngle,N,H1);
  //var gear=new CSG();
  // gear is done -> add cyliner
  
  var griptop; 
  var gripbottom;

  
  if (addcylinder) 
	{
	  var cyl = new CAG.circle({center: [0, 0], radius: cylinderD/2}).extrude({offset: [0, 0, H2]}).translate([0,0,H1]);
 	  gear=gear.union(cyl);
	  griptop=H1+H2;
      gripbottom=H1;
      var spokeR=cylinderD/2+Module*0.5; 
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
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop-T4depth],  end: [0, 0, griptop],  radius: T4diameter/1.732050808,resolution: 6}));	
    }
  
  if ((griptype==5)||(griptype==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop-T5depth],  end: [0, 0, griptop],  radius: T5diameter/2,resolution: 32}));	
    } 
  if ((griptype==6)||(griptype==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, 0],  end: [0, 0, T5depth],  radius: T5diameter/2,resolution: 32}));	
    }   
    
  if (shaftD>0) {
	  subt=subt.union(CSG.cylinder({  start: [0, 0, -1],  end: [0, 0, griptop+1],  radius: shaftD/2}));
  }
  
  gear = gear.subtract(subt);
  
  if  ((Nspokes!=0)&&(spokeWidth!=0)) // Reduce Material
  	{
	var Rbig =RootDiameter/2 - 1.125*Module;
	if (Rbig>spokeR) {   // if not there is nothing to subtract
	var subt2 = new CAG.circle({center: [0, 0], radius: Rbig});
	subt2=subt2.subtract(CAG.circle({center: [0, 0], radius: spokeR}));
	
	var l1 = new CAG.rectangle({corner1: [-spokeWidth/2, 0], corner2: [spokeWidth/2, OuterDiameter+spokeR]});
	if ((spokeAngle!=0)&&(spokeAngle>=-90)&&(spokeAngle<=90)) {
		l1=l1.translate([0,-spokeR]).rotateZ(spokeAngle).translate([0,spokeR]);
	}
	
	for(var i1=0;i1<360;i1+=360/Nspokes) 
		{
			subt2= subt2.subtract(l1.rotateZ(i1));
		}
	if (spokeFillet>0) { subt2=subt2.contract(spokeFillet).expand(spokeFillet,32);}
	gear=gear.subtract(subt2.extrude({offset: [0, 0, griptop]}));
	}
	}	
	
	
  var result = gear;
  
 return [
    { name: "Spur_Gear", caption: "Spur Gear", data: result } 
   	];
 
}


function createGear(PitchDiameter,RootDiameter,OuterDiameter,PressureAngle,N,H1) {
  var BaseDiameter = PitchDiameter*Math.cos(PressureAngle);
  var BR = BaseDiameter/2;
  
  var points = [];
  var tp =[0,0];
  points.push(tp);
  for(var t=0;t<=1.3;t+=0.05)
	{
	tp=[BR*(Math.cos(t)+t*Math.sin(t)),BR*(Math.sin(t)-t*Math.cos(t))];
    points.push(tp);
    }
  
  points.push([0, RootDiameter/2, 0]);
  var plusangle=Math.tan(PressureAngle)-PressureAngle;
  
  var involute=new CSG.Polygon2D(points).rotateZ(-((90/N)+plusangle*180/Math.PI));
  var ODcircle= new CAG.circle({center: [0, 0], radius: OuterDiameter/2 ,resolution:72});
  var RDcircle= new CAG.circle({center: [0, 0], radius: RootDiameter/2 ,resolution:72});
  var tmp = new CAG.circle({center: [0, 0], radius: RootDiameter/4 , resolution:32});
  
  involute=involute.intersect(involute.mirroredY()).intersect(ODcircle).subtract(tmp).extrude({offset: [0, 0, H1]});
  var gear = new CSG;
  for(var t=0;t<N;t+=1)
	{
		gear=gear.unionForNonIntersecting(involute.rotateZ((t+0.5)*360/N));
    }
  gear=gear.union(RDcircle.extrude({offset: [0, 0, H1]}));
  return gear;
}