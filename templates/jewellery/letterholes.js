
function main()
{
  var txt		=document.getElementById('textField').value;
  var FontSize 		=Number(document.getElementById('FontSize').value);
  var TextThickness 	=Number(document.getElementById('TextThickness').value);
  var TextNarrowing 	=Number(document.getElementById('Fnarrowing').value)*0.01;
  var TextItalic 	=Number(document.getElementById('Fitalic').value)*0.01;
  var LANG		=document.getElementById('SelectLang').value;
  var holed 		=Number(document.getElementById('holed').value);
  var holel	 	=Number(document.getElementById('holel').value);
  var mirror		=document.getElementById('mirror').checked;

  var result = new CSG();

  //creating text
  var T = txtCAG(txt,FontSize,TextNarrowing ,TextItalic);
  T=T.extrude({offset: [0,0,TextThickness]});

  //centering text
  var wid=(T.getBounds()[1].x + T.getBounds()[0].x);

  T=T.translate([-wid/2 ,0,0]).setColor(1, 0.925, 0.7);
  //mirroring
  if (mirror==true) { T=T.mirroredX();}


  var T2=txtCAG("8",FontSize,TextNarrowing ,TextItalic);

  var maxy=Math.min(T2.getBounds()[1].y,T.getBounds()[1].y);

  if (holed>0) { result=T.subtract(new CSG.cylinder({start: [-wid/2,maxy-holel,TextThickness/2], end: [wid/2,maxy-holel,TextThickness/2], radius: holed/2})); }
  else result=T;

  return [
    { name: "Holed_Letters", caption: "Holed_Letters", data: result }
   	];
}
