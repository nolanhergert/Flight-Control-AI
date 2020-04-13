


// TODO: Apply performance tips? https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes
// Mostly just use min.js I think and avoid p5 online editor


var helipad;
var points;
var choppers;



const MIN_CHOPPER_ALIVE_TIME = 5; // seconds

const STARTING_TIME_BETWEEN_NEW_CHOPPERS = 5; // seconds
const TIME_UNTIL_APOCALYPSE = 30; // seconds
const RANGE_OF_SPAWN_TIME = .5; // seconds on either side

const FPS = 60;



// For checkCircleOverlap()
const OVERLAP_FULL = 0;
const OVERLAP_PARTIAL = 1;
const OVERLAP_NONE = 2;

var startTime = 0; // ms
var prevTime = startTime;
var currentTime = startTime;
var nextChopperTime = startTime;
const TIME_INCREMENT = 1000 / FPS; // ms

var UNSUCCESSFUL = false;

function preload() {
  RunTests();
}

function setup() {
  // Sets what version of randomness you'll get on this run
  // Change the seed, you'll get a completely different "roll of the dice"
  // Keep the seed the same, you'll get the exact same "roll of the dice" every time! Makes reproduction much easier
  randomSeed(0);
  
  window.canvas = createCanvas(400, 400);
  
  frameRate(FPS);
  choppers = [];
  
  helipad = new Helipad(canvas.width/2, canvas.height/2);
  points = 0;
}

function draw() {

  background(135, 206, 250);
  helipad.show();
  var index;
  
  
  /*
  if (UNSUCCESSFUL == true) {
    // Time stops
    //console.assert(false, "Unsuccessful");
    currentTime = prevTime;
  } else {
  */
  
  currentTime += TIME_INCREMENT;
  
  while(currentTime >= nextChopperTime) {
    // Add a new chopper!
    var c = CreateNewRandomChopper(canvas.width, canvas.height);
    // Start of AI stuff
    c.path([new Waypoint([canvas.height/2, canvas.width/2])]);
    choppers.push(c);
    
    // Spawn in decreasing intervals according to time since start of game
    var timeDiff = (currentTime - startTime);
    var lineValue = (-STARTING_TIME_BETWEEN_NEW_CHOPPERS/TIME_UNTIL_APOCALYPSE) * timeDiff/1000 + STARTING_TIME_BETWEEN_NEW_CHOPPERS;
    // Add a little randomness too
    var randomInterval = 1000*random(lineValue - RANGE_OF_SPAWN_TIME, lineValue + RANGE_OF_SPAWN_TIME);
    if (randomInterval < 0) {
      // Negative numbers don't work, just make it really small
      randomInterval = .01;
    }
    nextChopperTime = currentTime + randomInterval;
  }
  
  
  for (index = 0; index < choppers.length; index++) {
    choppers[index].move(currentTime - prevTime);
    choppers[index].show();
  }
  // Not sure whether to do this now or after collision detection...
  prevTime = currentTime;
  
  
  checkCollisions(choppers, helipad, canvas.width, canvas.height);
  
  // Remove choppers that landed
  // Does not work with <IE9. I think we'll be ok.
  choppers = choppers.filter(function(el) { return el.remove != true; });
  if (choppers.length == 0) {
    choppers.push(new Chopper(canvas.width/2, canvas.height/2-50));
  }
  textSize(20);
  text(points, canvas.width-25, 25);
}

function foo() {
  return true;
}

function CreateNewRandomChopper(canvasWidth, canvasHeight) {

  // Pick a spot some distance around the perimeter of the canvas
  // starting at the top left corner and going clockwise
  var distanceAroundEdgeOfCanvas = random(0, canvas.width*2+canvas.height*2);
  var x, y;
  var result = MapDistanceToEdgeLocation(distanceAroundEdgeOfCanvas, canvas.width, canvas.height);
  x = result[0];
  y = result[1];

  
  // All possible above positions are valid. However, only some headings from the
  // above positions are valid. Rather than come up with a universal math formula, I'm
  // going to express the result in the way I want and throw out answers that don't work.
  // Rule is: Give the user at least MIN_CHOPPER_ALIVE_TIME seconds to redirect the chopper
  // before it goes off the edge
  var x2, y2, heading;
  while (true) {
    heading = random(0, 360);
    var result = Displacement(x, y, heading, CHOPPER_SPEED, MIN_CHOPPER_ALIVE_TIME*1000);
    x2 = result[0];
    y2 = result[1];
    if (!CollideEdgeOfMap(canvas.width, canvas.height, x2, y2)) {
      break;
    }
  }
  return new Chopper(x, y, heading);
}

function checkCollisions(choppers, helipad, canvasWidth, canvasHeight) {
  // Interesting, it's easier and maybe even faster (for small N?)
  // to just check collisions over all possible combinations instead of making
  // a sorted list with relative distances and only checking the ones that
  // are close enough to each other. That's basically the first one, just doing
  // more work.
  var index0, index1;
  for (index0 = 0; index0 < choppers.length; index0++) {
    
    // Check for overlap with other choppers
    for (index1 = index0+1; index1 < choppers.length; index1++) {
      if (OVERLAP_NONE != checkCircleOverlap(choppers[index0].x, choppers[index0].y, choppers[index0].radius, choppers[index1].x, choppers[index1].y, choppers[index1].radius)) {
        choppers[index0].collision();
        choppers[index1].collision();
        UNSUCCESSFUL = true;
      }
    }
        
    if (CollideEdgeOfMap(canvas.width, canvas.height, choppers[index0].x, choppers[index0].y)) {
      choppers[index0].collision();      
      UNSUCCESSFUL = true;
    }
       
    // Check for full overlap with helipad
    if (OVERLAP_FULL == checkCircleOverlap(choppers[index0].x, choppers[index0].y, choppers[index0].radius, helipad.x, helipad.y, helipad.radius)) {
      points++;
      choppers[index0].landed();
    }
  }
}



