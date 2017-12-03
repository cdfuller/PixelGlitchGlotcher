// const filename = "input/karly.jpg";
const filename = "input/starrynight.jpg"
// const filename = "input/scrambled-rgb.png";
// const filename = "input/04_woooo.png";
var gui;
var img;

var comparisons = 0;
var secondary_sort_mode;
var sort_mode;
var secondary;

var pixel_density;

function preload() {
  createGUI();
  if (config['canvasStart'] == 'Image') {
    img = loadImage(filename);
  }
}

function setup() {
  renderCanvas();
  console.log("Setup finished.");
}

function draw() {
  if (keyIsDown(88)) { // 'x'
    sortColumn(mouseX);
  }

  if (keyIsDown(89)) { // 'y'
    sortRow(mouseY);
  }
}

function keyPressed() {
  if (key == "T") {
    config.sortReverse = !config.sortReverse;
    console.log("Sort direction:", config.sortReverse);
  } else if (key == "M") {
    var sort_modes_arr = Object.keys(SORT_MODES);
    var idx = sort_modes_arr.indexOf(config.sortMode);
    var next_idx = (idx + 1) % sort_modes_arr.length;
    var new_mode = sort_modes_arr[next_idx];
    config.sortMode = new_mode;
    console.log("Sort mode: ", config.sortMode);
  } else if (key == 'V') {
    sortAllRows();
  } else if (key == 'C') {
    sortAllColumns();
  }
}

function setPixelColor(x, y, c) {
  var d = pixel_density;
  for (var i = 0; i< d; i++) {
    for (var j = 0; j < d; j++) {
      idx = 4 * ((y * d + j) * width * d + (x * d + i));
      pixels[idx] = c[0];
      pixels[idx+1] = c[1];
      pixels[idx+2] = c[2];
      pixels[idx+3] = c[3];
    }
  }
}

function getPixelColor(x, y) {
  var d = pixel_density;
  var off = (y * width + x) * d * 4;

  return [pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]
}

function setColumn(x, col) {
  for (var i = 0; i < height; i++) {
    setPixelColor(x, i, col[i]);
  }
}

function getColumn(x) {
  var col = [];
  for (var i = 0; i < height; i++) {
    col.push(getPixelColor(x, i));
  }
  return col;
}

function sortColumn(x) {
  loadPixels();
  sort_mode = config.sortMode;
  secondary_sort_mode = config.secondarySort;
  var col = sortedColumn(x);
  setColumn(x, col);
  updatePixels();
}

function sortRow(y) {
  loadPixels();
  sort_mode = config.sortMode;
  secondary_sort_mode = config.secondarySort;
  var row = sortedRow(y);
  setRow(y, row);
  updatePixels();
}

function setRow(y, row) {
  for (var i = 0; i < width; i++) {
    setPixelColor(i, y, row[i]);
  }
}

function getRow(y) {
  var row = [];
  for (var i = 0; i < width; i++) {
    row.push(getPixelColor(i, y));
  }
  return row;
}

function sortedColumn(x) {
  if (config.sortOffset == 0) {
    return getColumn(x).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getColumn(x).sort(compareColors));
  }
}

function sortedRow(y) {
  if (config.sortOffset == 0) {
    return getRow(y).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getRow(y).sort(compareColors));
  }
}

function sortAllColumns() {
  sort_mode = config.sortMode;
  secondary_sort_mode = config.secondarySort;
  loadPixels();

  console.log("Sorting ", width, " columns");
  t0 = performance.now();

  for (var x = 0; x < width; x+=1) {
    var col = sortedColumn(x);
    setColumn(x, col);
  }
  updatePixels();
  
  t1 = performance.now();
  console.log("Sorted All Columns", (t1 - t0));
  console.log("Comparisons", comparisons);
  console.log('Secondary', secondary);
  
  secondary = 0;
  comparisons = 0;
}

function sortAllRows() {
  sort_mode = config.sortMode;
  secondary_sort_mode = config.secondarySort;
  loadPixels();

  console.log("Sorting ", height, " rows");
  t0 = performance.now();

  for (var y = 0; y < height; y++) {
    var row = sortedRow(y);
    setRow(y, row);
  }

  updatePixels();
  
  t1 = performance.now();
  console.log("Sorted All Rows", (t1 - t0));
  console.log("Comparisons", comparisons);

  comparisons = 0;
}

function shiftImageVertical() {
  loadPixels();
  var offset = config['sortOffset'];

  for (var x = 0; x < width; x++) {
    var col = getColumn(x);
    col = offsetArray(offset, col);
    setColumn(x, col);
  }
  updatePixels();
}

function shiftImageHorizontal() {
  loadPixels();
  var offset = config['sortOffset'];

  for (var y = 0; y < height; y++) {
    var row = getRow(y);
    row = offsetArray(offset, row);
    setRow(y ,row);
  }
  updatePixels();
}

function compareColors(a, b) {
  comparisons++;

  if (config.sortReverse == true) {
    sortDirection = -1;
  } else {
    sortDirection = 1;
  }

  var left = SORT_MODES[sort_mode](a);
  var right = SORT_MODES[sort_mode](b);

  if ( left < right ) {
    return -1 * sortDirection;
  } else if ( left > right ) {
    return 1 * sortDirection;
  } else if (secondary_sort_mode !== 'None') {
    secondary++;
    var l = SORT_MODES[secondary_sort_mode](a);
    var r = SORT_MODES[secondary_sort_mode](b);
    if ( l < r ) {
      return -1 * sortDirection;
    } else if ( l > r ) {
      return 1 * sortDirection;
    } else {
      return 0;
    }
  } else {
    return 0;
  }

}

function saveImage() {
  saveCanvas('PixelGlitch', 'png');
}

function generateCanvas() {
  console.log('Generating canvas');
  var canvasStart = GENERATE_MODES[config.canvasStart]
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var c = canvasStart();
      setPixelColor(x, y, c);
    }
  }
  updatePixels();
  console.log("Canvas finished generating");
}

function renderCanvas() {
  if (config['canvasStart'] == 'Image') {
    var canvas = createCanvas(img.width, img.height);
    canvas.parent('sketch-container');
    pixelDensity(1);
    loadPixels();
    image(img, 0, 0);
  } else {
    var canvas = createCanvas(640, 640);
    canvas.parent('sketch-container');
    pixelDensity(1);
    loadPixels();
    generateCanvas();
  }
  pixel_density = pixelDensity();
}

function offsetArray(val, arr) {
  if (val < 0) {
    for (var i = 0; i > val; i--) {
      arr.unshift(arr.pop());
    }
  } else {
    for (var i = 0; i < val; i++) {
      arr.push(arr.shift());
    }
  }
  return arr;
}