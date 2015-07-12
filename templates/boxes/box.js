
function main()
{  
  var d = Number(document.getElementById('sizeD').value);
  var w = Number(document.getElementById('sizeW').value);
  var h = Number(document.getElementById('sizeH').value);
  var t = Number(document.getElementById('sizeT').value); // thickness

// make lid
  var lidright = new CSG.Path2D([[0,t],[0.1*w,t],[0.1*w,0],[0,0],[0,-2*t],[0.25*w-t,-2*t]]);
  var arc = new CSG.Path2D.arc({center:[0.25*w-t,-t], radius: t, startangle: 270, endangle: 360});
  lidright = lidright.concat(arc);
  lidright = lidright.concat(new CSG.Path2D([[0.25*w,-t],[0.25*w,0],[0.5*w,0],[0.5*w,d-4*t],[0.5*w-t,d-4*t],[0.5*w-t,d-2.5*t],[0.5*w,d-2.5*t],[0.5*w,d-1.5*t],[0.5*w-t,d-1.5*t],[0.5*w-t,d-t],[0,d-t]]));
  lidright = lidright.close();  
  var lidleft = lidright.mirroredX();
  lidright = lidright.innerToCAG();
  lidleft = lidleft.innerToCAG();
  var lid = lidleft.union(lidright);
  lid = lid.translate(lid.getBounds()[0].negated());

// make bottom
  var bottomQ = new CSG.Path2D([[0,-0.5*d+t],[-w/6,-0.5*d+t],[-w/6,-0.5*d],[-w/3,-0.5*d],[-w/3,-0.5*d+t],[-w/2+t,-d/2+t],[-w/2+t,-d/3],[-w/2,-d/3],[-w/2,-d/6],[-w/2+t,-d/6],[-w/2+t,0],[0,0]]);
  bottomQ = bottomQ.close();
  bottomQ = bottomQ.innerToCAG();
  bottomH = bottomQ.union(bottomQ.mirroredX());
  bottom = bottomH.union(bottomH.mirroredY());
  bottom = bottom.translate(bottom.getBounds()[0].negated());

// make front
  var frontright = new CSG.Path2D([[0,0],[w/6,0],[w/6,t],[w/3,t],[w/3,0],[w/2-t,0],[w/2-t,h/3],[w/2,h/3],[w/2,h*2/3],[w/2-t,h*2/3],[w/2-t,h],[w/10,h],[w/10,1.0*h+2*t]]);
  var arc = new CSG.Path2D.arc({center:[w/10-t,1.0*h+2*t], radius: t, startangle: 0, endangle: 90});
  frontright = frontright.concat(arc);
  frontright = frontright.concat(new CSG.Path2D([[w/10-t,1.0*h+(3*t)],[0,1.0*h+(3*t)],[0,1.0*h+(2*t)],[t/2,1.0*h+(2*t)],[t/2,1.0*h+t],[0,1.0*h+t]]));
  frontright = frontright.close();
  frontright = frontright.innerToCAG();
  front = frontright.union(frontright.mirroredX());
  front = front.translate(front.getBounds()[0].negated());

// make sides
  var sideleft = new CSG.Path2D([[0,0],[d/6,0],[d/6,t],[d/3,t],[d/3,0],[d/2,0],[d/2,h/3],[d/2-t,h/3],[d/2-t,h*2/3],[d/2,h*2/3],[d/2,h],[-d/2+4*t,h]]);
  var arc = new CSG.Path2D.arc({center:[-d/2+2*t,1.0*h+t/2], radius: 2*t, startangle: 0, endangle: 90});
  sideleft = sideleft.concat(arc);
  sideleft = sideleft.concat(new CSG.Path2D([[-d/2+t,1.0*h+(2.5*t)]]));
  arc = new CSG.Path2D.arc({center:[-d/2+t,1.0*h+1.5*t], radius: t, startangle: 90, endangle: 180});
  sideleft = sideleft.concat(arc);
  sideleft = sideleft.concat(new CSG.Path2D([[-d/2,1.0*h+1.5*t],[-d/2,h*2/3],[-d/2+t,h*2/3],[-d/2+t,h/3],[-d/2,h/3],[-d/2,0],[-d/3,0],[-d/3,t],[-d/6,t],[-d/6,0],[0,0]]));
  sideleft = sideleft.close();
  sideleft = sideleft.innerToCAG();
  
  var hole = new CAG.circle({center: [-d/2+2*t,1*h+t/2], radius: 1.41*t/2});

  sideleft = sideleft.subtract(hole);
  sideright = sideleft.mirroredY();
  sideleft = sideleft.translate(sideleft.getBounds()[0].negated());
  sideright = sideright.translate(sideright.getBounds()[0].negated());

// make rear
  var rearH = new CSG.Path2D([[0,0],[w/6,0],[w/6,t],[w/3,t],[w/3,0],[w/2-t,0],[w/2-t,h/3],[w/2,h/3],[w/2,h*2/3],[w/2-t,h*2/3],[w/2-t,h],[0,h],[0,0]]);
  rearH = rearH.close();
  rearH = rearH.innerToCAG();
  rear = rearH.union(rearH.mirroredX());
  rear = rear.translate(rear.getBounds()[0].negated());
   

  var line1 = bottom;
  line1 = line1.union(lid.translate([line1.getBounds()[1].x + t, 0]));
  line1 = line1.union(rear.translate([line1.getBounds()[1].x + t, 0]));
  var line2 = front;
  line2 = line2.union(sideright.translate([line2.getBounds()[1].x + t,0]));
  line2 = line2.union(sideleft.translate([line2.getBounds()[1].x + t, 0]));
  
  result2D = line1.union(line2.translate([0,line1.getBounds()[1].y + t]));
  //document.getElementById('debugtxt').innerHTML = "for DXF scaling: \nBounds of figure (mm) = " + result2D.getBounds();
  result2D = result2D.translate([-0.5*result2D.getBounds()[1].x, -0.5*result2D.getBounds()[1].y,0]);
  
  // make solid
  var Slid = lid.extrude({offset:[0,0,t]});
  Slid = Slid.translate([0,-2*t,h]);
  var Sbottom = bottom.extrude({offset:[0,0,t]});
  Sbottom = Sbottom.union(Slid);
  var Sleft = sideleft.extrude({offset:[0,0,t]});
  Sleft = Sleft.rotateX(90).rotateZ(-90).translate([t,d,0]);
  Sright = Sleft.translate([w-t,0,0]);
  Sleft = Sleft.union([Sbottom,Sright]);
  var Sfront = front.extrude({offset:[0,0,t]});
  Sfront = Sfront.rotateX(90).translate([0,t,0]);
  Sfront = Sfront.union(Sleft);
  var Srear = rear.extrude({offset:[0,0,t]});
  Srear = Srear.rotateX(90).translate([0,d,0]);
  Sfront = Sfront.union(Srear);
  result3D = Sfront.translate([-w/2,-d/2,0]);

  return [ { name: "Assembled", caption: "Assembled", data: result3D }, { name: "2D plans", caption: "2D plans", data: result2D } ];
}
