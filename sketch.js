const filename = "input/karly.jpg";

var gui;
var img;

function preload(){
  createGUI();
  if (config['canvasStart'] == 'Image'){
    img = loadImage(filename);
  }
}

function setup() {
  renderCanvas();
  loadPixels();
  console.log("Setup finished.");
}

function draw() {
  if (keyIsDown(88)) { // 'x'
    console.log('xxx');
    var mX = mouseX;
    var col = sortedColumn(mX);
    setColumn(mX, col)
  }

  if (keyIsDown(89)){ // 'y'
    console.log('yyy');
    var mY = mouseY;
    var row = sortedRow(mY);
    setRow(mY, row);
  }
  updatePixels();
}

function keyPressed(){
  console.log(key);
  if (key == "T"){
    config.sortReverse = !config.sortReverse;
    console.log("Sort direction:", config.sortReverse);
  }
}

function saveImage(){
  saveCanvas('PixelGlitch', 'png');
}
