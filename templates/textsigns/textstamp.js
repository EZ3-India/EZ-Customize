function main()
{  
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01; 
  //var BGThickness 	=Number(document.getElementById('BGThickness').value);
  //var SelectP 		=document.getElementById('SelectP').value;
  //var PatternSize 	=Number(document.getElementById('PatternSize').value);
  //var PatternThickness 	=Number(document.getElementById('PatternThickness').value);
  //var LeftMargin 	=Number(document.getElementById('LeftMargin').value);
  //var RightMargin 	=Number(document.getElementById('RightMargin').value);
  //var TopBottomMargin 	=Number(document.getElementById('TopBottomMargin').value);
  //var FrameThickness 	=Number(document.getElementById('FrameThickness').value);
//   var FrameWidth 	=Number(document.getElementById('FrameWidth').value);
//   var Fillet		=Number(document.getElementById('Fillet').value);




// var numOfBars = 2; // 1,2,3
var barRatio = 0.2; // slider 0-1
var barThickness = 2; // don't think the user should control that.
var barDistance = 0.5; // slider 0-1


//   if (FrameWidth<0) {FrameWidth=0;}
//   if (LeftMargin<0) {LeftMargin=0;}
//   if (RightMargin<0) {RightMargin=0;}
//   if (TopBottomMargin<0) {TopBottomMargin=0;}
//   if (PatternSize<0) {PatternSize=0;}
//   if ((PatternThickness<0)||(PatternThickness>PatternSize)) {PatternThickness=0;}

  var result = new CSG();
 
//   //creating text  
//   var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
//   T=T.extrude({offset: [0,0,-TextThickness]});
//  
//   
//   //centering text
//   T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]).setColor(1, 0.925, 0.7); 
//   //mirroring
//   T=T.mirroredX();
var T = new CSG.cube({ center: [0,0,-1], radius: [50,20,1]});
  //holder bars and handles
  var X = T.getBounds()[1].x;
  var Y = T.getBounds()[1].y;
  var XY = new CSG.plane([0,0,1],[0,0,barThickness/2-1]);
  var XZ = new CSG.plane([0,1,0],0);
  var YZ = new CSG.plane([1,0,0],0);

  var barWidth = barRatio*Y;  
  var bars = new CSG.cube({ center : [0, barDistance*(Y-barWidth/2), barThickness/2-1],
  					radius : [2*X, barWidth, barThickness/2] });
  bars = bars.union(CSG.cube({ center : [0, -barDistance*(Y-barWidth/2), barThickness/2-1],
  					radius : [2*X, barWidth, barThickness/2] });
  var holder = new CSG.cylinder({ start: [X/2, barDistance*(Y-barWidth/2), 0],
       end: [0, 0, Y], radius: barThickness/2, resolution: 16 });
  holder = holder.union(holder.mirroredX());
  holder = holder.union(holder.mirroredY());

//   holder1 = holder1.union(CSG.cylinder({ start: [X/3, -barDistance*(Y-barWidth/2), barThickness/2-1],
//        end: [X/3, 0, Y], radius: 1, resolution: 4 }).cutByPlane(XZ.flipped());
//   holder1 = holder1.cutByPlane(XY.flipped());
//   var holder2 = new CSG.cylinder({ start: [X/3, barDistance*(Y-barWidth/2), 0],
//        end: [X/3, 0, Y], radius: 1, resolution: 4 }).cutByPlane(XZ);
	result = T;
	result = result.union(bars);
  	result = result.union(holder);


  return [
    { name: "TextStamp", caption: "Text Stamp", data: result } 
   	];
}

