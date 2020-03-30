


// TODO: Apply performance tips? https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#disable-the-friendly-error-system-fes
// Mostly just use min.js I think and avoid p5 online editor


var helipad;
var points;
var choppers;


// For checkCircleOverlap()
const OVERLAP_FULL = 0;
const OVERLAP_PARTIAL = 1;
const OVERLAP_NONE = 2;


function preload() {
  RunTests();
}

function setup() {
  // TODO: Eventually let user set this value on HTML?
  randomSeed(0);
  
  window.canvas = createCanvas(600, 800);
  choppers = [];
  choppers.push(new Chopper(canvas.width/2, canvas.height/2-50));
  helipad = new Helipad(canvas.width/2, canvas.height/2);
  points = 0;
}

function draw() {
   
  background(135, 206, 250);
  helipad.show();
  var index;
  for (index = 0; index < choppers.length; index++) {
    choppers[index].move();
    choppers[index].show();
  }
  
  checkCollisions();
  textSize(20);
  text(points, canvas.width-25, 25);
}

  
function checkCollisions(choppers, canvas) {
  // Interesting, it's easier and maybe even faster (for small N?)
  // to just check collisions over all possible combinations instead of making
  // a sorted list with relative distances and only checking the ones that
  // are close enough to each other. That's basically the first one, just doing
  // more work.
  var index0, index1;
  for (index0 = 0; index0 < choppers.length; index0++) {
    
    // Check for overlap with other choppers
    for (index1 = index0; index1 < choppers.length; index1++) {
      if (OVERLAP_NONE != checkCircleOverlap(choppers[index0].x, choppers[index0].y, choppers[index0].radius, choppers[index1].x, choppers[index1].y, choppers[index1].radius)) {
        // FAILURE
        choppers[index0].collision();
        choppers[index1].collision();
        console.assert(false, "Collision detected between choppers!");
      }
    }
        
    // Check for collision with side of map
    // Do simple center of circle check
    if (choppers[index0].x < 0 || choppers[index0].x > canvas.width ||
        choppers[index0].y < 0 || choppers[index0].y > canvas.height) {
      choppers[index].collision();
    }
    
    // Check for full overlap with helipad
    if (OVERLAP_FULL == checkCircleOverlap(choppers[index0].x, choppers[index0].y, choppers[index0].radius, helipad.x, helipad.y, helipad.radius)) {
      points++;
      choppers.remove = true;
    }
  }
}

// Does not work with <IE9. I think we'll be ok.
// var filtered = someArray.filter(function(el) { return el.Name != "Kristian"; });


// Thanks StackOverflow!
// https://stackoverflow.com/a/12251083/931280
// Using fast version just in case, better explained version is on the answer
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
