
  function main()
{
  topFaces();
  var PressureAngle = 20*Math.PI/180;

  var Z_A=Number(document.getElementById('Z_A').value);
  var Z_B=Number(document.getElementById('Z_B').value);
  var d_A=Number(document.getElementById('d_A').value);
  var d_B=Number(document.getElementById('d_B').value);
  var minB_A=Number(document.getElementById('minB_A').value);
  var minB_B=Number(document.getElementById('minB_B').value);
  var Shaft_A = Number(document.getElementById('Shaft_A').value);
  var Shaft_B = Number(document.getElementById('Shaft_B').value);

  var alpha_A=Math.atan(Z_A/Z_B);
  var alpha_B=Math.atan(Z_B/Z_A);
  var tmp=Math.pow(Z_A*Z_A+Z_B*Z_B,0.5);
  var sin_A=Z_A/tmp;
  var sin_B=Z_B/tmp;
  var cos_A=sin_B;
  var cos_B=sin_A;
  var x=2;
  var RESO_A = RESOL(Z_A);
  var RESO_B = RESOL(Z_B);
  //finding the minimal R that fit
  var R_A=(d_A-minB_A)/(cos_A+x/Z_A*sin_A*sin_A*2);
  var R_B=(d_B-minB_B)/(cos_B+x/Z_B*sin_B*sin_B*2);
  var R=Math.min(R_A,R_B);
  // not using R_A and R_B anymore

  var H1_A=R*cos_A;  // from origin to the big pitch diameter
  var H1_B=R*cos_B;
  var PD_A=R*sin_A*2;
  var PD_B=R*sin_B*2;
  var H2_A=x*PD_A/Z_A*sin_A;  //from pitch diameter to base
  var H2_B=x*PD_B/Z_B*sin_B;
  var Base_A=d_A-H1_A-H2_A;
  var Base_B=d_B-H1_B-H2_B;

  var Module_A = PD_A/Z_A;
  var Module_B = PD_B/Z_B;
    // teeth are intersected with shape_A and subtracted by shape2_A
//   	    3
//	   	  /   \
//  1----2     \
//  		    \4
//  		    /
//  		   /
//            |5
//  7_________|6

  var P1_A=[Shaft_A/2,(Base_A+H2_A-Module_A*x*sin_A)*2/3+d_A/3];
  var P2_A=[(PD_A/2-Module_A*x*cos_A)*2/3,(Base_A+H2_A-Module_A*x*sin_A)*2/3+d_A/3];
  var P3_A=[(PD_A/2+Module_A*4*cos_A)*2/3,(Base_A+H2_A+Module_A*4*sin_A)*2/3+d_A/3];
  var P4_A=[PD_A/2+Module_A*4*cos_A,Base_A+H2_A+Module_A*4*sin_A];
  var P5_A=[PD_A/2-Module_A*x*cos_A,Base_A];
  var P6_A=[PD_A/2-Module_A*x*cos_A,0];
  var P7_A=[Shaft_A/2,0];
  if (Base_A>0.000001) var shape_A = CAG.fromPoints([P1_A,P2_A,P3_A,P4_A,P5_A,P6_A,P7_A]);
  else var shape_A = CAG.fromPoints([P1_A,P2_A,P3_A,P4_A,P6_A,P7_A]);

  var dd=(P2_A[1]-Math.floor(P2_A[1]))*cos_A/sin_A;
  P1_A=[Shaft_A/2,Math.floor(P2_A[1])];
  P2_A=[(PD_A/2-Module_A*x*cos_A)*2/3-dd,P1_A[1]];
  P3_A=[(PD_A/2-Module_A*1.25*cos_A)*2/3,(Base_A+H2_A-Module_A*1.25*sin_A)*2/3+d_A/3];
  P4_A=[PD_A/2-Module_A*1.25*cos_A,Base_A+H2_A-Module_A*1.25*sin_A];
  if (Base_A>0.000001) var shape2_A = CAG.fromPoints([P1_A,P2_A,P3_A,P4_A,P5_A,P6_A,P7_A]);
  else var shape2_A = CAG.fromPoints([P1_A,P2_A,P3_A,P4_A,P6_A,P7_A]);
  shape2_A=revolveZ(shape2_A,RESO_A);

  var P1_B=[Shaft_B/2,                          (Base_B+H2_B-Module_B*x*sin_B)*2/3+d_B/3];
  var P2_B=[(PD_B/2-Module_B*x*cos_B)*2/3,(Base_B+H2_B-Module_B*x*sin_B)*2/3+d_B/3];
  var P3_B=[(PD_B/2+Module_B*4*cos_B)*2/3,(Base_B+H2_B+Module_B*4*sin_B)*2/3+d_B/3];
  var P4_B=[PD_B/2+Module_B*4*cos_B,Base_B+H2_B+Module_B*4*sin_B];
  var P5_B=[PD_B/2-Module_B*x*cos_B,Base_B];
  var P6_B=[PD_B/2-Module_B*x*cos_B,0];
  var P7_B=[Shaft_B/2,0];
  if (Base_B>0.000001) var shape_B = CAG.fromPoints([P1_B,P2_B,P3_B,P4_B,P5_B,P6_B,P7_B]);
  else var shape_B = CAG.fromPoints([P1_B,P2_B,P3_B,P4_B,P6_B,P7_B]);

  var dd=(P2_B[1]-Math.floor(P2_B[1]))*cos_B/sin_B;
  P1_B=[Shaft_B/2,Math.floor(P2_B[1])];
  P2_B=[(PD_B/2-Module_B*x*cos_B)*2/3-dd,P1_B[1]];
  var P3_B=[(PD_B/2-Module_B*1.25*cos_B)*2/3,(Base_B+H2_B-Module_B*1.25*sin_B)*2/3+d_B/3];
  var P4_B=[PD_B/2-Module_B*1.25*cos_B,Base_B+H2_B-Module_B*1.25*sin_B];
  if (Base_B>0.000001) var shape2_B = CAG.fromPoints([P1_B,P2_B,P3_B,P4_B,P5_B,P6_B,P7_B]);
  else var shape2_B = CAG.fromPoints([P1_B,P2_B,P3_B,P4_B,P6_B,P7_B]);
  shape2_B=revolveZ(shape2_B,RESO_B);

  var gear_A=createGear(shape_A,PD_A*2,PressureAngle,Z_A,H1_A*1.75,0.125,H2_A+Base_A-H1_A,cos_A,RESO_A).union(shape2_A);
  var gear_B=createGear(shape_B,PD_B*2,PressureAngle,Z_B,H1_B*1.75,0.125,H2_B+Base_B-H1_B,cos_B,RESO_B).union(shape2_B);


  /////////////////////////
  var gripbottom=0;

  var griptype_A = document.getElementById('selectG_A').value; // 0-none 1-shegem 2-grubscrew 3-grubscrew & nut 4-Hex bolt
  var T1width_A = Number(document.getElementById('T1width_A').value);
  var T1radius_A = Number(document.getElementById('T1d_A').value) + Shaft_A/2;
  var T2diameter_A = Number(document.getElementById('T2diameter_A').value);
  var T3diameter_A = Number(document.getElementById('T3diameter_A').value);
  var T3nutdiameter_A = Number(document.getElementById('T3nutdiameter_A').value);
  var T3thick_A = Number(document.getElementById('T3thick_A').value);
  var T4diameter_A = Number(document.getElementById('T4diameter_A').value);
  var T4depth_A = Number(document.getElementById('T4depth_A').value);
  var T5diameter_A = Number(document.getElementById('T5diameter_A').value);
  var T5depth_A = Number(document.getElementById('T5depth_A').value);
  var griptop_A=P2_A[1];

  var subt = new CSG();
  if (griptype_A==1)
	{
	subt = subt.union(CSG.cube({corner1: [-T1width_A/2, 0, -1],corner2: [T1width_A/2, T1radius_A, griptop_A+1] }));
    }
  if (griptype_A==2)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop_A+gripbottom)/2],  end: [PD_A/2+Module_A*4, 0, (griptop_A+gripbottom)/2],  radius: T2diameter_A/2 }));
    }
  if (griptype_A==3)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop_A+gripbottom)/2],  end: [PD_A/2+Module_A*4,0, (griptop_A+gripbottom)/2],  radius: T3diameter_A/2 }));
	var nutloc=(Shaft_A+ P2_A[0]*2)/4 ;
	if (nutloc-T3thick_A/2-Shaft_A/2 > 1.5*T3thick_A ) { nutloc= 1.5*T3thick_A+T3thick_A/2+Shaft_A/2; }
	subt = subt.union(CSG.cylinder({ start: [nutloc-T3thick_A/2, 0, 0],  end: [nutloc+T3thick_A/2, 0, 0],  radius: T3nutdiameter_A/1.732050808 ,resolution: 6 }).rotateX(30).translate([0,0,(griptop_A+gripbottom)/2]));
	subt = subt.union(CSG.cube({corner1: [nutloc-T3thick_A/2, -T3nutdiameter_A/2, (griptop_A+gripbottom)/2],corner2: [nutloc+T3thick_A/2,T3nutdiameter_A/2, griptop_A+1] }));
    }
  if (griptype_A==4)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop_A-T4depth_A],  end: [0, 0, griptop_A],  radius: T4diameter_A/1.732050808,resolution: 6}));
    }
  if ((griptype_A==5)||(griptype_A==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop_A-T5depth_A],  end: [0, 0, griptop_A],  radius: T5diameter_A/2,resolution: 32}));
    }
  if ((griptype_A==6)||(griptype_A==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, 0],  end: [0, 0, T5depth_A],  radius: T5diameter_A/2,resolution: 32}));
    }
  if (griptype_A>0) gear_A = gear_A.subtract(subt);

  var griptype_B = document.getElementById('selectG_B').value; // 0-none 1-shegem 2-grubscrew 3-grubscrew & nut 4-Hex bolt
  var T1width_B = Number(document.getElementById('T1width_B').value);
  var T1radius_B = Number(document.getElementById('T1d_B').value) + Shaft_B/2;
  var T2diameter_B = Number(document.getElementById('T2diameter_B').value);
  var T3diameter_B = Number(document.getElementById('T3diameter_B').value);
  var T3nutdiameter_B = Number(document.getElementById('T3nutdiameter_B').value);
  var T3thick_B = Number(document.getElementById('T3thick_B').value);
  var T4diameter_B = Number(document.getElementById('T4diameter_B').value);
  var T4depth_B = Number(document.getElementById('T4depth_B').value);
  var T5diameter_B = Number(document.getElementById('T5diameter_B').value);
  var T5depth_B = Number(document.getElementById('T5depth_B').value);
  var griptop_B=P2_B[1];

  var subt = new CSG();
  if (griptype_B==1)
	{
	subt = subt.union(CSG.cube({corner1: [-T1width_B/2, 0, -1],corner2: [T1width_B/2, T1radius_B, griptop_B+1] }));
    }
  if (griptype_B==2)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop_B+gripbottom)/2],  end: [PD_B/2+Module_B*4, 0, (griptop_B+gripbottom)/2],  radius: T2diameter_B/2 }));
    }
  if (griptype_B==3)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, (griptop_B+gripbottom)/2],  end: [PD_B/2+Module_B*4,0, (griptop_B+gripbottom)/2],  radius: T3diameter_B/2 }));
	var nutloc=(Shaft_B+ P2_B[0]*2)/4 ;
	if (nutloc-T3thick_B/2-Shaft_B/2 > 1.5*T3thick_B ) { nutloc= 1.5*T3thick_B+T3thick_B/2+Shaft_B/2; }
	subt = subt.union(CSG.cylinder({ start: [nutloc-T3thick_B/2, 0, 0],  end: [nutloc+T3thick_B/2, 0, 0],  radius: T3nutdiameter_B/1.732050808 ,resolution: 6 }).rotateX(30).translate([0,0,(griptop_B+gripbottom)/2]));
	subt = subt.union(CSG.cube({corner1: [nutloc-T3thick_B/2, -T3nutdiameter_B/2, (griptop_B+gripbottom)/2],corner2: [nutloc+T3thick_B/2,T3nutdiameter_B/2, griptop_B+1] }));
    }
  if (griptype_B==4)
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop_B-T4depth_B],  end: [0, 0, griptop_B],  radius: T4diameter_B/1.732050808,resolution: 6}));
    }
  if ((griptype_B==5)||(griptype_B==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, griptop_B-T5depth_B],  end: [0, 0, griptop_B],  radius: T5diameter_B/2,resolution: 32}));
    }
  if ((griptype_B==6)||(griptype_B==7))
	{
	subt = subt.union(CSG.cylinder({ start: [0, 0, 0],  end: [0, 0, T5depth_B],  radius: T5diameter_B/2,resolution: 32}));
    }
  if (griptype_B>0) gear_B = gear_B.subtract(subt);

  //var result = gear;


    var gears=gear_A.union(gear_B.translate([0,0,-d_B]).rotateZ(180+180/Z_B).rotateY(-90).translate([0,0,d_A]).setColor(1,0.45,0.4));//.setColor(0.7,0.6,1));

 return [
    { name: "Bevel_Gears_Pair", caption: "Illustration", data: gears.rotateZ(90) } ,
    { name: "Bevel_Gears_A", caption: "Gear A", data: gear_A } ,
    { name: "Bevel_Gears_B", caption: "Gear B", data: gear_B.setColor(1,0.45,0.4) }
   	];

}


function createGear(cag_r,PitchDiameter,PressureAngle,N,H1,Sca,lowering,coss,RESO) {
  var reduc = revolveZ(cag_r,RESO);
  //return reduc;

  var Module = PitchDiameter/N;
  var OuterDiameter = PitchDiameter+2*Module/coss;
  var RootDiameter = PitchDiameter-(2*Module*1.25)/coss;
  var BaseDiameter = PitchDiameter*Math.cos(PressureAngle);
  var BR = BaseDiameter/2;

  var points = [];
  var tp =[0,0];
  points.push(tp);
  for(var t=0;t<=1.3;t+=0.05)
	{
	var xx=BR*(Math.cos(t)+t*Math.sin(t));
	var yy=BR*(Math.sin(t)-t*Math.cos(t));
	var RR=Math.pow(xx*xx+yy*yy,0.5);
	var SS=((RR-PitchDiameter/2)/coss+PitchDiameter/2)/RR;

	tp=[xx*SS,yy*SS];
    points.push(tp);
    }

  points.push([0, RootDiameter/2, 0]);
  var plusangle=Math.tan(PressureAngle)-PressureAngle;
  var involute=new CSG.Polygon2D(points).rotateZ(-((90/N)+plusangle*180/Math.PI));
  var ODcircle= new CAG.circle({center: [0, 0], radius: OuterDiameter/2 ,resolution:72});
  var RDcircle= new CAG.circle({center: [0, 0], radius: RootDiameter/2,resolution:72});
  var tmp = new CAG.circle({center: [0, 0], radius: PitchDiameter/2 , resolution:32});

  involute=involute.intersect(involute.mirroredY()).intersect(ODcircle).subtract(RDcircle).extrude({offset: [0, 0, H1], scale: [Sca,Sca]}).translate([0,0,lowering])
  involute=involute.intersect(reduc);

  var gear = new CSG;
  for(var t=0;t<N;t+=1)
	{
		gear=gear.unionForNonIntersecting(involute.rotateZ((t+0.5)*360/N));
    }
  gear=gear;//.union(RDcircle.extrude({offset: [0, 0, H1]}));
  return gear;
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


function RESOL(z) {

	if (z<8) return 60;
	if (z==9) return 54;
	if (z==11) return 66;
	if (z==13) return 78;
	if ((z>=8)&&(z<=20)) return z*4;
	if (z==30) return 60;
	if (z==40) return 80;
	if (z==45) return 60;
	if (z==25) return 75;
	if (z==24) return 72;
	return 72;
}



function topFaces() {

  var Z_A=Number(document.getElementById('Z_A').value);
  var Z_B=Number(document.getElementById('Z_B').value);
  var d_A=Number(document.getElementById('d_A').value);
  var d_B=Number(document.getElementById('d_B').value);
  var minB_A=Number(document.getElementById('minB_A').value);
  var minB_B=Number(document.getElementById('minB_B').value);

  if ((Z_A==0)||(Z_B==0)||(d_A==0)||(d_B==0)) return 0;

  var alpha_A=Math.atan(Z_A/Z_B);
  var alpha_B=Math.atan(Z_B/Z_A);
  var tmp=Math.pow(Z_A*Z_A+Z_B*Z_B,0.5);
  var sin_A=Z_A/tmp;
  var sin_B=Z_B/tmp;
  var cos_A=sin_B;
  var cos_B=sin_A;
  var x=2;

  //finding the minimal R that fit
  var R_A=(d_A-minB_A)/(cos_A+x/Z_A*sin_A*sin_A*2);
  var R_B=(d_B-minB_B)/(cos_B+x/Z_B*sin_B*sin_B*2);
  var R=Math.min(R_A,R_B);
  // not using R_A and R_B anymore

  var H1_A=R*cos_A;  // from origin to the big pitch diameter
  var H1_B=R*cos_B;
  var PD_A=R*sin_A*2;
  var PD_B=R*sin_B*2;
  var H2_A=x*PD_A/Z_A*sin_A;  //from pitch diameter to base
  var H2_B=x*PD_B/Z_B*sin_B;
  var Base_A=d_A-H1_A-H2_A;
  var Base_B=d_B-H1_B-H2_B;

  var Module_A = PD_A/Z_A;
  var Module_B = PD_B/Z_B;
    // teeth are intersected with shape_A and subtracted by shape2_A
//   	    3
//	   	  /   \
//  1----2     \
//  		    \4
//  		    /
//  		   /
//            |5
//  7_________|6

  var P1_A=[0,(Base_A+H2_A-Module_A*x*sin_A)*2/3+d_A/3];
  var P2_A=[(PD_A/2-Module_A*x*cos_A)*2/3,(Base_A+H2_A-Module_A*x*sin_A)*2/3+d_A/3];
  var dd=(P2_A[1]-Math.floor(P2_A[1]))*cos_A/sin_A;
  P1_A=[0,Math.floor(P2_A[1])];
  P2_A=[(PD_A/2-Module_A*x*cos_A)*2/3-dd,P1_A[1]];

  var P1_B=[0,                          (Base_B+H2_B-Module_B*x*sin_B)*2/3+d_B/3];
  var P2_B=[(PD_B/2-Module_B*x*cos_B)*2/3,(Base_B+H2_B-Module_B*x*sin_B)*2/3+d_B/3];
  var dd=(P2_B[1]-Math.floor(P2_B[1]))*cos_B/sin_B;
  P1_B=[0,Math.floor(P2_B[1])];
  P2_B=[(PD_B/2-Module_B*x*cos_B)*2/3-dd,P1_B[1]];

  var P6_B=[PD_B/2-Module_B*x*cos_B,0];
  var P6_A=[PD_A/2-Module_A*x*cos_A,0];

  document.getElementById('T_A').value=(P2_A[1]);
  document.getElementById('T_B').value=(P2_B[1]);
  document.getElementById('TD_A').value=(P2_A[0]*2).toFixed(2);
  document.getElementById('TD_B').value=(P2_B[0]*2).toFixed(2);
  document.getElementById('BD_A').value=(P6_A[0]*2).toFixed(2);
  document.getElementById('BD_B').value=(P6_B[0]*2).toFixed(2);
  document.getElementById('B_A').value=(Base_A).toFixed(2);
  document.getElementById('B_B').value=(Base_B).toFixed(2);

  return 0;
}
