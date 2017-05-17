function setup() {
  createCanvas(640, 640);
  pixelDensity(1);
  background(51);
  loadPixels();
  // setPixelColor(10, 10, [255, 0, 255, 255]);
  for (var x = 0; x < width; x++){
    for (var y = 0; y < height; y++){
      setPixelColor(x, y, [random(100, 255), random(100, 255), random(100, 255), 255]);
    }
  }
  updatePixels();
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
    // sortRow(mouseY);
    var mY = mouseY;
    var row = sortedRow(mY);
    setRow(mY, row);
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
  // loadPixels();
  // p = get(x, y, 1, 1);
  var d = pixelDensity();
  var off = (y * width + x) * d * 4;
  // debugger; 
  return [pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]
  // return color(p);
  // return p;
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
  return_arr = [];
  var col = getColumn(x);
  // for (var i = 0; i < height; i++){
  //   // setPixel(x, i, 255, 255, 255, 255);
  //   return_arr.push([random(255), random(255), random(255), 255]);
  // }
  return col.sort(compareHue);
}

function sortedRow(y){
  return getRow(y).sort(compareHue);
  // for (var i = 0; i < width; i++){
  //   setPixel(i, y, 0, 0, 0, 255);
  //   // setPixel(i, y, 255, 255, 255, 255);
  // }
}

function compareColors(a, b){
  // return compareHue(a, b);
  return compareBrightness(a, b);
  // return compareSaturation(a, b);
}

function compareHue(a, b){
  if ( hue(a) < hue(b)){
    return -1;
  }
  if ( hue(a) > hue(b)){
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
  if (brightness(a) < brightness(b)){
    return -1;
  }

  if (brightness(a) > brightness(b)){
    return 1;
  }
  return 0;
}

function sortImageByColumn(){
  for (var i = 0; i < width; i++){
    console.log(i);
    var col = sortedColumn(i);
    setColumn(i, col)
    updatePixels();
  }
}