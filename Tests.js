function RunTests() {
  TestCover();
}

// Test if cover detection works properly
function TestCover() {
  var chopper = new Chopper(50,50);
  var helipad = new Helipad(50,50);
  console.assert(1==1, "Msg");
}

function TestCollision() {


}