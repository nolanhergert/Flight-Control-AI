


class AISimple {
  constructor(choppers, helipad) {
    this.choppers = choppers;
    this.helipad = helipad;
  
  }
  
  
  DeterminePath(chopper) {
    // Find a good path for a given chopper
    
    // For now do a simple path, point towards the helipad!
    return [new Waypoint([helipad.x, helipad.y])];
  }
    
    
    
  update() {
    var i = 0;
    for (i = 0; i < this.choppers.length; i++) {
      // Determine a path for choppers that don't already have one
      if (this.choppers[i].waypoints.length == 0) {
        this.choppers[i].waypoints = this.DeterminePath(this.choppers[i]);
      }
    }
    
    // TODO: Probably at some point, need to edit paths for choppers
    // that already have a path, but it's good enough for now
  }
  
   
}
