var dist=0.5;





function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;

  var R1		=Number(document.getElementById('Diam').value)*0.5;
  var N			=Number(document.getElementById('NPoints').value);

  var fillet1		=Number(document.getElementById('outerR').value);
  var fillet2		=Number(document.getElementById('innerR').value);
  var R2		=R1*0.01*Number(document.getElementById('SpikeS').value);
  var coverz		=Number(document.getElementById('starZ').value);


  if (coverz<0) coverz=0.1;
  var result = new CSG();

  var B=STAR(N, R1,R2,fillet1,fillet2).extrude({offset: [0,0,coverz]});



          //creating text
 	  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
 	  T=T.extrude({offset: [0,0,TextThickness]});

 	  //centering text & lifting on the cover
  	  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,coverz]).setColor(0.9, 0.9, 0.9);  // setColor(1, 0.925, 0.7);

          //resize T if needed
          var sc=Math.max(Math.abs(T.getBounds()[0].x)/R2,Math.abs(T.getBounds()[1].x)/R2,Math.abs(T.getBounds()[1].y)/R2,Math.abs(T.getBounds()[0].y)/R2);
          if (sc>1) { T=T.scale([1/sc, 1/sc, 1]);}
          if (TextThickness>0) B=B.union(T); else B=B.subtract(T);





  return [ { name: "Star_With_Text", caption: "Text On a Star", data: B } ];

}

function STAR(N, R1,R2,F1,F2) {
	var RESO=60;
	if (F1>1) {F1=1;}
	if (F2>1) {F2=1;}
	var P1=[R2*Math.cos(((0-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((0-0.5)*2/N+0.5)*3.14159265359)];
	var P2=[R1*Math.cos((0*2/N+0.5)*3.14159265359),R1*Math.sin((0*2/N+0.5)*3.14159265359)];
	dist=Math.abs(P1[0]*P2[1]-P1[1]*P2[0])*0.5/Math.pow(Math.pow(P1[0]-P2[0],2)+Math.pow(P1[1]-P2[1],2),0.5);
	//alert(Math.pow(Math.pow(P1[0]-P2[0],2)+Math.pow(P1[1]-P2[1],2),0.5));
	if ((F1<=0)&&(F2<=0)) {
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159265359)];
		        path=path.appendPoint(P1);
			path=path.appendPoint(P2);
			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
	}
	if ((F1>0)&&(F2<=0)) {
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159265359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			//var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159365359)];
		//	   P2
		//       /    \
		//  -- P1      P3 --- P4

			var P11=[P1[0]*F1+P2[0]*(1-F1),P1[1]*F1+P2[1]*(1-F1)];
			var P21=[P3[0]*F1+P2[0]*(1-F1),P3[1]*F1+P2[1]*(1-F1)];
		        path=path.appendPoint(P1);
			path=path.appendPoint(P11);
			path=path.appendBezier([P2,P21],{resolution: 60});
			//path=path.appendPoint(P21);
			//path=path.appendPoint(P2);

			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
	}
	if ((F1<=0)&&(F2>0)) {
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			//var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159265359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159265359)];
		//	   P2
		//       /    \
		//  -- P1      P3 --- P4

			var P31=[P4[0]*F2+P3[0]*(1-F2),P4[1]*F2+P3[1]*(1-F2)];
			var P21=[P2[0]*F2+P3[0]*(1-F2),P2[1]*F2+P3[1]*(1-F2)];
		        path=path.appendPoint(P2);
			path=path.appendPoint(P21);
			path=path.appendBezier([P3,P31],{resolution: RESO});
			//path=path.appendPoint(P21);
			//path=path.appendPoint(P2);

			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
	}
	if ((F1>0)&&(F2>0)) {
		if (F1+F2<1) {
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159265359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159265359)];
		//	   P2
		//       P12  P21
		//	/      \
		//     P11	P22
		//  - P1          P3 -P31-  P32 P4

			var P12=[P1[0]*F1+P2[0]*(1-F1),P1[1]*F1+P2[1]*(1-F1)];
			var P21=[P3[0]*F1+P2[0]*(1-F1),P3[1]*F1+P2[1]*(1-F1)];
			var P31=[P4[0]*F2+P3[0]*(1-F2),P4[1]*F2+P3[1]*(1-F2)];
			var P22=[P2[0]*F2+P3[0]*(1-F2),P2[1]*F2+P3[1]*(1-F2)];

			path=path.appendPoint(P12);
			path=path.appendBezier([P2,P21],{resolution: 60});
			path=path.appendPoint(P22);
			path=path.appendBezier([P3,P31],{resolution: RESO});

			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
		}
		if (F1+F2>=1) {
		F1=F1/(F1+F2);
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159265359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159265359)];
		//	    P2
		//        /    \
		//	P11     P21
		//     /	 \
		//  - P1          P3 -P31- P4

			var P11=[P1[0]*F1+P2[0]*(1-F1),P1[1]*F1+P2[1]*(1-F1)];
			var P21=[P3[0]*F1+P2[0]*(1-F1),P3[1]*F1+P2[1]*(1-F1)];
			var P31=[P3[0]*F1+P4[0]*(1-F1),P3[1]*F1+P4[1]*(1-F1)];
			if (ii==0) {path=path.appendPoint(P11);}

			path=path.appendBezier([P2,P21],{resolution: RESO});
			path=path.appendBezier([P3,P31],{resolution: RESO});

			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
		}
	}


}





function BOX1(boxcag, bottom, coverz,totalz,wall,tolerance)
{
	var shrink=(wall-tolerance)/2;
	var c2=boxcag.scale((dist-shrink/2)/dist); // boxcag.contract((wall-tolerance)/2);
        shrink+=tolerance;
	var c3=boxcag.scale((dist-shrink/2)/dist); //  c2.contract(tolerance);
	shrink+=(wall-tolerance)/2;
	var c4=boxcag.scale((dist-shrink/2)/dist); //  c3.contract((wall-tolerance)/2);
	shrink+=tolerance;

	var c5=boxcag.scale((dist-shrink/2)/dist); //  c4.contract(tolerance);

        var box= boxcag.extrude({offset: [0,0,bottom]});
        var wallcag=boxcag.subtract(c4);


	box=box.union(wallcag.extrude({offset: [0,0,totalz-coverz]}));

        if (coverz<tolerance) { var z1=coverz/2;}
        else {
          if (coverz<tolerance+3) {var z1=(coverz-tolerance)/2; }
          else {var z1=coverz/3;}
        }

	if (z1>0) {box=box.union(wallcag.intersect(c3).extrude({offset: [0,0,z1]}).translate([0,0,totalz-coverz]));}


        if (coverz>0) {
        	var cover=boxcag.subtract(c2).union(c5).extrude({offset: [0,0,coverz-z1]});
        	cover=cover.union(boxcag.extrude({offset: [0,0,z1]}).translate([0,0,coverz-z1]));
        }
        else { cover=new CSG(); }
       	return {box: box , cover: cover} ;
}
