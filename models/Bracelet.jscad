/////////////////////////////////////////////
//
// BraceletV2 Factory with OpenJSCAD.org
// Idea and modeling by Kurt Meister | google.com/+KurtMeister
// September 2014
// CC BY-NC-SA 3.0
//
/////////////////////////////////////////////
//
// Browse to http://openjscad.org/ and drop this file into the dashed area.
//
///////////////////////////////////////////// 

function getParameterDefinitions() {
	return [
		{name: 'myT1', caption: 'Text:', type: 'text', default: 'EZ3-India'},
		{name: 'out', caption: 'Outer diameter:', type: 'float', default: 70},
		//{name: 'hgt', caption: 'Height:', type: 'float', default: 10},
	];
};

function main(params){
	var myT1 = params.myT1;
	var out = params.out/2;
	var hgt = 5; //params.hgt/2;
	
	var fwgt = 3; //params.fontweight;
	var fwth = 100; //params.fontwidth/100*0.33;
	var Cut = 4;
	
	var res = Math.floor(2*out*Math.PI/9);

///////////////////////////////////////	

	//Cylinder: Main body
	var Cyl = CSG.cylinder({
		center: [0,0,0],
		start: [0,0,-hgt],
		end: [0,0,hgt],
		radius: out, resolution: res
	});
  
	//Cutout
	var Cube1 = CSG.cube({
		center: [0,0,0],
		radius: [Cut,Cut,hgt+1]
	});
  
	Cube1 = Cube1.rotateZ(45);
  
	//Cutout 
	var Cube2 = CSG.cube({
		center: [0,Cut,0],
		radius: [Cut,Cut,hgt+1]
	});
  
	Cube2 = Cube2.scale([2,1,1]);
	Cube = Cube1.subtract(Cube2);
	   
	Cube = Cube.scale([0.5,1,1]);
	Cube = Cube.translate([0, -out+(Cut*1.3),0]);
	Cube = Cube.rotateZ(90);
	
	Cyl = Cyl.rotateZ(270);
	var result = Cyl;
	Cube = Cube.rotateZ(270);
	
	for(var i = 0; i < res; i++) {
		Cube = Cube.rotateZ(360/res);
		result = result.subtract(Cube);
	};
	
	result = result.setColor(1, 0.3, 0); 

//////////////////////////////////////
	
	//Text on segments
	var z = myT1.length;
	
	for(var i = 0; i < z; i++) {
		if(myT1.charAt(i) == " "){
			; // got an alert when I write "return" :(
		}else{
			var l = vector_text(0,0,myT1.charAt(i));
			var o = [];
			l.forEach(function(pl){
				o.push(rectangular_extrude(pl, {w: 3, h: 1}));
			});
		
			var tag1 = union(o);
			tag1 = tag1.scale([0.25,0.25,1]);
			tag1 = tag1.rotateX(90);
			tag1 = tag1.translate([(-(tag1.getBounds()[1].x - tag1.getBounds()[0].x)/2)-0.5,-out+1,-2.5]);
			tag1 = tag1.rotateZ((360/res)/2);
			
			tag1 = tag1.rotateZ((360/res)*i);
			tag1 = tag1.setColor(0.5, 0.5, 0.5);
			result = result.union(tag1);
		};
	};
	
	result = result.translate([0,0,hgt]);
	return result;
}
