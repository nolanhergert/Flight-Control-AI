var HELIPAD_RADIUS = 12;

class Helipad {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = HELIPAD_RADIUS;
  }
  
  show() {
    push();
    // Draw object
    // TODO: Use image sprite
    stroke(150);
    fill('blue');  
    circle(this.x, this.y, this.radius*2);
    
    pop();
  }
  
}
    
  