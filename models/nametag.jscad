/////////////////////////////////////////////
//
// NameTag Factory with OpenJSCAD.org
// Idea and modeling by Kurt Meister | google.com/+KurtMeister
// Juli 2014
// CC BY-NC-SA 3.0
// ---
// Browse to http://openjscad.org/ and drop this file into the dashed area.
//
///////////////////////////////////////////// 

function getParameterDefinitions() {
  return [
    {name: 'myText1', caption: 'Text:', type: 'text', default: 'EZ3-India'},
    //{name: 'length', caption: 'Length:', type: 'float', default: 70},
	//{name: 'height', caption: 'Height:', type: 'float', default: 17},
	{name: 'thickness', caption: 'Thickness:', type: 'float', default: 2},
	{name: 'fontweight', caption: 'Fontweight:', type: 'float', default: 3},
	{name: 'fontwidth', caption: 'Fontwidth [%]:', type: 'float', default: 100},
  ];
}

function main(params){
  var myT1 = params.myText1;
  var cubl = ""; //params.length/2;
  var cubh = 9; //params.height/2;
  var cubt = params.thickness/2;
  var fwgt = params.fontweight;
  var fwth = params.fontwidth/100*0.33;
  var corn = 4;
  var res = 24;

  //Text
  var l = vector_text(0,0,myT1);   // l contains a list of polylines to be drawn
  var o = [];
  l.forEach(function(pl){          // pl = polyline (not closed)
    o.push(rectangular_extrude(pl, {w: fwgt, h: fwgt})); // extrude it to 3D
  });
    
  tag1 = union(o);
  tag1 = tag1.scale([fwth,0.33,0.5]);
  
  cubl = (tag1.getBounds()[1].x - tag1.getBounds()[0].x + 17)/2; //get the width of the text  
  
  tag1 = tag1.translate([-cubl+11,-3,cubt-1]);
  
  //Tag
  var tagCube1 = CSG.cube({
    center: [0,0,0],
    radius: [cubl-corn,cubh,cubt]
  });
  
  //Corners
  var tagCube2 = CSG.cube({
    center: [0,0,0],
    radius: [cubl,cubh-corn,cubt]
  });
  
  var tagCorn1 = CSG.cylinder({
    center: [0,0,0],
    start: [0,0,-cubt],
    end: [0,0,cubt],
    radius: corn, resolution: res
  });
  
  var tagCorn2 = tagCorn1;
  var tagCorn3 = tagCorn1;
  var tagCorn4 = tagCorn1;
  
  tagCorn1 = tagCorn1.translate([cubl-corn,cubh-corn,0]);
  tagCorn2 = tagCorn2.translate([cubl-corn,-cubh+corn,0]);
  tagCorn3 = tagCorn3.translate([-cubl+corn,cubh-corn,0]);
  tagCorn4 = tagCorn4.translate([-cubl+corn,-cubh+corn,0]);
  
  //Cutout
  var tagCube3 = CSG.cube({
    center: [0,0,0],
    radius: [2.5,2.5,cubt]
  });
  
  tagCube3 = tagCube3.translate([-cubl+5,0,0]);
  
  var tagCyl1 = CSG.cylinder({
    center: [0,0,0],
    start: [0,0,-cubt],
    end: [0,0,cubt],
    radius: 2.5, resolution: res
  });
  
  var tagCyl2 = tagCyl1;
  tagCyl1 = tagCyl1.translate([-cubl+5,2.5,0]);
  tagCyl2 = tagCyl2.translate([-cubl+5,-2.5,0]);
      
  var result = tagCube1.union(tagCube2);
  result = result.union(tagCorn1);
  result = result.union(tagCorn2);
  result = result.union(tagCorn3);
  result = result.union(tagCorn4);
  result = result.subtract(tag1);
   
  result = result.subtract(tagCube3);
  result = result.subtract(tagCyl1);
  result = result.subtract(tagCyl2);
  result = result.translate([0,0,cubt]);
  result = result.setColor(1, 0.3, 0); //change default color
    
  return result;
}

