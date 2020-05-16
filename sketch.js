


// TODO: Apply performance tips? https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes
// Mostly just use min.js I think and avoid p5 online editor




//For example, if teams may decide early on that there’s only one approach to solve a problem or that a given algorithm / technique is the perfect one. Instead of choosing the simplest method that works for the problem and fulfills stakeholder requirements such as explainability, these teams may commit to complex AI methods before determining if simpler techniques could do the job.













var helipads;
var points;
var choppers;


///////////////////////////////////////////
// Customizable values values

const MIN_CHOPPER_ALIVE_TIME = 5; // seconds

const STARTING_TIME_BETWEEN_NEW_CHOPPERS = 1; // seconds
const TIME_UNTIL_APOCALYPSE = 120; // seconds

const FPS = 60;

///////////////////////////////////////////



// For checkCircleOverlap()
const OVERLAP_FULL = 0;
const OVERLAP_PARTIAL = 1;
const OVERLAP_NONE = 2;

// Almost all references to time in the code are in milliseconds
var startTime = 0; // ms
var currentTime = startTime;
var nextChopperTime = startTime;
const TIME_INCREMENT = 1000 / FPS; // ms

var UNSUCCESSFUL = false;

var AI;

function preload() {
  RunTests();
}

function setup() {
  // Sets what version of randomness you'll get on this run
  // Change the seed, you'll get a completely different "roll of the dice"
  // Keep the seed the same, you'll get the exact same "roll of the dice" every time! Makes reproduction much easier
  randomSeed(0);
  
  window.canvas = createCanvas(800, 400);
  
  frameRate(FPS);
  choppers = [];
  helipads = [];
  
  helipads.push(new Helipad(canvas.width/4, canvas.height/2, 'red'));
  helipads.push(new Helipad(3*canvas.width/4, canvas.height/2, 'blue'));
  points = 0;
  
  AI = new AISimple(choppers, helipads, canvas.width, canvas.height);
}

// Should really be called "loop()"
function draw() {


  // While we could increment by "wall clock"/real time here, it makes the result
  // using the debugger and when using lots of airplanes really jerky. So keeping
  // standard increment time based on FPS for now
  moveWorld(choppers, helipads, canvas.width, canvas.height, TIME_INCREMENT);
  currentTime += TIME_INCREMENT;
  
  // If a chopper landed, remove it and increment points
  for (i = 0; i < choppers.length; i++) {
    if (choppers[i].remove == true) {
      // This allocates new memory for choppers, invalidating
      // the previous choppers memory
      choppers.splice(i, 1);
      
      points++;
    }
  }
  
  // Add new chopper if applicable
  while(currentTime >= nextChopperTime) {
    // Add a new chopper!
    var c = CreateNewRandomChopper(canvas.width, canvas.height, choppers);
    choppers.push(c);
    AI.update();
        
    // Spawn in decreasing intervals according to time since start of game
    var timeSinceGameStart = (currentTime - startTime);
    var lineValue = 1000 * ((-STARTING_TIME_BETWEEN_NEW_CHOPPERS/TIME_UNTIL_APOCALYPSE) * timeSinceGameStart/1000 + STARTING_TIME_BETWEEN_NEW_CHOPPERS);
    if (lineValue < 0) {
      // Negative numbers don't work, just make it really small
      lineValue = .01;
    }
    nextChopperTime = currentTime + lineValue;
  }
  



  // Set background color
  background(135, 206, 250);
  for (i = 0; i < helipads.length; i++) {
    helipads[i].show();
  }
  for (i = 0; i < choppers.length; i++) {
    choppers[i].show();
  }

  textSize(20);
  // TODO: Right aligned text
  text(points, canvas.width-50, 25);

}

// Making this a separate function allows for simulation without drawing when
// doing AI path planning
// Returns True if a collision occurred, false otherwise.
function moveWorld(choppers, helipads, canvasWidth, canvasHeight, elapsedTimeInMs) {

  var i;
  
  // Move choppers according to frame time elapsed
  for (i = 0; i < choppers.length; i++) {
    choppers[i].move(elapsedTimeInMs);
  }
  
  return checkCollisions(choppers, helipads, canvas.width, canvas.height);
 }


// Return True if a collision occurred, false otherwise. 
function checkCollisions(choppers, helipads, canvasWidth, canvasHeight) {
  // Interesting, it's easier and maybe even faster (for small N?)
  // to just check collisions over N*N/2 possible combinations instead of making
  // a sorted list with relative distances and only checking the ones that
  // are close enough to each other. That's basically the first one, just doing
  // more work.
  var i, j, c, c2;
  var collision = false;
  for (i = 0; i < choppers.length; i++) {
    c = choppers[i];
    // Check for overlap with other choppers
    for (j = i+1; j < choppers.length; j++) {
      c2 = choppers[j];
      if (OVERLAP_NONE != checkCircleOverlap(c.x, c.y, c.radius, c2.x, c2.y, c2.radius)) {
        c.collision();
        c2.collision();
        collision = true;
      }
    }
        
    if (CollideEdgeOfMap(canvas.width, canvas.height, c.x, c.y)) {
      c.collision();
      collision = true;
    }
       
    // Check for full overlap with a helipad
    for (j = 0; j < helipads.length; j++) {
      if (OVERLAP_FULL == checkCircleOverlap(c.x, c.y, c.radius, helipads[j].x, helipads[j].y, helipad[j].radius)) {
        c.landed();
      }
  }
  return collision;
}




function CreateNewRandomChopper(canvasWidth, canvasHeight, choppers) {

  // Pick a spot some distance around the perimeter of the canvas
  // starting at the top left corner and going clockwise. However should be fully visible
  // so minus a multiple of chopper width
  while (true) {
    var distanceAroundEdgeOfCanvas = random(0, canvas.width*2+canvas.height*2 - 16*CHOPPER_RADIUS);
    var x, y;
    var result = MapDistanceToEdgeLocation(distanceAroundEdgeOfCanvas, canvas.width-4*CHOPPER_RADIUS, canvas.height-4*CHOPPER_RADIUS);
    // Bring up the 0 values
    x = result[0]+2*CHOPPER_RADIUS;
    y = result[1]+2*CHOPPER_RADIUS;
    
    // Only break out if the position doesn't intersect with an existing chopper
    var intersection = false;
    for (i = 0; i < choppers.length; i++) {
      if (OVERLAP_NONE != checkCircleOverlap(x,y,CHOPPER_RADIUS,choppers[i].x,choppers[i].y,choppers[i].radius)) {
        intersection = true;
        break;
      }
    }
    if (intersection == false) {
      // Success!
      break;
    }
  }

  
  // The position determined above is valid. However, only some headings from the
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




