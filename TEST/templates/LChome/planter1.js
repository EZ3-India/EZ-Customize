
function main()
{  
  var diameter = Number(document.getElementById('sizeD').value);
  // var w = Number(document.getElementById('sizeW').value);
  var length = Number(document.getElementById('sizeH').value);
  var t = Number(document.getElementById('sizeT').value); // thickness
  // var diameter = 100;
  // var length = 310;
  // var t = 3.8;
  var n = 6; // number of segments
  var angle = 215; // degrees to span
  var a = 2*3.1415*angle/360;
  var lfactor = 1.03;
  var dfactor = 1.25;
  var d = dfactor*diameter;
  var l = lfactor*length;
  var tn = 1;

  // make basic rung shape
  var width = Math.PI*d*1.*angle/360/n;//2*d*Math.sin(a/(2*n));//
var path = new CSG.Path2D([[0,width/2]]);
path = path.appendVec([[l/2,0],[0,-width/4],[t,0],[0,-width/2],[-t,0],[0,-width/4],[-l/2,0]]);
path = path.close();
var cag = path.innerToCAG();
cag = cag.union(cag.mirroredX());
var rung = cag.extrude({offset:[0,0,t]}).rotateY(90).translate([d/2,0,0]);
rung0 = rung.setColor(0.9,0.7,0.3);
rung1 = rung0.translate([0,0,0]).rotateZ(-1.1*angle/n);
rung2 = rung1.translate([1.6*t,t,0]).rotateZ(-1*angle/n);
rung3 = rung2.translate([1.6*t,t,0]).rotateZ(-1*angle/n);

var rungs = rung1.union([rung2,rung3]);
rungs = rungs.translate([0,0.1*d,0]); // increase space undeneath
rungs = rungs.union(rungs.mirroredY());

// make base


var base = rungs.projectToOrthoNormalBasis(CSG.OrthoNormalBasis.GetCartesian("X","Y"));
var fill = CAG.circle({center: [0,0], radius: d/2, resolution: 32}); 
fill = fill.subtract(CAG.rectangle({center:[-0.7*d,0], radius:[d/2,d/2]})) // upper space
fill = fill.subtract(CAG.rectangle({center:[0.1*d,0], radius:[d/12,d]}).contract(5).expand(5)); // handle
fill = fill.subtract(CAG.rectangle({center:[0.1*d,0], radius:[d/6,t]}).contract(2).expand(2)); // handle

base = base.expand(d/10,6);
base = base.union(fill);
base = base.expand(3).contract(3);
base = base.extrude({offset:[0,0,t]}).translate([0,0,l/2]);
base = base.subtract(rungs);

var bases = base.union(base.mirroredZ());
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
    flats = flats.translate([0,-flats.getBounds()[1].y]);
    // newflat = new CAG.fromCSG(shapes[i]);
    newflat = shapes[i].lieFlat().projectToOrthoNormalBasis(CSG.OrthoNormalBasis.GetCartesian("X","Y"));
    flats = flats.union(newflat.translate([0,-newflat.getBounds()[0].y+0.01]));
  }
  flats = flats.translate([Math.abs(flats.getBounds()[0].y)/2,0])
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
  
  
 