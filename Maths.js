

class Waypoint {
  constructor([x,y]) {
    this.x = x;
    this.y = y;
  }
}
  

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
  // Invert cos value for "computer" coordinates
  var y2 = y + (elapsedTimeInMs/1000)*speed*(-1)*Math.cos((heading/360)*(2*Math.PI));
  return [x2, y2];
}

function CalcHeading(x1, y1, x2, y2) {
  var slope = -(y2 - y1) / (x2 - x1);
  // Domain of atan result is between our 0 and 180
  var atan_result_degrees = map(atan(slope), -Math.PI/2, Math.PI/2, 180, 0);
  // Need to account for 180 to 360 case
  if (x2 < x1) {
    var heading = atan_result_degrees + 180;
  } else {
    var heading = atan_result_degrees;
  }
  return heading;
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


// Maps distance along a perimeter to the coordinate of that perimeter point
function MapDistanceToEdgeLocation(distance, canvasWidth, canvasHeight) {
  var x,y;
  if (distance <= canvasWidth) {
    // Top edge
    x = distance;
    y = 0;
  } else if (distance <= canvasWidth + canvasHeight) {
    // Right edge
    x = canvasWidth;
    y = distance - canvasWidth;
  } else if (distance <= canvasWidth + canvasHeight + canvasWidth) {
    // Bottom edge
    x = canvasWidth - (distance - canvasWidth - canvasHeight);
    y = canvasHeight;
  } else if (distance <= canvasWidth + canvasHeight + canvasWidth + canvasHeight) {
    // Left edge
    x = 0; 
    y = canvasHeight - (distance - canvasWidth - canvasHeight - canvasWidth);
  } else {
    console.assert(false, "Not supposed to be here!");
  }
  return [x,y];
}
