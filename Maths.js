

// Thanks StackOverflow!
// https://stackoverflow.com/a/12251083/931280
// Using fast version just in case, better explained version is on the answer above
function checkCircleOverlap(x1,y1,radius1,x2,y2,radius2) {
  var diffx = x2 - x1;
  var diffy = y2 - y1;

  var Dsqr = diffx*diffx + diffy*diffy;
  var rdiff = Math.abs(radius1-radius2);
  var rsum = radius1+radius2;
  
  if (rdiff*rdiff < Dsqr && Dsqr < rsum*rsum) {
    return OVERLAP_PARTIAL;
  } else if (Dsqr <= rdiff*rdiff) {
    return OVERLAP_FULL;
  } else {
    return OVERLAP_NONE;
  }
}


// How far will an object go assuming the same heading and speed?
function Displacement(x, y, heading, speed, elapsedTimeInMs) {
  // Formula are tested in Tests.js in TestSpeedEqualRegardlessOfOrientation()
  var x2 = x + (elapsedTimeInMs/1000)*speed*Math.sin((heading/360)*(2*Math.PI));
  var y2 = y + (elapsedTimeInMs/1000)*speed*Math.cos((heading/360)*(2*Math.PI));
  return [x2, y2];
}


// Check for collision with side of map
// Do simple center of object check
function CollideEdgeOfMap(canvasWidth, canvasHeight, x, y) {
  if (x < 0 || x > canvasWidth ||
      y < 0 || y > canvasHeight) {
    return true;
  } else {
    return false;
  }
}