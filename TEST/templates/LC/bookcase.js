var ExamplesLinks=[
  'http://3ddoctors.net/templates/LC/bookcase.html?W=50&L=200&H=250&Tab=20&SR=50&SD=30&T=4&C=false'
  ,
  'http://3ddoctors.net/templates/LC/bookcase.html?W=50&L=200&H=250&Tab=20&SR=50&SD=30&T=4&C=true'
  ,
  'http://3ddoctors.net/templates/LC/bookcase.html?W=25&L=200&H=120&Tab=20&SR=20&SD=-4&T=3&C=false'
  ,
  'http://3ddoctors.net/templates/LC/bookcase.html?W=25&L=200&H=120&Tab=20&SR=150&SD=120&T=3&C=true'
  ]


function main()
{  
  var w = Number(document.getElementById('W').value); // inner width
  var l = Number(document.getElementById('L').value); // inner length
  var h = Number(document.getElementById('H').value); // inner height
  var t = Number(document.getElementById('T').value); // thickness
  var sr = Number(document.getElementById('SR').value); // slot radius
  var sd = Number(document.getElementById('SD').value); // slot circle distance from edge
  var tab = Number(document.getElementById('Tab').value); // approximate tab size
  var c = Boolean(document.getElementById('C').checked);;

h = h+t+t/2;
var nSegW = Math.floor(w/2/tab)*2+1;
var nSegL = Math.floor(l/2/tab)*2+1;
var nSegH = Math.floor(h/2/tab)*2+1;

base = new CSG.Path2D([[0,0]]);
base = base.concat(tabs(nSegL,l/nSegL,t,-1,base.points[base.points.length-1],0));
base = base.concat(tabs(nSegW,w/nSegW,t,-1,base.points[base.points.length-1],270));
base = base.concat(tabs(nSegL,l/nSegL,t,-1,base.points[base.points.length-1],180));
base = base.concat(tabs(nSegW,w/nSegW,t,-1,base.points[base.points.length-1],90));
base = base.close();
base = base.innerToCAG();
base = base.center();
base = base.extrude({offset:[0,0,t]});
base = base.yellow1();

if (sr!=0) {
  slot = new CSG.cylinder({start:[0,-w,h+sd], end: [0,w,h+sd],radius:sr});
}
else {
  slot = [];
}



lWall = new CSG.Path2D([[0,0],[l,0]]);
lWall = lWall.concat(tabs(nSegH,h/nSegH,t,1,lWall.points[lWall.points.length-1],90));
lWall = lWall.appendPoint([0,h]);
lWall = lWall.concat(tabs(nSegH,h/nSegH,t,1,lWall.points[lWall.points.length-1],270));
lWall = lWall.appendPoint([0,0]);
lWall = lWall.close();
lWall = lWall.innerToCAG();
lWall = lWall.center();

if (c) {
  var circ = circles(10,0,l,0,h-sr+sd-10);
  var lWall1 = lWall.subtract(circ);
  lWall1 = lWall1.extrude({offset:[0,0,t]});
}
else {
  var lWall1 = lWall.extrude({offset:[0,0,t]});;
}
lWall1 = lWall1.rotateX(90);
lWall1 = lWall1.yellow2();
lWall1 = lWall1.translate([0,w/2+t,h/2-t/2]);
lWall1 = lWall1.subtract(base);
lWall1 = lWall1.subtract(slot);

if (c) {
  circ = circles(10,0,l,0,h-sr+sd-10);
  var lWall2 = lWall.subtract(circ);
}
else {
  var lWall2 = lWall;
}

lWall2 = lWall2.extrude({offset:[0,0,t]});
lWall2 = lWall2.rotateX(90);
lWall2 = lWall2.yellow2();
lWall2 = lWall2.translate([0,-(w/2),h/2-t/2]);
lWall2 = lWall2.subtract(base);
lWall2 = lWall2.subtract(slot);

wWall = new CAG.rectangle({radius: [w/2+t,h/2]});
wWall = wWall.center();
wWall = wWall.extrude({offset:[0,0,t]});
wWall = wWall.rotateX(90).rotateZ(90);
wWall = wWall.yellow3();
wWall = wWall.subtract(slot);
wWall1 = wWall.translate([l/2,0,h/2-t/2]);
wWall1 = wWall1.subtract([slot,base,lWall1,lWall2]);
wWall2 = wWall.translate([-(l/2+t),0,h/2-t/2]);
wWall2 = wWall2.subtract([slot,base,lWall1,lWall2]);

base2D = new CAG.fromCSG(base);
lWall12D = new CAG.fromCSG(lWall1);
lWall22D = new CAG.fromCSG(lWall2);
wWall2D = new CAG.fromCSG(wWall1);



var col = new CAG.col([base2D,wWall2D,wWall2D,lWall12D,lWall22D],0.01); 
// var row2 = new CAG.row([base2D,rings2D],3);
// var row2 = new CAG.row([row1,row2],-30);
var result2D = col;
var result3D = base.union([lWall1,lWall2,wWall1,wWall2]);
  return [ { name: "Assembled", caption: "Assembled", data: result3D } ,{ name: "2D plans", caption: "2D plans", data: result2D } ];
// return [{ name: "Assembled", caption: "Assembled", data: result2D }]
  
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

  function circles(n,xMin,xMax,yMin,yMax) { // create n random non-intersecting circles in the designated range.
    var center = [];
    var radii = [];
    var minDistance = [];
    var growth = [];
    var growthSum;
    var space = 12;
    var radMin = 4;
    var radMax = 50;
    for (var i=0;i<n;i++) {
      var randX = Math.random();
      var randY = Math.random();
      center.push(new CSG.Vector2D([Math.floor(randX*(xMax-xMin)),Math.floor(randY*(yMax-yMin))]));
      radii[i] = 0;
      growth[i] = Math.random()*4;       
      minDistance[i] = Math.min(center[i].x-xMin-space-radii[i], xMax-center[i].x-space-radii[i], center[i].y-yMin-space-radii[i], yMax-center[i].y-space-radii[i]);
    }
    while (Math.max.apply(Math, growth)>0) {
      for (var i=0;i<n;i++) {
        minDistance[i] = Math.min(center[i].x-xMin-space-radii[i], xMax-center[i].x-space-radii[i], center[i].y-yMin-space-radii[i], yMax-center[i].y-space-radii[i]);
        if (minDistance[i]<0 || radii[i]>radMax) {
          growth[i] = 0;
        }
        for (var j=0;j<n;j++) {
          if (j!=i && center[i].distanceTo(center[j])-radii[i]-radii[j]-space < minDistance[i]) {
            minDistance[i] = center[i].distanceTo(center[j])-radii[i]-radii[j]-space;
            if (minDistance[i]<0) {
              growth[i] = 0;
            }
          }
        }
      radii[i] += growth[i];
      }
    }
    result = new CAG;
    for (i=0;i<n;i++){
      if (radii[i]>radMin) {
        result = result.union(new CAG.circle({center:center[i],radius:radii[i]}));
      }
    }
    return result.center();
  }

