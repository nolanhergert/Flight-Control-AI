const CHOPPER_RADIUS = 10; // pixels
const CHOPPER_SPEED = 40/1000; // pixels/ms



// This should really be a generic "Aircraft" class, but we'll let it slide for now
class Chopper {
  constructor(x, y, heading, color) {
    this.x = x;
    this.y = y;
    this.radius = CHOPPER_RADIUS;
    this.remove = false;
    this.color = color;
    this.heading = heading; // in degrees clockwise from North. See http://3.bp.blogspot.com/-sKFXSUT021M/VZRjnWWlkfI/AAAAAAAABpE/p7ct0iK4r5w/s1600/Headingv3.jpg
    this.speed = CHOPPER_SPEED; // pixels/ms
    this.waypoints = [];
  }
  
  show() {
    push();
    // Draw object
    // TODO: Use image sprite
    stroke(150);
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
    
    // Draw waypoints + path between them
    var i = 0;
    if (this.waypoints.length > 0) {
      line(this.x, this.y, this.waypoints[0].x, this.waypoints[0].y);
      circle(this.waypoints[0].x, this.waypoints[0].y, WAYPOINT_RADIUS);
      for (i = 1; i < this.waypoints.length; i++) {  
        line(this.waypoints[i-1].x, this.waypoints[i-1].y, this.waypoints[i].x, this.waypoints[i].y);
        circle(this.waypoints[i].x, this.waypoints[i].y, WAYPOINT_RADIUS);
      }
    }
    
    pop();
  }
  
  move(elapsedTimeInMs) {
    var remainingTimeInMs = elapsedTimeInMs;
    // TODO: Incorporate paths here too
    
    while (this.waypoints.length > 0) {
      // Calculate heading
      this.heading = CalcHeading(this.x, this.y, this.waypoints[0].x, this.waypoints[0].y);
      
      var distanceToWaypointX = this.waypoints[0].x - this.x;
      var distanceToWaypointY = this.waypoints[0].y - this.y;
      var distanceToWaypoint = distanceToWaypointX * distanceToWaypointX + distanceToWaypointY * distanceToWaypointY;
      if (this.speed * remainingTimeInMs <= distanceToWaypoint) {
        // Next waypoint is far enough off to not care. Break out and do normal calculation
        break;
      }
      
      // Jump to the next waypoint
      remainingTimeInMs -= (distanceToWaypoint/this.speed);
      this.x = this.waypoints[0].x;
      this.y = this.waypoints[0].y;
      // Remove first item
      this.waypoints.shift();
    }
    var values = Displacement(this.x, this.y, this.heading, this.speed, remainingTimeInMs);
    this.x = values[0];
    this.y = values[1];
  }
  
  path(listOfWaypoints) {
    this.waypoints = listOfWaypoints;
  }
  
  collision() {
    this.color = 'red';
  }
  
  landed() {
    this.color = 'green';
    this.remove = true;
  }
}
