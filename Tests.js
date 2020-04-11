function RunTests() {
  TestOverlap();
  TestSpeedEqualRegardlessOfOrientation();
}

// Test if overlap detection works properly
// x, y, radius
function TestOverlap() {
  var result = 0;
  result = checkCircleOverlap(0,0,25, 0,0,5);
  console.assert(result==OVERLAP_FULL);
  result = checkCircleOverlap(0,0,25, 0,0,50);
  console.assert(result==OVERLAP_FULL);
  result = checkCircleOverlap(0,0,25, 100,0,50);
  console.assert(result==OVERLAP_NONE);
  result = checkCircleOverlap(100 - (50 + 25 + .001),0,25, 100,0,50);
  console.assert(result==OVERLAP_NONE);
  result = checkCircleOverlap(100 - (50 + 25 -.001),0,25, 100,0,50);
  console.assert(result==OVERLAP_PARTIAL);
  result = checkCircleOverlap(100 - (25 + .001),0,25, 100,0,50);
  console.assert(result==OVERLAP_PARTIAL);
  result = checkCircleOverlap(100 - (25 - .001),0,25, 100,0,50);
  console.assert(result==OVERLAP_FULL);
  
  // Test Y too?
}


function MoveAndTest(c) {
  var timeElapsed = 50; //ms
  var distance = 0;
  var distanceExpected = (timeElapsed/1000)*CHOPPER_SPEED;
  
  
  c.move(timeElapsed); // ms
  //^ == bitwise XOR ... booo Javsacript
  // Glad I unit tested it!
  //distance = Math.sqrt(c.x^2 + c.y^2);
  distance = Math.sqrt(c.x * c.x + c.y * c.y);
  console.assert(distance == distanceExpected);
}

// 
function TestSpeedEqualRegardlessOfOrientation() {
  // x, y, heading (degrees) 
  MoveAndTest(new Chopper(0,0, 0));
  MoveAndTest(new Chopper(0,0, 30));
  MoveAndTest(new Chopper(0,0, 45));
  MoveAndTest(new Chopper(0,0, 90));
  MoveAndTest(new Chopper(0,0, 205));
}

function TestCollision() {


}