function RunTests() {
  TestOverlap();
  TestSpeedEqualRegardlessOfOrientation();
  TestDisplacement();
  TestCalcHeading();
  TestMapDistanceToEdgeLocation();
  TestCloneChoppers();
  TestWaypointsUnshift();
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

function TestDisplacement() {
  var x = 0;
  var y = 0;
  var heading = 0;
  var speed = 100/1000; // in pixels / ms
  var elapsedTimeInMs = 1000;
  
  var result = new Waypoint(Displacement(x, y, heading, speed, elapsedTimeInMs));
  console.assert(result.x == 0 && result.y == -100);
  heading = 180;
  result = new Waypoint(Displacement(x, y, heading, speed, elapsedTimeInMs));
  console.assert(result.x.toFixed(2) == 0 && result.y == 100);
  heading = 270;
  result = new Waypoint(Displacement(x, y, heading, speed, elapsedTimeInMs));
  console.assert(result.x == -100 && result.y.toFixed(2) == 0);
}



// Helper function for TestSpeedEqualRegardlessOfOrientation()
function MoveAndTest(c) {
  var timeElapsed = 50; //ms
  var distance = 0;
  var distanceExpected = timeElapsed*CHOPPER_SPEED;
  
  
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

function TestCalcHeading() {
  // "Computer" coordinate system!
  console.assert(CalcHeading(0,0,0,1) == 180);
  console.assert(CalcHeading(0,0,-1,0) == 270);
  console.assert(CalcHeading(0,0,0,-1) == 0);
  console.assert(CalcHeading(0,0,1, 0) == 90);
  
  // 45 degree offsets
  console.assert(CalcHeading(0,0,1,1) == 135);
  console.assert(CalcHeading(0,0,1,-1) == 45);
  console.assert(CalcHeading(0,0,-1,-1) == 315);
  console.assert(CalcHeading(0,0,-1,1) == 225);
}

function TestMapDistanceToEdgeLocation() {
  var result = new Waypoint(MapDistanceToEdgeLocation(0, 400, 400));
  console.assert(result.x == 0 && result.y == 0);
  result = new Waypoint(MapDistanceToEdgeLocation(399, 400, 400));
  console.assert(result.x == 399 && result.y == 0);
  result = new Waypoint(MapDistanceToEdgeLocation(401, 400, 400));
  console.assert(result.x == 400 && result.y == 1);
  result = new Waypoint(MapDistanceToEdgeLocation(801, 400, 400));
  console.assert(result.x == 399 && result.y == 400);
  result = new Waypoint(MapDistanceToEdgeLocation(1201, 400, 400));
  console.assert(result.x == 0 && result.y == 399);
  result = new Waypoint(MapDistanceToEdgeLocation(1599, 400, 400));
  console.assert(result.x == 0 && result.y == 1);
  result = new Waypoint(MapDistanceToEdgeLocation(1600, 400, 400));
  console.assert(result.x == 0 && result.y == 0);
}



function TestCloneChoppers() {
  var choppers = [];
  var i = 0;
  choppers.push(new Chopper(0, 1, 2));
  choppers.push(new Chopper(3, 4, 5));
  
  var chopperClones = [];
  CloneChoppers(chopperClones, choppers);
  
  // Make sure the new clones have the same values as original at start,
  // but after moving make sure they're different values
  for (i = 0; i < chopperClones.length; i++) {
    // Assert same values
    console.assert(chopperClones[i].x == choppers[i].x);
    console.assert(chopperClones[i].y == choppers[i].y);
    console.assert(chopperClones[i].heading == choppers[i].heading);
    // But make sure "==" compares references not values
    console.assert(chopperClones[i] != choppers[i]);
    // Move
    chopperClones[i].move(1000);
    // Assert different values
    console.assert(chopperClones[i].x != choppers[i].x);
    console.assert(chopperClones[i].y != choppers[i].y);
    // Actually, heading should stay the same!
    console.assert(chopperClones[i].heading == choppers[i].heading);
    // References to self should match though
    console.assert(chopperClones[i] == chopperClones[i]);
  }
}

function TestWaypointsUnshift() {
  var waypoints = [];
  waypoints.unshift(new Waypoint([5,6]));
  console.assert(waypoints[0].x == 5 && waypoints[0].y == 6);
  waypoints.unshift(new Waypoint(Displacement(1,2,3,4,0)));
  console.assert(waypoints[0].x == 1 && waypoints[0].y == 2);
  
  console.assert(waypoints.length == 2);
}
