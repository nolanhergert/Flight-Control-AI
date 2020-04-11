const CHOPPER_RADIUS = 10;
const CHOPPER_SPEED = 40; // pixels/s


// This should really be a generic "Aircraft" class, but we'll let it slide for now
class Chopper {
  constructor(x, y, heading) {
    this.x = x;
    this.y = y;
    this.radius = CHOPPER_RADIUS;
    this.remove = false;
    this.color = 'gray';
    this.heading = heading; // in degrees clockwise from North. See http://3.bp.blogspot.com/-sKFXSUT021M/VZRjnWWlkfI/AAAAAAAABpE/p7ct0iK4r5w/s1600/Headingv3.jpg
    this.speed = CHOPPER_SPEED; // pixels/s
  }
  
  show() {
    push();
    // Draw object
    // TODO: Use image sprite
    stroke(150);
    fill(this.color);  
    circle(this.x, this.y, this.radius*2);
    
    // TODO: Also draw current path
    pop();
  }
  
  move(elapsedTimeInMs) {
    // TODO: Incorporate paths here too
    var values = Displacement(this.x, this.y, this.heading, this.speed, elapsedTimeInMs);
    this.x = values[0];
    this.y = values[1];
  }
  
  collision() {
    this.color = 'red';
  }
  
  landed() {
    this.color = 'green';
    this.remove = true;
  }
}
  