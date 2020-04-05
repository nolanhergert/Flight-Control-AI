var CHOPPER_RADIUS = 10;


// This should really be a generic "Aircraft" class, but we'll let it slide for now
class Chopper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = CHOPPER_RADIUS;
    this.remove = false;
    this.color = 'gray';
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
  
  move() {
    // Wraparound
    this.y = (this.y + 1)%canvas.height;
  }
  
  collision() {
    this.color = 'red';
  }
  
  landed() {
    this.color = 'green';
    this.remove = true;
  }
}
  