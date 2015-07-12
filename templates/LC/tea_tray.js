

function main()
{
  var r = Number(document.getElementById('sizeR').value)/2;
  var h = Number(document.getElementById('sizeH').value);
  var t = Number(document.getElementById('sizeT').value); // thickness

var base = new CSG.cylinder({
      start: [0, 0, 0],
      end: [0, 0, t],
      radius: r,
      resolution: 40
    });

var ring = new CSG.cylinder({
      start: [0, 0, t],
      end: [0, 0, 2*t],
      radius: r,
      resolution: 40
    });
ring = ring.subtract(new CSG.cylinder({
      start: [0, 0, t],
      end: [0, 0, 2*t],
      radius: 0.85*r,
      resolution: 40
}))

var smallRing = new CSG.cylinder({
      start: [0, 0, 0.89*h],
      end: [0, 0, 0.89*h+t],
      radius: r/4.3,
      resolution: 40
    });
var smallSmallRing = new CSG.cylinder({
      start: [0, 0, 0.89*h],
      end: [0, 0, 0.89*h+t],
      radius: r/8.5,
      resolution: 40
    });


// make side ribs
CSG.defaultResolution2D = 40;
var a = 0.3;
var path=new CSG.Path2D([[a*r,t],[a*r,0],[a*r+t,0]]);
path = path.appendBezier([[a*r+t,0],[1.3*a*r+t,-2*t],[-0.3*a,-2*t],[-t,0]]);
path = path.appendVec([[t,0],[0,2*t]]);
path = path.appendBezier([[0,2*t],[-0.3*r,0.4*h],[0,0.5*h],[0.55*r,0.7*h]]);
path = path.appendBezier([null,[0.7*r,0.9*h],[0.7*r,0.84*h]]);
path = path.appendBezier([null,[0.4*r,0.85*h],[r-t,1.1*h],[1*r-t,0.85*h]]);
path = path.appendVec([[0,-0.03*h]]);
path = path.appendBezier([null,[0.6*r,0.7*h],[0.2*r,0.5*h]]);
path = path.appendBezier([null,[a*r,t]]);

path = path.close();
var cag = path.innerToCAG();
var side = cag.extrude({offset:[0,0,t]}).rotateX(90).translate([-r+t,t/2,0]);
side = side.subtract(smallSmallRing);
side = side.setColor(1,0.1,0);
var sides = [side,side.rotateZ(120),side.rotateZ(240)];
smallRing = smallRing.subtract(sides);
// now can make a hole in small ring
smallRing = smallRing.subtract(new CSG.cylinder({
      start: [0, 0, 0.89*h],
      end: [0, 0 ,89*h+t],
      radius: 3,
      resolution: 40
}));

base = base.subtract(sides);
ring = ring.subtract(sides);
base = base.setColor(0.9,0.6,0);
smallRing = smallRing.setColor(0.9,0.6,0);
ring = ring.setColor(0.9,0.65,0);

base2D = new CAG.fromCSG(base);
rings2D = new CAG.fromCSG(ring);
rings2D = rings2D.union(new CAG.fromCSG(smallRing));
side2D = new CAG.fromCSG(side).translate([100,0,0]);
var result3D = base.union([smallRing,ring].concat(sides));
// document.getElementById('debugtxt').innerHTML = "tabs = " + smallRing.projectToOrthoNormalBasis(CSG.OrthoNormalBasis.GetCartesian("X","Y")) ;


var row1 = new CAG.row([side2D,side2D,side2D],-45);
var row2 = new CAG.row([base2D,rings2D],3);
var row2 = new CAG.row([row1,row2],-30);
var result2D = row2;
  return [ { name: "Assembled", caption: "Assembled", data: result3D } ,{ name: "2D plans", caption: "2D plans", data: result2D } ];


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
