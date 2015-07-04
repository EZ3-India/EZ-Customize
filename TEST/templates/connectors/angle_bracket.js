var ExamplesLinks=[
  'file:///C:/Users/ofer/Google%20Drive/Jonathan-Ofer/3ddoctors/Website/templates/connectors/angle_bracket2.html?thick=3&width=40&rad=4&Alen=30&Blen=20&AholeD=3&BholeD=3&Aholeh=24&Bholeh=16&Aholed=20&Bholed=30&AholeN=2&BholeN=2&withribs=true&ribsequal=true&ribThick=2&ribN=2&ribsize=70'
  ,
  'file:///C:/Users/ofer/Google%20Drive/Jonathan-Ofer/3ddoctors/Website/templates/connectors/angle_bracket2.html?thick=4&width=40&rad=0&Alen=30&Blen=20&AholeD=3&BholeD=8&Aholeh=18&Bholeh=12&Aholed=20&Bholed=30&AholeN=2&BholeN=1&withribs=true&ribsequal=false&ribThick=2&ribN=2&ribsize=100'
  ,
  'file:///C:/Users/ofer/Google%20Drive/Jonathan-Ofer/3ddoctors/Website/templates/connectors/angle_bracket2.html?thick=3&width=60&rad=5&Alen=30&Blen=20&AholeD=3&BholeD=3&Aholeh=26&Bholeh=16&Aholed=30&Bholed=10&AholeN=2&BholeN=6&withribs=true&ribsequal=false&ribThick=2&ribN=7&ribsize=80'
  ,
  'file:///C:/Users/ofer/Google%20Drive/Jonathan-Ofer/3ddoctors/Website/templates/connectors/angle_bracket2.html?thick=3&width=8&rad=4&Alen=30&Blen=30&AholeD=3&BholeD=3&Aholeh=26&Bholeh=26&Aholed=20&Bholed=30&AholeN=1&BholeN=1&withribs=true&ribsequal=true&ribThick=8&ribN=1&ribsize=80'
  ]


  
function main()
{  
  var thick = Number(document.getElementById('thick').value);
  var width = Number(document.getElementById('width').value);
  var Alen = Number(document.getElementById('Alen').value);
  var Blen = Number(document.getElementById('Blen').value);
  var AholeD = Number(document.getElementById('AholeD').value);
  var BholeD = Number(document.getElementById('BholeD').value);
  var Aholeh = Number(document.getElementById('Aholeh').value);
  var Bholeh = Number(document.getElementById('Bholeh').value);
  var AholeN = Number(document.getElementById('AholeN').value);
  var BholeN = Number(document.getElementById('BholeN').value);
  var Aholed = Number(document.getElementById('Aholed').value) * (AholeN-1);
  var Bholed = Number(document.getElementById('Bholed').value) * (BholeN-1);

  var withribs = document.getElementById('withribs').checked;
  var ribsequal = document.getElementById('ribsequal').checked;
  var ribsize = 0.01*Number(document.getElementById('ribsize').value);
  
  var ribN=Number(document.getElementById('ribN').value);
  var ribThick=Number(document.getElementById('ribThick').value);
  
  var rad=Number(document.getElementById('rad').value);
  
  if (rad<0) {rad=0;}

  if (ribsize==0) {withribs=false;}
  if ((ribsize>0) && (ribsize<=1))
    {
      
      var ribA = thick+(Alen-thick-rad)*ribsize;
      var ribB = thick+(Blen-thick-rad)*ribsize;  
      if (ribsequal) { ribA=Math.min(ribA,ribB); ribB=ribA; }
    }
  
  var result;
  var Acube=new CSG.cube({center: [0,-Alen/2,thick/2], radius: [width/2,Alen/2,thick/2]});
  var Bcube=new CSG.cube({center: [0,-thick  /2,Blen/2], radius: [width/2,thick /2,Blen/2]});
  
  if (rad>0) {var Corner = new CSG.cube({center: [rad/2,rad/2,thick/2], radius: [rad/2,rad/2,thick/2]});
  var C2 = CSG.cylinder({  start: [rad, rad, 0],  end: [rad, rad, thick],  radius: rad });
  Corner =Corner.subtract(C2).translate([-width/2,0,0]);
  Corner =Corner.union(Corner.mirroredX());

  Acube=Acube.subtract(Corner.translate([0,-Alen,0]));
  Bcube=Bcube.subtract(Corner.rotateX(90).mirroredZ().translate([0,0,Blen]));
  }  
 
  result=Acube.union(Bcube);
  
  if (withribs==true) {
	  if (ribN>=2) {
	     var path = new CSG.Polygon2D([[thick ,-thick ], [ribB,-thick ], [thick ,-ribA]],  true);
	    var r = path.extrude({offset: [0,0,ribThick]}).rotateY(-90).translate([width/2,0,0]);
	    var ribs = new Array();
	
	    for(var i=0;i<ribN;i+=1)
	     {
	     ribs.push(r.translate([-i*(width-ribThick)/(ribN-1),0,0]));
	     }
	    result=result.union(ribs);
	    }
	  else
	    {
	    if (ribN==1) {
	      var path = new CSG.Polygon2D([[thick ,-thick ], [ribB,-thick ], [thick ,-ribA]], true);
	      var rib = path.extrude({offset: [0,0,ribThick]}).rotateY(-90).translate([ribThick/2,0,0]);
	      result=result.union(rib);
	    }
	  }
   }	  

	
  if (AholeN>=1) {
    var Ahole=new CSG.cylinder({  start: [0, -Aholeh, 0],  end: [0, -Aholeh, Blen],  radius: AholeD/2 });
    if (AholeN==1) { result=result.subtract(Ahole); }
    else //>=2 
      {
        for(var i=0;i<AholeN;i++)
      		{
		result=result.subtract(Ahole.translate([Aholed/2-i*Aholed/(AholeN-1),0,0]));
		}	    
   
      }
  }
  

  if (BholeN>=1) {
    var Bhole=new CSG.cylinder({  start: [0, 0, Bholeh],  end: [0, -Alen, Bholeh],  radius: BholeD/2 });
    if (BholeN==1) { result=result.subtract(Bhole); }
    else //>=2 
      {
        for(var i=0;i<BholeN;i++)
      		{
		result=result.subtract(Bhole.translate([Bholed/2-i*Bholed/(BholeN-1),0,0]));
		}	    
   
      }
  }

  result=result.translate([0,10*Math.floor(Alen/20),0]);
  
  return [
    
     { name: "Angle_Bracket", caption: "Angle Bracket", data: result } 
   	];
}

