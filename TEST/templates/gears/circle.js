function main()
{  
  var Module=Number(document.getElementById('module').value);
  var PressureAngle = (Number(document.getElementById('pressureangle').value) )*Math.PI/180.0;
  var I = Number(document.getElementById('I').value);
  
  
  var N1=Number(document.getElementById('N1').value);
  var PD1 = N1*Module;
  var N2=Number(document.getElementById('N2').value);
  var PD2 = N2*Module;
  var N3=Number(document.getElementById('N3').value);
  var PD3 = N3*Module;
  
  var H1 = Number(document.getElementById('H1').value);
    
  // creating the 2D shape - start with involute
 
  
  
  
  var sun=new CAG.circle({center: [0, 0], radius: PD1/2 ,resolution:72});
  var ring=new CAG.circle({center: [0, 0], radius: PD3/2 ,resolution:72}).subtract(sun);
  
  var Thick=1;
  
  var sunR=PD1/2-Thick/2;
  var ringR=PD3/2+Thick/2;
  
  var redR=(ringR-sunR)/2;
  var red=new CAG.circle({center: [sunR+redR, 0], radius: redR-Thick/2 ,resolution:36});
  
  
  
  var alpha=Math.asin(redR/(redR+sunR));
  
  var RN=Math.PI/alpha;
  RN=Math.floor(RN);
   
  alpha=Math.PI/RN;
  
  var OrangeL= (-Math.pow(sunR +redR,2)+Math.pow(redR+ringR,2))/( -2*Math.cos(alpha)*(sunR +redR) +  2*(redR+ringR));

  var OrangeR=ringR-OrangeL;
  var orange=new CAG.circle({center: [OrangeL*Math.cos(alpha), OrangeL*Math.sin(alpha)], radius: OrangeR-Thick/2 ,resolution:36});
  var sub1=new CAG();
  
  red=red.union(orange);
  
  for(i=0;i<RN;i++){
	  sub1=sub1.union(red.rotateZ(360/RN*i));
}
 ring=ring.subtract(sub1);
  return ring;
  
  
  var result = new CSG();
  for(var k=0;k<I;k++)
    {
    result=result.unionForNonIntersecting(planet.rotateZ(k*360/I*N1/N2).translate([PD1/2+PD2/2,0,0]).rotateZ(k*360/I));
    }  
  
  var ringGear=Gear(PD3,N3,PressureAngle,H1,true);
  if (N2%2==0) ringGear=ringGear.rotateZ(180/N3);
  var ring=new CAG.circle({center: [0, 0], radius: ( PD3+4*Module)/2 ,resolution:72}).extrude({offset: [0,0,H1]}).subtract(ringGear).setColor(0.8,0.2,0.4);
  
  
  result = result.union(sun).union(ring);
  
 return [
    { name: "Spur_Gear", caption: "Spur Gear", data: result } 
   	];
 
}

function Gear(PitchDiameter,N,PressureAngle,H1,Internal=false){
  var Module=PitchDiameter/N;
  if (Internal==false) {
     var OuterDiameter = PitchDiameter+2*Module;
     var RootDiameter = PitchDiameter-(2*Module*1.25);
  }
  else{
	 var OuterDiameter = PitchDiameter+2*Module*1.25;
     var RootDiameter = PitchDiameter-(1.5*Module);
  }

  
  var BaseDiameter = PitchDiameter*Math.cos(PressureAngle);
  var BR = BaseDiameter/2;

  var points = [];
  var tp =[0,0];
  
  points.push(tp);

  for(t=0.0;t<=1.3;t+=0.05)
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
  
  
  involute=involute.intersect(involute.mirroredY()).intersect(ODcircle).subtract(tmp);
  var gear = new CAG;
 
  for(t=0;t<N;t+=1)
	{
		gear=gear.union(involute.rotateZ(t*360/N));
    }
 
  gear=gear.union(RDcircle).rotateZ(180/N).extrude({offset: [0, 0, H1] }); //twistangle: 5 ,  twiststeps: H1
  
  return gear;
}