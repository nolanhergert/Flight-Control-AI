


class AISimple {
  constructor(choppers, helipads, canvasWidth, canvasHeight) {
    this.choppers = choppers;
    this.helipads = helipads;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  
  }
  
  
  DeterminePath(chopperIndex) {
    
    // Find a good path for a given chopper
    var chopperToPath = this.choppers[chopperIndex];
    
    
    
    // First try a straight path towards the proper helipad and
    // run a <fake> simulation forward, checking for collisions.
    // If a collision occurs, back up a little then, delay starting, then try again
    
    // How to change the time on a simulation, hmm...that sounds hard. Let's just make
    // a copy of everything in its current state and use that instead.
    // Need to update this if helipads start moving too!
    var choppersCopy = [];
    var waypoints = [];
    var helipad;
    
    // Determine proper helipad based on color match
    for (i = 0; i < helipads.length; i++) {
      if (chopperToPath.color == helipads[i].color) {
        helipad = helipads[i];
      }
    }

    // For now do a simple path, point towards the proper helipad!
    waypoints =  [new Waypoint([helipad.x, helipad.y])];

    while (true) {
      // Make a copy of the original chopper list
      choppersCopy = [];
      CloneChoppers(choppersCopy, self.choppers);
      // Make the i'th chopper (the one we're trying to plan a path for) have
      // the current trial of waypoints
      //choppersCopy[chopperIndex].waypoints = [];
      CloneWaypoints(choppersCopy[chopperIndex].waypoints, waypoints);
 
    
      // Success if chopper to move eventually reaches helipad.
      // failure if it crashes before it gets there, need to replan.
      var collision = false;
      while (true) {
        collision = moveWorld(choppersCopy, helipad, this.canvasWidth, this.canvasHeight, TIME_INCREMENT);
        if (collision == true) {
          break;
        }
        
        // Remove any choppers that reached the helipad
        for (i = 0; i < choppersCopy.length; i++) {
          if (choppersCopy[i].remove == true) {
            // This allocates new memory for choppers, invalidating
            // the previous choppers memory
            choppersCopy.splice(i, 1);
            if (waypoints.length < 3) {
              var foo = 1;
            }
          }
        }
        
        if (choppersCopy.length == 0) {
          // Success!
          break;
        }
      }
      
      if (collision == false) {
        // Success!
        break;
      } else {
        // Try a delay at the beginning by doing a little boogie
        // unshift = insert at beginning
        waypoints.unshift(new Waypoint(Displacement(chopperToPath.x, chopperToPath.y, chopperToPath.heading, chopperToPath.speed, TIME_INCREMENT*2)));
        waypoints.unshift(new Waypoint([chopperToPath.x, chopperToPath.y]));
      }
      
    }

    return waypoints;
  }
    
    
    
  update() {
    var i = 0;
    for (i = 0; i < this.choppers.length; i++) {
      // Determine a path for choppers that don't already have one
      if (this.choppers[i].waypoints.length == 0) {
        // Provide index to chopper in chopper list
        this.choppers[i].waypoints = this.DeterminePath(i);
      }
    }
    
    // TODO: Probably at some point, need to edit paths for choppers
    // that already have a path, but it's good enough for now
  }
  
   
}


function CloneChoppers(choppersDest, choppersSrc) {
  var i = 0;
  var chopper;
  for (i = 0; i < choppersSrc.length; i++) {
    // Clone properties from src chopper to dest chopper, hopefully!
    // choppersDest.push(Object.assign({}, choppersSrc[i]));
    // But, it only copies *properties*, doesn't actually make a new chopper! Whoops.
    
    // Create a new chopper object and copy the properties
    chopper = new Chopper();
    Object.assign(chopper, choppersSrc[i]);
    // Need to deep copy the waypoints and don't want to modify the original
    chopper.waypoints = [];
    CloneWaypoints(chopper.waypoints, choppersSrc[i].waypoints);
    choppersDest.push(chopper);
  }
}

function CloneWaypoints(waypointsDest, waypointsSrc) {
  var i = 0;
  var waypoint;
  for (i = 0; i < waypointsSrc.length; i++) {
    // Create a new waypoint object and copy the properties
    waypoint = new Waypoint([waypointsSrc[i].x, waypointsSrc[i].y]);
    waypointsDest.push(waypoint);
  }
}
   
