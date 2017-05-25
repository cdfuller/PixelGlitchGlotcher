var config = {
    canvasStart: 'HSB',
    sortMode: "Hue",
    sortReverse: false,
    reset: generateCanvas,
    saveImage: saveImage,
    "Sort All Columns": sortAllColumns,
    "Sort All Rows": sortAllRows,
}

var gui;


function setup() {
  createGUI();
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

function sortAllColumns(){
  for (var x = 0; x < width; x++){
    var col = sortedColumn(x);
    setColumn(x, col);
    console.log(x);
  }
  console.log("Sorted All Columns");
}

function sortAllRows(){
  for (var y = 0; y < height; y++){
    var row = sortedRow(y);
    setRow(y, row);
    console.log(y);
  }
  console.log("Sorted All Rows");
}

function compareColors(a, b){
  var left, right;

  if (config.sortReverse == true){
    sortDirection = -1;
  } else {
    sortDirection = 1;
  }

  switch (config.sortMode) {
    case 'Hue':
      left = hue(a);
      right = hue(b);
      break;
    case 'Saturation':
      left = saturation(a);
      right = saturation(b);
      break;
    case 'Brightness':
      left = brightness(a);
      right = brightness(b);
      break;
    case 'Lightness':
      left = lightness(a);
      right = lightness(b);
      break;
    case 'Luminance':
      left = (0.299*red(a) + 0.587*green(a) + 0.114*blue(a))
      right = (0.299*red(b) + 0.587*green(b) + 0.114*blue(b))
      break;
    case 'Absolute':
      left = red(a) + green(a) + blue(a);
      right = red(b) + green(b) + blue(b);
      break;
    case 'Red':
      left = red(a);
      right = red(b);
      break;
    case 'Green':
      left = green(a);
      right = green(b);
      break;
    case 'Blue':
      left = blue(a);
      right = blue(b);
      break;
    default:
      console.error(`sortMode "#{config.sortMode}" not found`);
      console.log("Sorting by hue");
      left = hue(a);
      right = hue(b);
  }  

  if ( left < right ){
    return -1 * sortDirection;
  }

  if (left > right ){
    return 1 * sortDirection;
  }

  return 0;
}

function saveImage(){
  saveCanvas('PixelGlitch', 'jpg');
}

function generateCanvas(){
  console.log('Generating canvas');
  loadPixels();
  for (var y = 0; y < height; y++){
    for (var x = 0; x < width; x++){
      switch(config.canvasStart){
        case 'HSB':
          var sat = int(random(70, 90));
          var brt = int(random(70, 90));
          var c = color(`hsb(${int(random(360))}, ${sat}%, ${brt}%)`);
          setPixelColor(x, y, c);
          break;
        case 'RGB':
          setPixelColor(x, y, [random(100, 255), random(100, 255), random(100, 255), 255]);     
          break;
        case 'Red':
          setPixelColor(x, y, [random(0, 255), 0, 0, 255]);
          break;
        case 'RedGreen':
          setPixelColor(x, y, [random(0, 255), random(0, 255), 0, 255]);
          break;
        default:
          // Set an ugly brown if canvasStart preset doesn't match
          setPixelColor(x, y, color('brown'));
      }
    }
  }
  updatePixels();
  console.log("Canvas finished generating");
}

function createGUI(){
  gui = new dat.gui.GUI();
  gui.remember(config);
  gui.add(config, 'sortMode', [
                              'Hue', 
                              'Saturation', 
                              'Brightness', 
                              'Lightness', 
                              'Luminance', 
                              'Absolute',
                              'Red', 
                              'Green', 
                              'Blue',
                              ]);
  gui.add(config, "Sort All Columns");
  gui.add(config, "Sort All Rows");
  gui.add(config, 'sortReverse').listen();
  gui.add(config, 'canvasStart', ['HSB', 'RGB', 'Red', 'RedGreen']);
  gui.add(config, 'reset');
  gui.add(config, 'saveImage');
}
