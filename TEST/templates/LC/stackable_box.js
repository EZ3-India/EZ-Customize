var ExamplesLinks=[
  'http://3ddoctors.net/templates/LC/stackable_box.html?sizeW=250&sizeTNW=4&sizeD=150&sizeTND=3&sizeH=80&sizeTNH=2&sizeT=3&brace=true&stackable=true'
  ,
  'http://3ddoctors.net/templates/LC/stackable_box.html?sizeW=150&sizeTNW=4&sizeD=150&sizeTND=3&sizeH=60&sizeTNH=2&sizeT=3&brace=true&stackable=false'
  ,
  'http://3ddoctors.net/templates/LC/stackable_box.html?sizeW=280&sizeTNW=4&sizeD=180&sizeTND=3&sizeH=35&sizeTNH=2&sizeT=3.7&brace=true&stackable=true'
  ,
  'http://3ddoctors.net/templates/LC/stackable_box.html?sizeW=120&sizeTNW=4&sizeD=60&sizeTND=3&sizeH=120&sizeTNH=5&sizeT=3.7&brace=false&stackable=false'
  ]

function main()
{  
  var d = Number(document.getElementById('sizeD').value);
  var w = Number(document.getElementById('sizeW').value);
  var h = Number(document.getElementById('sizeH').value);
  var t = Number(document.getElementById('sizeT').value); // thickness
  
  var tnw = 2*Number(document.getElementById('sizeTNW').value)+1; // currently only odd numbers work here.
  var tnd = 2*Number(document.getElementById('sizeTND').value)+1;
  var tnh = 2*Number(document.getElementById('sizeTNH').value)+1;
  var brace = Boolean(document.getElementById('brace').checked);
  var stackable = Boolean(document.getElementById('stackable').checked);;
  var shape = [];

  var dummy = new CSG.cube().translate([-1000,-1000,-1000]);
  var distFromCorner = 0.2*Math.min(w,d);

// make bracing
if(brace==true)
{
  var l = Math.sqrt(2)*distFromCorner;
  l = l+4*t;
  shape[5] = new CSG.Path2D([[2*t,distFromCorner-t]]);
  shape[5] = shape[5].appendVec([[-t,0],[0,t],[-t,0],[0,-t],[-t,0],[0,3*t],[t,0],[0,-t],[t,0],[0,t],[t,0]]);
  shape[5] = shape[5].appendPoint([distFromCorner+2*t,2*t]);
  shape[5] = shape[5].appendVec([[0,-t],[-t,0],[0,-t],[t,0],[0,-t],[-3*t,0],[0,t],[t,0],[0,t],[-t,0],[0,t]]);
  shape[5] = shape[5].appendPoint([2*t,distFromCorner-t]);
  shape[5] = shape[5].close();
  shape[5] = shape[5].innerToCAG();
  shape[5] = shape[5].extrude({offset:[0,0,-t]});
  shape[5] = shape[5].yellow1();
  shape[5] = shape[5].subtract(dummy); // prevent some strange problems with toDXF..
  shape[6] = shape[5].rotateZ(270).translate([-t,t,h-t]);
  shape[7] = shape[5].rotateZ(90).translate([w+t,-d-t,h-t]);
  shape[8] = shape[5].rotateZ(180).translate([w+t,t,h-t]);
  shape[5] = shape[5].translate([-t,-d-t,h-t]);

}
// make bottom
  
  shape[0] = tabs(tnw,w/tnw,t,-1,[0,0],0);
  shape[0] = shape[0].concat(tabs(tnd,d/tnd,t,-1,shape[0].points[shape[0].points.length-1],-90));
  shape[0] = shape[0].concat(tabs(tnw,w/tnw,t,-1,shape[0].points[shape[0].points.length-1],-180));
  shape[0] = shape[0].concat(tabs(tnd,d/tnd,t,-1,shape[0].points[shape[0].points.length-1],-270));
  shape[0] = shape[0].close();
  shape[0] = shape[0].innerToCAG();
  shape[0] = shape[0].extrude({offset:[0,0,t]});
  shape[0] = shape[0].yellow1();
  shape[0] = shape[0].subtract(dummy); // prevent some strange problem with toDXF..

  
// make sides
  shape[1] = tabs(tnh,h/tnh,t,-1,[0,0],-90);
  if (stackable)
  {
    shape[1] = shape[1].appendVec([[0,-t],[2/3*distFromCorner-t,0],[t,t],[w+2*t-2*(2/3*distFromCorner),0],[t,-t],[2/3*distFromCorner-t,0],[0,t]]);

  }
  else 
  {
    shape[1] = shape[1].appendVec([[w+2*t,0]]);  
  } 
  shape[1] = shape[1].concat(tabs(tnh,h/tnh,t,-1*((tnh&1)*2-1),shape[1].points[shape[1].points.length-1],90));
  shape[1] = shape[1].close();
  shape[1] = shape[1].innerToCAG();
  shape[1] = shape[1].extrude({offset:[0,0,t]});
  shape[1] = shape[1].rotateX(90);
  shape[1] = shape[1].translate([-t,t,h-t]);
  shape[1] = shape[1].subtract([shape[1].translate([0,0,h]),shape[0]]);
  if (brace)
  {
    shape[1] = shape[1].subtract([shape[5],shape[6],shape[7],shape[8]]);
  }
  shape[1] = shape[1].yellow2();
  shape[2] = shape[1].translate([0,-d-t,0]);

  if (stackable)
  {
    shape[3] = new CSG.Path2D([[0,0],[0,h],[d+2*t,h],[d+2*t,0]]);
    shape[3] = shape[3].appendVec([[0,-t],[-(2/3*distFromCorner-t),0],[-t,t],[-(d+2*t-2*(2/3*distFromCorner)),0],[-t,-t],[-2/3*distFromCorner+t,0]]);
    // document.getElementById('debugtxt').innerHTML = "tabs = " + shape[3].points;
  }
  else
  {
    shape[3] = new CSG.Path2D([[0,0],[0,h],[d+2*t,h],[d+2*t,0]]);  
  }
  shape[3] = shape[3].close();
  shape[3] = shape[3].innerToCAG();
  shape[3] = shape[3].extrude({offset:[0,0,t]});
  shape[3] = shape[3].rotateX(90).rotateZ(90);
  shape[3] = shape[3].translate([-t,-d-t,-t]);
  shape[3] = shape[3].subtract([shape[3].translate([0,0,h]),shape[0],shape[1],shape[2]]);
  if (brace)
  {
    shape[3] = shape[3].subtract([shape[5],shape[6],shape[7],shape[8]]);
  }
  shape[3] = shape[3].yellow3();
  shape[4] = shape[3].translate([w+t,0,0]);

  var result3D = shape[0].union(shape);
  result3D = result3D.translate([-0.5*shape[0].getBounds()[1].x,-0.5*shape[0].getBounds()[0].y])  
  var flats = prepDXF(shape);
// document.getElementById('debugtxt').innerHTML = "tabs = " + flats;
  var result2D = flats;
  return [ { name: "Assembled", caption: "Assembled", data: result3D }, { name: "2D plans", caption: "2D plans", data: result2D } ];
  // return [ { name: "2D plans", caption: "2D plans", data: result3D } ];

}

function tabs(nSegment,sLength,thickness,sign,startPoint,angle) 
  {
    var out = new CSG.Path2D([[0,0]]);
    for(var i=0;i<nSegment-1;i++) {
      out = out.appendVec([[sLength,0],[0,sign*thickness*((i&1)*2-1)]]);
    }
    out = out.appendVec([[sLength,0]]);
    out = out.rotateZ(angle);
    out = out.translate(startPoint);
    
    return out;
  }

function cutAll(shape)
  {
    var newshape = shape;
    for(var i=0; i<shape.length;i++)
    {
      for(var j=0;j<shape.length;j++)
      {
        if(i!=j)
        {
          newshape[i] = newshape[i].subtract(shape[j]);
        }
      }
    
      
    }
    return newshape;
  }

// function joinAll(shape)
// {
//   var newshape = shape;
//   for(var i=0; i<shape.length;i++)
//     {
//       for(var j=0;j<shape.length;j++)
//       {
//         if(i!=j)
//         {
//           newshape[i] = newshape[i].union(shape[j]);
//           // document.getElementById('debugtxt').innerHTML = "tabs = " + i;
//         }
//       }
//       // document.getElementById('debugtxt').innerHTML = "tabs = " + i;
      
//     }
//     return newshape;
//   }
// }

function prepDXF(shapes)
{
  var flats = new CAG.fromCSG(shapes[0]);
  for(var i=1;i<shapes.length;i++)
  {
    flats = flats.translate([-1*flats.getBounds()[1].x-4,0]);
    newflat = new CAG.fromCSG(shapes[i]);
    flats = flats.union(newflat.translate([newflat.getBounds()[1].x,0]));
  }
  flats = flats.translate([Math.abs(flats.getBounds()[0].x)/2,0])
  return flats;
}
 // clip = clip.appendVec([[l/2+3*t,0],[0,-h+2*t],[-l/4-3*t,0],[0,-t],[-t,-t],[-Math.abs(l/2-2*t),0],[-t,t],[0,t],[-l/4-3*t,0],[0,h-2*t]]);
  // clip = clip.close();
  // clip = clip.innerToCAG();
  // clip = clip.extrude({offset:[0,0,-t]});
  // clip = clip.setColor(0.7,0,0.3);
  // clip = clip.rotateX(90).rotateZ(45);
  // clip = clip.translate([distFromCorner,-distFromCorner,h-t]);
  // clip1 = clip.translate([w-1.41*t-distFromCorner,-d+1.41*t+distFromCorner,0]);
  
  
 