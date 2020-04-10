function RunTests() {
  TestCover();
}

// Test if cover detection works properly
function TestCover() {
  var chopper = new Chopper(50,50);
  var helipad = new Helipad(50,50);
  var choppers = [];
  
  choppers.push(new Chopper(200, 200));
  checkCollisions(choppers, helipad, 400,400);
  //console.assert(1==0, "Msg");
}

function TestCollision() {


}