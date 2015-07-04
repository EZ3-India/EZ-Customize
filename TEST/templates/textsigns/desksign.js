var ExamplesLinks=[
  'http://3ddoctors.net/templates/textsigns/desksign.html?swidth=150&sheight=40&sthick=1.5&angle=45&vert=true&bhole=0&sides=false&textField=Executive&FontSize=20&Fitalic=0&Fnarrowing=100&TextThickness=1.5&mirror=false&SelectFont=arialbd.ttf&SelectLang=Latin'
  ,
  'http://3ddoctors.net/templates/textsigns/desksign.html?swidth=180&sheight=40&sthick=1.5&angle=60&vert=false&bhole=90&sides=true&textField=Senior%20Assistant&FontSize=20&Fitalic=0&Fnarrowing=100&TextThickness=1.5&mirror=false&SelectFont=arialbd.ttf&SelectLang=Latin'
  ,
  'http://3ddoctors.net/templates/textsigns/desksign.html?swidth=180&sheight=40&sthick=2&angle=60&vert=false&bhole=80&sides=false&textField=RECEPTION&FontSize=20&Fitalic=0&Fnarrowing=100&TextThickness=-1&mirror=false&SelectFont=ariblk.ttf&SelectLang=Latin'
  ,
  'http://3ddoctors.net/templates/textsigns/desksign.html?swidth=180&sheight=40&sthick=1.5&angle=60&vert=false&bhole=100&sides=true&textField=Designer&FontSize=20&Fitalic=0&Fnarrowing=100&TextThickness=1.5&mirror=false&SelectFont=ariblk.ttf&SelectLang=Latin'
  
  ]
  
  
function main()
{  
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01; 
  var mirror		=document.getElementById('mirror').checked;
 
  var swidth 		=Number(document.getElementById('swidth').value);
  var sheight 		=Number(document.getElementById('sheight').value);
  var sthick 		=Number(document.getElementById('sthick').value);
  var angle 		=Number(document.getElementById('angle').value);
  var bhole 		=Number(document.getElementById('bhole').value)*0.01;
  var vert		=document.getElementById('vert').checked;
  var sides		=document.getElementById('sides').checked;
  
  if (TextThickness==0) { TextThickness=1;}
  
  //creating text  
  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
  T=T.extrude({offset: [0,0,TextThickness]});
  
  //centering text
  var T8 = txtCAG("8",FontSize,TextNarrowing ,TextItalic);
  T8=-(T8.getBounds()[1].y + T8.getBounds()[0].y)/2;
     
  T=T.translate([-(T.getBounds()[1].x + T.getBounds()[0].x)/2 ,T8+sheight/2,0]).setColor(1, 0.925, 0.7).rotateX(angle); 
  //mirroring
  if (mirror==true) { T=T.mirroredX();}
 
  Yup=sheight*Math.cos(angle*Math.PI/180);
  Zup=sheight*Math.sin(angle*Math.PI/180); 
 
  // signbackground
  var B=new CAG.rectangle({corner1: [-swidth/2,0], corner2: [swidth/2,sthick]})
  var front=B.extrude({offset: [0,Yup,Zup]});
  var Ydown=Yup*2;
  if (vert==true) {Ydown=Yup;} 
  
  var bk=B.extrude({offset: [0,Ydown-Yup,-Zup]}).translate([0,Yup,Zup]);
  
  var hx=swidth/2*bhole;
  if (swidth/2-hx<sthick) {hx=swidth/2-sthick;}
  if (hx>0) {
	  bk=bk.subtract(new CAG.rectangle({corner1: [-hx,0], corner2: [hx,Ydown+sthick+1]}).extrude({offset: [0,0,Zup*2]}));
  }
  
  var result=front.union(bk);   
  if (sides==true) {
	   var sd = new CSG.Polygon2D([[0,0],[Zup,Yup],[Zup,Yup+sthick],[0,Ydown+sthick]]).extrude({offset: [0,0,-sthick]}).rotateY(-90).translate([-swidth/2,0,0]);
	   sd=sd.union(sd.mirroredX());
	   result=result.union(sd);
  }
  
  if (TextThickness>0) {result=result.union(T); } else { result=result.subtract(T);}
  

  return [
    { name: "DeskSign", caption: "Desk Sign", data: result } 
   	];
}

