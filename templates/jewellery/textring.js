function main()
{  
  var txt			=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness =Number(document.getElementById('TextThickness').value);
  var TextNarrowing =Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01; 
  
  var mirror		=document.getElementById('mirror').checked;

  var result = new CSG();
  
  T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
  
  T=T.translate([-T.getBounds()[0].x,-T.getBounds()[0].y]); //-(T.getBounds()[1].x + T.getBounds()[0].x)/2 
  if (mirror==true) { T=T.mirroredX();}
  result=CagToRing(T,20,24,80);
  
  return [
    { name: "Ring", caption: "Ring", data: result } 
   	];
}

function CagToRing(cag1,R0,R1,RESO)
{
	var Ring = new CSG();
	var Ring2 = new CSG();
	var PieceWidth=2*R0*Math.sin(Math.PI/RESO);
	var CurX=0;
	var i=0;
	var Y0=cag1.getBounds()[0].y;
	var Y1=cag1.getBounds()[1].y;
		
	for (var j=0; j<RESO;j+=2){
		i=j*360/RESO;
		CurX=j*PieceWidth;
		
		var A=cag1.intersect(new CAG.rectangle({corner1: [CurX,Y0], corner2: [CurX+PieceWidth, Y1]})).translate([-CurX-PieceWidth/2,0,0]);
	    A=A.extrude({offset: [0, 0, (R1-R0)*Math.cos(Math.PI/RESO)], scale: [R1/R0,1]}).translate([PieceWidth/2,0,0]);
	    A=A.rotateX(90).rotateZ(180/RESO).translate([0,-R0,0]).rotateZ(i);  
	    Ring=Ring.unionForNonIntersecting(A);
    }
    for (var j=1; j<RESO;j+=2){
		i=j*360/RESO;
		CurX=j*PieceWidth;
		
		var A=cag1.intersect(new CAG.rectangle({corner1: [CurX,Y0], corner2: [CurX+PieceWidth, Y1]})).translate([-CurX-PieceWidth/2,0,0]);
	    A=A.extrude({offset: [0, 0, (R1-R0)*Math.cos(Math.PI/RESO)], scale: [R1/R0,1]}).translate([PieceWidth/2,0,0]);
	    A=A.rotateX(90).rotateZ(180/RESO).translate([0,-R0,0]).rotateZ(i);  
	    Ring2=Ring2.unionForNonIntersecting(A);
    }
    
    return Ring.union(Ring2);

}
	