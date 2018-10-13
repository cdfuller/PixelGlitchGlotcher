console.error('Sort reverse not implemented in counting sort')

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
    sortColumn(int(mouseX));
  }

  if (keyIsDown(89)) { // 'y'
    sortRow(int(mouseY));
  }
}

function keyPressed() {
  console.log(key);
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
  let col = [];
  for (let i = 0; i < height; i++) {
    col.push(getPixelColor(x, i));
  }
  return col;
}

function sortColumn(x) {
  loadPixels();
  sort_mode = SORT_MODES[config.sortMode];
  secondary_sort_mode = SORT_MODES[config.secondarySort];
  let col = getColumn(x);
  sortSet(col, sort_mode, secondary_sort_mode);
  setColumn(x, col);
  updatePixels();
}

function sortRow(y) {
  loadPixels();
  sort_mode = SORT_MODES[config.sortMode];
  secondary_sort_mode = SORT_MODES[config.secondarySort];
  let row = getRow(y);
  sortSet(row, sort_mode, secondary_sort_mode);
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


function sortSet(pxl_array, primary_sort_mode, secondary_sort_mode) {
  let buckets = [];
  let l = primary_sort_mode['max'];
  let sort_func = primary_sort_mode['func'];

  // Create an Array of Arrays for each bucket
  while (l >= 0) {
    buckets[l--] = new Array();
  }

  // Put every pixel in the correct bucket
  for (let i = 0; i < pxl_array.length; i++) {
    let k = sort_func(pxl_array[i]);
    buckets[k].push(pxl_array[i]);
  }

  // Sort secondary
  if (secondary_sort_mode) {
    let secondary_sort_func = secondary_sort_mode['func']
    for (let i = 0; i < buckets.length; i++) {
      buckets[i].sort((a, b) => secondary_sort_func(a) - secondary_sort_func(b) )
    }
  }

  // Flatten buckets and update pixels
  for (let i = 0, j = 0; i < buckets.length; i++) {
    while (buckets[i].length > 0) {
      let e = buckets[i].pop();
      pxl_array[j++] = e;
    }
  }
}

function sortAllColumns() {
  loadPixels();

  console.log("Sorting ", width, " columns");
  console.time('Sort all columns');

  sort_mode = SORT_MODES[config.sortMode];
  secondary_sort_mode = SORT_MODES[config.secondarySort];

  for (var x = 0; x < width; x+=1) {
      var col = getColumn(x);
      sortSet(col, sort_mode, secondary_sort_mode);
      setColumn(x, col);
  }
  
  console.timeEnd('Sort all columns');
  console.log("Comparisons", comparisons);
  console.log('Secondary', secondary);

  updatePixels();
  secondary = 0;
  comparisons = 0;
}


function sortAllRows() {
  loadPixels();

  console.log("Sorting ", height, " rows");
  console.time('Sort all rows');

  sort_mode = SORT_MODES[config.sortMode];
  secondary_sort_mode = SORT_MODES[config.secondarySort];

  for (var y = 0; y < height; y++) {
    var row = getRow(y);
    sortSet(row, sort_mode, secondary_sort_mode);
    setRow(y, row);
  }

  console.timeEnd('Sort all rows');
  console.log("Comparisons", comparisons);
  console.log('Secondary', secondary);

  updatePixels();
  secondary = 0;
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

function saveImage() {
  saveCanvas('PixelGlitch', 'png');
}

function generateCanvas() {
  console.log('Generating canvas');
  var canvasStart = GENERATE_MODES[config.canvasStart]
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var c = canvasStart(x, y);
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