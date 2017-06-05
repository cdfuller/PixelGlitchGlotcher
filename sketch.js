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