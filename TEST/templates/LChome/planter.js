
function main()
{  
  // var d = Number(document.getElementById('sizeD').value);
  // var w = Number(document.getElementById('sizeW').value);
  // var h = Number(document.getElementById('sizeH').value);
  // var t = Number(document.getElementById('sizeT').value); // thickness
  var diameter = 95;
  var length = 310;
  var t = 3.5;
  var n = 6; // number of segments
  var angle = 200; // degrees to span
  var a = 2*3.1415*angle/360;
  var lfactor = 1.1;
  var dfactor = 1.1;
  var d = dfactor*diameter;
  var l = lfactor*length;
  var tn = 1;

  // make basic rung shape
  var width = Math.PI*d*angle/360/n;//2*d*Math.sin(a/(2*n));//
var path = new CSG.Path2D([[0,width/2]]);
path = path.appendVec([[l/2,0],[0,-width/4],[t,0],[0,-width/2],[-t,0],[0,-width/4],[-l/2,0]]);
path = path.close();
var CAG = path.innerToCAG();
CAG = CAG.union(CAG.mirroredX());
var rung = CAG.extrude({offset:[0,0,t]}).rotateY(90).translate([d/2,0,0]);
var rungs = rung;
for(var i=0;i<n;i++)
{
  rungs = rungs.union(rung.rotateZ(-(i+1)*angle/n));
  // x = (t+width/2)*Math.sin(i*a),-(t+width/2)*Math.cos(i*a),0])
  // rungs = rungs.union(rung.rotateZ(i*angle).translate([(t+width/2)*Math.sin(i*a),-(t+width/2)*Math.cos(i*a),0]));

}
rungs = rungs.rotateZ((angle-180)/2);

// make base
var base = new CSG.cylinder({
      start: [0, 0, l/2],
      end: [0, 0, l/2+t],
      radius: d/2+2*t,
      resolution: 40
    });
base = base.subtract(rungs);
var bases = base.union(base.rotateY(180));
// document.getElementById('debugtxt').innerHTML = "tabs = " + flats;
  var result3D = rungs.union(bases);
  var result2D = prepDXF([rung,rung,rung,rung,rung,rung,rung,base,base]);
  return [ { name: "Assembled", caption: "Assembled", data: result3D }, { name: "2D plans", caption: "2D plans", data: result2D } ];
  // return [ { name: "2D plans", caption: "2D plans", data: result2D } ];

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
  // var flats = new CAG.fromCSG(shapes[0]);
  var flats = shapes[0].projectToOrthoNormalBasis(CSG.OrthoNormalBasis.GetCartesian("X","Y"));
  for(var i=1;i<shapes.length;i++)
  {
    flats = flats.translate([-1*flats.getBounds()[1].x-4,0]);
    // newflat = new CAG.fromCSG(shapes[i]);
    newflat = shapes[i].lieFlat().projectToOrthoNormalBasis(CSG.OrthoNormalBasis.GetCartesian("X","Y"));
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
  
  
 