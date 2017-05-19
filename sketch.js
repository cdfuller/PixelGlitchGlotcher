var config = {
    sortMode: "Hue",
    sortReverse: false,
    reset: generateCanvas,
    canvasStart: 'Random'
}

var gui = new dat.gui.GUI();
gui.remember(config);
gui.add(config, 'sortMode', ['Hue', 'Brightness', 'Saturation']);
var s = gui.add(config, 'sortReverse');
gui.add(config, 'canvasStart', ['HSB', 'Random', 'RedGreen']);
gui.add(config, 'reset');

s.listen();

function setup() {
  createCanvas(640, 640);
  pixelDensity(1);
  generateCanvas();
  console.log("Set to go!");
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
}

function keyPressed(){
  console.log(key);
  if (key == "T"){
    config.sortReverse = !config.sortReverse;
    console.log(config.sortReverse);
  }
}

function setPixelColor(x, y, c){
  var d = pixelDensity();
  for (var i = 0; i< d; i++){
    for (var j = 0; j < d; j++){
      idx = 4 * ((y * d + j) * width * d + (x * d + i));
      pixels[idx] = red(c);
      pixels[idx+1] = green(c);
      pixels[idx+2] = blue(c);
      pixels[idx+3] = alpha(c);
    }
  }
}

function getPixelColor(x, y){
  var d = pixelDensity();
  var off = (y * width + x) * d * 4;

  return [pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]
}

function setColumn(x, col){
  loadPixels();
  for (var i = 0; i < height; i++){
    setPixelColor(x, i, col[i]);
  }
  updatePixels();
}

function getColumn(x){
  var col = [];
  loadPixels();
  for (var i = 0; i < height; i++){
    col.push(getPixelColor(x, i));
  }
  return col;
}

function setRow(y, row){
  loadPixels();
  for (var i = 0; i < width; i++){
    setPixelColor(i, y, row[i]);
  }
  updatePixels();
}

function getRow(y){
  var row = [];
  loadPixels();
  for (var i = 0; i < width; i++){
    row.push(getPixelColor(i, y));
  }
  return row;
}

function sortedColumn(x){
  return getColumn(x).sort(compareColors);
}

function sortedRow(y){
  return getRow(y).sort(compareColors);
}

function compareColors(a, b){

  if (config.sortReverse == true){
    sortDirection = -1;
    s = true;
  } else {
    sortDirection = 1;
    s = false;
  }

  switch (config.sortMode) {
    case 'Hue':
      return compareHue(a, b) * sortDirection;
    case 'Saturation':
      return compareSaturation(a, b) * sortDirection;
    case 'Brightness':
      return compareBrightness(a, b) * sortDirection;
    default:
      return compareHue(a, b) * sortDirection;
  }
}

function compareHue(a, b){
  if ( hue(a) < hue(b) ){
    return -1;
  }
  if ( hue(a) > hue(b) ){
    return 1;
  }
  return 0;
}

function compareSaturation(a, b){
  if ( saturation(a) < saturation(b) ){
    return -1;
  }
  if ( saturation(a) > saturation(b) ){
    return 1;
  }
  return 0;
}

function compareBrightness(a, b){
  if ( brightness(a) < brightness(b) ){
    return -1;
  }
  if ( brightness(a) > brightness(b) ){
    return 1;
  }
  return 0;
}

function generateCanvas(){
  console.log('Generating new canvas');
  loadPixels();
  switch(config.canvasStart){
    // case 'HSB':
    //   console.log("HSB")
    //   // colorMode(HSB);
    //   for (var y = 0; y < height; y++){
    //     for (var x = 0; x < width; x++){
    //       var c = color(random(360), random(70, 90), random(70, 90))
    //       var r = int(red(c));
    //       var g = int(green(c));
    //       var b = int(blue(c));
    //       setPixelColor(x, y, [r, g, b, 255]);
    //     }
    //     console.log(y);
    //   }
    //   colorMode(RGB);
    //   break;
    case 'Random':
      for (var x = 0; x < width; x++){
        for (var y = 0; y < height; y++){
          setPixelColor(x, y, [random(100, 255), random(100, 255), random(100, 255), 255]);
        }
      }
      break;
    case 'RedGreen':
      for (var x = 0; x < width; x++){
        for (var y = 0; y < height; y++){
          setPixelColor(x, y, [random(0, 255), random(0, 255), 0, 255]);
        }
      }
      break;
  }
  updatePixels();
}