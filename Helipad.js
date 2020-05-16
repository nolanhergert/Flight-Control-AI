var HELIPAD_RADIUS = 18;

class Helipad {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = HELIPAD_RADIUS;
    this.color = color;
  }
  
  show() {
    push();
    // Draw object
    // TODO: Use image sprite
    stroke(150);
    fill(this.color);
    circle(this.x, this.y, this.radius*2);
    
    pop();
  }
  
}
    
  