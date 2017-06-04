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
}

function keyPressed(){
  console.log(key);
  if (key == "T"){
    config.sortReverse = !config.sortReverse;
    console.log("Sort direction:", config.sortReverse);
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
  // loadPixels();
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
  // loadPixels();
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
  if (config.sortOffset == 0){
    return getColumn(x).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getColumn(x).sort(compareColors));
  }
}

function sortedRow(y){
  if (config.sortOffset == 0){
    return getRow(y).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getRow(y).sort(compareColors));
  }
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
    case 'Cyan':
      left = green(a) + blue(a);
      right = green(b) + blue(b);
      break;
    case 'Yellow':
      left = red(a) + green(a);
      right = red(b) + green(b);
      break;
    case 'Magenta':
      left = red(a) + blue(a);
      right = red(b) + blue(b);
      break;
    case 'Offset':
      left = 0;
      right = 1;
      break;
    case 'Hue + Luminance':
      left = (0.299*red(a) + 0.587*green(a) + 0.114*blue(a)) + hue(a);
      right = (0.299*red(b) + 0.587*green(b) + 0.114*blue(b)) + hue(b);
      break;
    case 'Hue ÷ Saturation':
      left = hue(a) / saturation(a);
      right = hue(b) / saturation(b);
      break;
    case 'Hue x Saturation':
      left = hue(a) * saturation(a);
      right = hue(b) * saturation(b);
      break;
    case 'Hue + Sat + Bri':
      left = hue(a) + saturation(a) + brightness(a);
      right = hue(b) + saturation(b) + brightness(b);
      break;
    case 'Experimental':
      left = hue(a) + (saturation(a) * brightness(a));
      right = hue(b) + (saturation(b) * brightness(b));
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
  saveCanvas('PixelGlitch', 'png');
}

function generateCanvas(){
  console.log('Generating canvas');
  loadPixels();
  for (var y = 0; y < height; y++){
    for (var x = 0; x < width; x++){
      switch(config.canvasStart){
        case 'HSB':
          var sat = 80;
          var brt = 80;
          var c = color(`hsb(${int(random(360))}, ${sat}%, ${brt}%)`);
          setPixelColor(x, y, c);
          break;
        case 'RGB':
          setPixelColor(x, y, [random(100, 255), random(100, 255), random(100, 255), 255]);     
          break;
        case 'Red':
          setPixelColor(x, y, [random(0, 255), 0, 0, 255]);
          break;
        case 'Green':
          setPixelColor(x, y, [0, random(0, 255), 0, 255]);
          break;
        case 'Blue':
          setPixelColor(x, y, [0, 0, random(0, 255), 255]);
          break;
        case 'RedGreen':
          setPixelColor(x, y, [random(0, 255), random(0, 50), 0, 255]);
          break;
        case 'Custom RGB':
          var r, g, b;

          if (config.minA == config.maxA){
            r = config.minA;
          } else {
            r = int(random(config.minA, config.maxA));
          }

          if (config.minB == config.maxB){
            g = config.minB;
          } else {
            g = int(random(config.minB, config.maxB));
          }

          if (config.minC == config.maxC){
            b = config.minC;
          } else {
            b = int(random(config.minC, config.maxC));
          }

          setPixelColor(x, y, [r, g, b, 255]);
          break;
        case 'Custom HSB':
          var h = int(random(config.minA, config.maxA));
          var s = int(random(config.minB, config.maxB));
          var b = int(random(config.minC, config.maxC));
          var c = color(`hsb(${h}, ${s}%, ${b}%)`);
          setPixelColor(x, y, c)
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

function renderCanvas(){
  if (config['canvasStart'] == 'Image'){
    var canvas = createCanvas(img.width, img.height);
    canvas.parent('sketch-container');
    pixelDensity(1);
    image(img, 0, 0);
  } else {
    var canvas = createCanvas(640, 640);
    canvas.parent('sketch-container');
    pixelDensity(1);
    generateCanvas();
  }
}

function offsetArray(val, arr){
  if (val < 0){
    for (var i = 0; i > val; i--){
      arr.unshift(arr.pop());
    }
  } else {
    for (var i = 0; i < val; i++){
      arr.push(arr.shift());
    }
  }
  return arr;
}