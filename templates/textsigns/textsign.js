


function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;
  var BGThickness 	=Number(document.getElementById('BGThickness').value);
  var SelectP 		=document.getElementById('SelectP').value;
  var PatternSize 	=Number(document.getElementById('PatternSize').value);
  var PatternThickness 	=Number(document.getElementById('PatternThickness').value);
  var LeftMargin 	=Number(document.getElementById('LeftMargin').value);
  var RightMargin 	=Number(document.getElementById('RightMargin').value);
  var TopBottomMargin 	=Number(document.getElementById('TopBottomMargin').value);
  var FrameThickness 	=Number(document.getElementById('FrameThickness').value);
  var FrameWidth 	=Number(document.getElementById('FrameWidth').value);
  var Fillet		=Number(document.getElementById('Fillet').value);
  var mirror		=document.getElementById('mirror').checked;
  var Holed	     	=Number(document.getElementById('HoleD').value);


  if (FrameWidth<0) {FrameWidth=0;}
  if (LeftMargin<0) {LeftMargin=0;}
  if (RightMargin<0) {RightMargin=0;}
  if (TopBottomMargin<0) {TopBottomMargin=0;}
  if (PatternSize<0) {PatternSize=0;}
  if (Fillet<0) {Fillet=0;}
  if (Holed<0) {Holed=0;}
  if ((PatternThickness<0)||(PatternThickness>PatternSize)) {PatternThickness=0;}

  var result = new CSG();

  //creating text
  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
  if (TextThickness > BGThickness ) {		// text is higher than the BG
    T=T.extrude({offset: [0,0,TextThickness]});
  }
  else {  					// text is lower than the BG (cut text)
    T=T.extrude({offset: [0,0,BGThickness+1]});
  }

  //centering text
  var T8 = txtCAG("8",FontSize,TextNarrowing ,TextItalic);
  T8=-(T8.getBounds()[1].y + T8.getBounds()[0].y)/2;

  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,T8,0]).setColor(1, 0.925, 0.7);
  //mirroring
  if (mirror==true) { T=T.mirroredX();}

  //frame and BG cags
  var frameleft=0.1*Math.floor(10*(T.getBounds()[0].x-LeftMargin-FrameWidth));
  var frameright=-0.1*Math.floor(-10*(T.getBounds()[1].x+RightMargin+FrameWidth));
  var framebottom=0.1*Math.floor(10*Math.min(-(T.getBounds()[1].y+FrameWidth+TopBottomMargin), T.getBounds()[0].y-FrameWidth-TopBottomMargin));
  var frametop=-framebottom;

  if (Fillet>0) {
  	var frame=CAG.roundedRectangle({corner1: [frameleft, framebottom], corner2: [frameright, frametop], roundradius: Fillet, resolution: 60});
  }
  else {
  	var frame=CAG.rectangle({corner1: [frameleft, framebottom], corner2: [frameright, frametop]});
  }
  // add holes
  if (Holed>0) {
	  var holeY=frametop+Holed/2;
	  var holeX=frameleft+(Fillet+FrameWidth+Holed/2);
	  frame=frame.union(new CAG.circle({center: [holeX, holeY], radius: Holed/2+FrameWidth, resolution: 60}).subtract(new CAG.circle({center: [holeX, holeY], radius: Holed/2, resolution: 24})));
	  holeX=frameright-(Fillet+FrameWidth+Holed/2);
	  frame=frame.union(new CAG.circle({center: [holeX, holeY], radius: Holed/2+FrameWidth, resolution: 60}).subtract(new CAG.circle({center: [holeX, holeY], radius: Holed/2, resolution: 24})));

  }



  var BGfillet=Fillet-FrameWidth;
  if (BGfillet>0) {
  	var BG=CAG.roundedRectangle({corner1: [frameleft+FrameWidth, framebottom+FrameWidth], corner2: [frameright-FrameWidth, -framebottom-FrameWidth], roundradius: BGfillet, resolution: 24});
  }
  else {
    	var BG=CAG.rectangle({corner1: [frameleft+FrameWidth, framebottom+FrameWidth], corner2: [frameright-FrameWidth, -framebottom-FrameWidth]});
  }

  frame=frame.subtract(BG);
  if (FrameThickness>0) {  frame=frame.extrude({offset: [0,0,FrameThickness]});  }

  if (BGThickness>0) {  BG=BG.extrude({offset: [0,0,BGThickness]});}

  // reduce material in BG
  if ((SelectP!='Solid')&&(PatternSize!=0)&&(PatternThickness!=0)&&(BGThickness>0)) {
	var Staggered=false;
	if ((SelectP=='Squares45')||(SelectP=='Honeycomb')) {Staggered=true;}
	var DX = PatternSize;
        var DY = PatternSize;
 	var patternshape = new CAG();
        if (SelectP=='Squares')	{
		var patternshape = new CAG.rectangle({center: [0, 0], radius: [(PatternSize-PatternThickness)/2, 			(PatternSize-PatternThickness)/2]});
		}
        if (SelectP=='Squares45') {
		DX*=0.7071067812;
		DY*=0.7071067812;
		var patternshape = new CAG.rectangle({center: [0, 0], radius: [(PatternSize-PatternThickness)/2, 			(PatternSize-PatternThickness)/2]}).rotateZ(45);
	}

        if (SelectP=='Honeycomb') {
		DX*=(1.15470054)*3/4;
		DY*=0.5;
		var patternshape = new CAG.circle({center: [0,0], radius: (PatternSize-PatternThickness)/2*1.15470054,
			resolution: 6});

	}

	patternshape=patternshape.extrude({offset: [0,0,BGThickness]});

        var subt = new CSG(); // summation of the shape grid
        var i0 = Math.floor((frameleft+FrameWidth)/DX);
	var i1 = -Math.floor(-(frameright-FrameWidth)/DX);
        var j0 = Math.floor((framebottom+FrameWidth)/DY);
	var j1 = -Math.floor(-(frametop-FrameWidth)/DY);
        for(var i=i0;i<=i1;i+=1) {
		for(var j=j0;j<=j1;j+=1) {
			if (!((Staggered==true)&&(Math.abs(i+j)%2==1))) {
 				subt=subt.unionForNonIntersecting(patternshape.translate([i*DX,j*DY,0]));
			}
		}
	}
	BG=BG.subtract(subt);
  } // reduce material

  if (BGThickness>0) { result=result.union(BG); }
  if (TextThickness > BGThickness ) {		// text is higher than the BG
    result=result.union(T);
  }
  else {  					// text is lower than the BG (cut text)
    result=result.subtract(T.translate([0,0,TextThickness]));
  }
  if (FrameThickness>0) { result=result.union(frame); }

  return [
    { name: "TextSign", caption: "Text Sign", data: result }
   	];
}
