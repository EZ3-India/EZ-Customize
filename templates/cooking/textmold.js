
function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;
  var mirror		=document.getElementById('mirror').checked;

  var BottomZ		=Number(document.getElementById('BottomZ').value);
  var WallH		=Number(document.getElementById('WallH').value);
  var WallT		=Number(document.getElementById('WallT').value);

  var LinesS		=Number(document.getElementById('linesS').value);
  var LinesA		=Number(document.getElementById('linesA').value);
  var LinesT		=Number(document.getElementById('linesT').value);


  var B2 = new CSG();
  //creating text
  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);

  //centering text
  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,0,0]);
  //mirroring
  if (mirror==true) { T=T.mirroredX();}


 if((WallH>0)&&(WallT>0))
    {

	    B2=T.expand(WallT,8);
	    B2=B2.subtract(T);
	    B2=B2.extrude({offset: [0,0,WallH+BottomZ]});
   }
   if(BottomZ>0) {
	   if((LinesS>0)&&(LinesT>0)) {
		   var Lin1=new CAG();
		   var rad1=Math.max(Math.abs(T.getBounds()[1].x),Math.abs(T.getBounds()[0].x))+Math.max(Math.abs(T.getBounds()[1].y),Math.abs(T.getBounds()[0].y));
		   var p1=LinesT+LinesS;

		   for(var i=0;i<=rad1;i+=p1) {
			   Lin1=Lin1.union(new CAG.rectangle({center: [0, i], radius: [rad1, LinesT/2]}));
   		   }
   		   for(var i=-p1;i>=-rad1;i-=p1) {
			   Lin1=Lin1.union(new CAG.rectangle({center: [0, i], radius: [rad1, LinesT/2]}));
   		   }
   		   T=T.intersect(Lin1.rotateZ(LinesA));
		   }

	   T=T.extrude({offset: [0,0,BottomZ]});


	   return [ { name: txt+"_Shaped_Mold", caption: "Letter Shaped Mold", data: T.union(B2) } ];

   }
   else return [ { name: txt+"_Shaped_Cookie_Cutter", caption: "Letter Shaped Cookie Cutter", data: B2 } ];
}
