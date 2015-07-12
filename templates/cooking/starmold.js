var dist=0.5;



function main()
{

  var R1		=Number(document.getElementById('Diam').value)*0.5;
  var N			=Number(document.getElementById('NPoints').value);

  var fillet1		=Number(document.getElementById('outerR').value);
  var fillet2		=Number(document.getElementById('innerR').value);
  var R2		=R1*0.01*Number(document.getElementById('SpikeS').value);
  var BottomZ		=Number(document.getElementById('BottomZ').value);
  var WallH		=Number(document.getElementById('WallH').value);
  var WallT		=Number(document.getElementById('WallT').value);

  var LinesS		=Number(document.getElementById('linesS').value);
  var LinesA		=Number(document.getElementById('linesA').value);
  var LinesT		=Number(document.getElementById('linesT').value);


  CSG.defaultResolution2D=36;
  var B2 = new CSG();

  var B=STAR(N, R1,R2,fillet1,fillet2);

  if((WallH>0)&&(WallT>0))
    {
	    //B2=B2=B.expand(WallT,4); //B.scale((dist+WallT/2)/dist);  //
	    //B2=STAR(N, R1+WallT,R2+WallT,fillet1,fillet2);
	    B2=B.expand(WallT,8);
	    B2=B2.subtract(B);
	    B2=B2.extrude({offset: [0,0,WallH+BottomZ]});
   }
   if(BottomZ>0) {
	   if((LinesS>0)&&(LinesT>0)) {
		   var Lin1=new CAG();
		   var rad1=Math.max(Math.abs(B.getBounds()[1].x),Math.abs(B.getBounds()[0].x))+Math.max(Math.abs(B.getBounds()[1].y),Math.abs(B.getBounds()[0].y));
		   var p1=LinesT+LinesS;

		   for(var i=0;i<=rad1;i+=p1) {
			   Lin1=Lin1.union(new CAG.rectangle({center: [0, i], radius: [rad1, LinesT/2]}));
   		   }
   		   for(var i=-p1;i>=-rad1;i-=p1) {
			   Lin1=Lin1.union(new CAG.rectangle({center: [0, i], radius: [rad1, LinesT/2]}));
   		   }
   		   B=B.intersect(Lin1.rotateZ(LinesA));
		   }

	   B=B.extrude({offset: [0,0,BottomZ]});
	   return [ { name: "Star_Shaped_Mold", caption: "Star Shaped Mold", data: B.union(B2) } ];

   }
   else return [ { name: "Star_Shaped_Cookie_Cutter", caption: "Star Shaped Cookie Cutter", data: B2 } ];

}

function STAR(N, R1,R2,F1,F2) {
	if (F1>1) {F1=1;}
	if (F2>1) {F2=1;}
	var P1=[R2*Math.cos(((0-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((0-0.5)*2/N+0.5)*3.14159265359)];
	var P2=[R1*Math.cos((0*2/N+0.5)*3.14159265359),R1*Math.sin((0*2/N+0.5)*3.14159365359)];
	dist=Math.abs(P1[0]*P2[1]-P1[1]*P2[0])*0.5/Math.pow(Math.pow(P1[0]-P2[0],2)+Math.pow(P1[1]-P2[1],2),0.5);
	//alert(Math.pow(Math.pow(P1[0]-P2[0],2)+Math.pow(P1[1]-P2[1],2),0.5));
	if ((F1<=0)&&(F2<=0)) {
		var path = new CSG.Path2D();
		for(var ii=0;ii<N;ii+=1)
			{
			var P1=[R2*Math.cos(((ii-0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii-0.5)*2/N+0.5)*3.14159265359)];
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159365359)];
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
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159365359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			//var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159365359)];
		//	   P2
		//       /    \
		//  -- P1      P3 --- P4

			var P11=[P1[0]*F1+P2[0]*(1-F1),P1[1]*F1+P2[1]*(1-F1)];
			var P21=[P3[0]*F1+P2[0]*(1-F1),P3[1]*F1+P2[1]*(1-F1)];
		        path=path.appendPoint(P1);
			path=path.appendPoint(P11);
			path=path.appendBezier([P2,P21]);
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
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159365359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159365359)];
		//	   P2
		//       /    \
		//  -- P1      P3 --- P4

			var P31=[P4[0]*F2+P3[0]*(1-F2),P4[1]*F2+P3[1]*(1-F2)];
			var P21=[P2[0]*F2+P3[0]*(1-F2),P2[1]*F2+P3[1]*(1-F2)];
		        path=path.appendPoint(P2);
			path=path.appendPoint(P21);
			path=path.appendBezier([P3,P31]);
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
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159365359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159365359)];
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
			path=path.appendBezier([P2,P21]);
			path=path.appendPoint(P22);
			path=path.appendBezier([P3,P31]);

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
			var P2=[R1*Math.cos((ii*2/N+0.5)*3.14159265359),R1*Math.sin((ii*2/N+0.5)*3.14159365359)];
			var P3=[R2*Math.cos(((ii+0.5)*2/N+0.5)*3.14159265359),R2*Math.sin(((ii+0.5)*2/N+0.5)*3.14159265359)];
			var P4=[R1*Math.cos(((ii+1)*2/N+0.5)*3.14159265359),R1*Math.sin(((ii+1)*2/N+0.5)*3.14159365359)];
		//	    P2
		//        /    \
		//	P11     P21
		//     /	 \
		//  - P1          P3 -P31- P4

			var P11=[P1[0]*F1+P2[0]*(1-F1),P1[1]*F1+P2[1]*(1-F1)];
			var P21=[P3[0]*F1+P2[0]*(1-F1),P3[1]*F1+P2[1]*(1-F1)];
			var P31=[P3[0]*F1+P4[0]*(1-F1),P3[1]*F1+P4[1]*(1-F1)];
			if (ii==0) {path=path.appendPoint(P11);}

			path=path.appendBezier([P2,P21]);
			path=path.appendBezier([P3,P31]);

			}
		path = path.close();
		var S = path.innerToCAG();
        	return S;
		}
	}


}
