// const filename = 'input/karly.jpg';
const filename = 'input/starrynight.jpg';
// const filename = 'input/scrambled-rgb.png';
// const filename = 'input/04_woooo.png';
let gui;
let img;

let comparisons = 0;
let secondarySortMode;
let sortMode;
let secondary;

let sketchPixelDensity;

function preload() {
  createGUI();
  if (config.canvasStart === 'Image') {
    img = loadImage(filename);
  }
}

function setup() {
  renderCanvas();
  console.log('Setup finished.');
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
  if (key === 'T') {
    config.sortReverse = !config.sortReverse;
    console.log('Sort direction:', config.sortReverse);
  } else if (key === 'M') {
    const sortModesArray = Object.keys(SORT_MODES);
    const idx = sortModesArray.indexOf(config.sortMode);
    const nextIdx = (idx + 1) % sortModesArray.length;
    const newMode = sortModesArray[nextIdx];
    config.sortMode = newMode;
    console.log('Sort mode: ', config.sortMode);
  } else if (key === 'V') {
    sortAllRows();
  } else if (key === 'C') {
    sortAllColumns();
  }
}

function setPixelColor(x, y, c) {
  const d = sketchPixelDensity;
  for (let i = 0; i < d; i += 1) {
    for (let j = 0; j < d; j += 1) {
      const idx = 4 * (((y * d) + j) * width * d + (x * d + i));
      pixels[idx+0] = c[0];
      pixels[idx+1] = c[1];
      pixels[idx+2] = c[2];
      pixels[idx+3] = c[3];
    }
  }
}

function getPixelColor(x, y) {
  const d = sketchPixelDensity;
  const off = ((y * width) + x) * d * 4;

  return [pixels[off], pixels[off + 1], pixels[off + 2], pixels[off + 3]]
}

function setColumn(x, col) {
  for (let i = 0; i < height; i += 1) {
    setPixelColor(x, i, col[i]);
  }
}

function getColumn(x) {
  let col = [];
  for (let i = 0; i < height; i += 1) {
    col.push(getPixelColor(x, i));
  }
  return col;
}

function sortColumn(x) {
  loadPixels();
  sortMode = config.sortMode;
  secondarySortMode = config.secondarySort;
  const col = sortedColumn(x);
  setColumn(x, col);
  updatePixels();
}

function sortRow(y) {
  loadPixels();
  sortMode = config.sortMode;
  secondarySortMode = config.secondarySort;
  const row = sortedRow(y);
  setRow(y, row);
  updatePixels();
}

function setRow(y, row) {
  for (let i = 0; i < width; i += 1) {
    setPixelColor(i, y, row[i]);
  }
}

function getRow(y) {
  const row = [];
  for (let i = 0; i < width; i += 1) {
    row.push(getPixelColor(i, y));
  }
  return row;
}

function sortedColumn(x) {
  if (config.sortOffset === 0) {
    return getColumn(x).sort(compareColors);
  }
  return offsetArray(config.sortOffset, getColumn(x).sort(compareColors));
}

function sortedRow(y) {
  if (config.sortOffset === 0) {
    return getRow(y).sort(compareColors);
  }
  return offsetArray(config.sortOffset, getRow(y).sort(compareColors));
}

function sortAllColumns() {
  sortMode = config.sortMode;
  secondarySortMode = config.secondarySort;
  loadPixels();

  console.log('='.repeat(40));
  console.log('Sorting ', width, ' columns');
  console.time('Sort all columns');

  for (let x = 0; x < width; x += 1) {
    const col = sortedColumn(x);
    setColumn(x, col);
  }
  updatePixels();

  console.timeEnd('Sort all columns');
  console.log('Comparisons', comparisons);
  console.log('Secondary', secondary);

  secondary = 0;
  comparisons = 0;
}

function sortAllRows() {
  sortMode = config.sortMode;
  secondarySortMode = config.secondarySort;
  loadPixels();

  console.log('='.repeat(40));
  console.log('Sorting ', height, ' rows');
  console.time('Sort all rows');

  for (let y = 0; y < height; y += 1) {
    const row = sortedRow(y);
    setRow(y, row);
  }

  updatePixels();

  console.timeEnd('Sort all rows');
  console.log('Comparisons', comparisons);

  comparisons = 0;
}

function shiftImageVertical() {
  loadPixels();
  const offset = config.sortOffset;

  for (let x = 0; x < width; x += 1) {
    let col = getColumn(x);
    col = offsetArray(offset, col);
    setColumn(x, col);
  }
  updatePixels();
}

function shiftImageHorizontal() {
  loadPixels();
  const offset = config.sortOffset;

  for (let y = 0; y < height; y += 1) {
    let row = getRow(y);
    row = offsetArray(offset, row);
    setRow(y, row);
  }
  updatePixels();
}

function compareColors(a, b) {
  comparisons += 1;

  let sortDirection = 1;
  if (config.sortReverse === true) {
    sortDirection = -1;
  }

  const left = SORT_MODES[sortMode](a);
  const right = SORT_MODES[sortMode](b);

  if (left < right) {
    return -1 * sortDirection;
  } else if ( left > right ) {
    return 1 * sortDirection;
  } else if (secondarySortMode !== 'None') {
    secondary += 1;
    const l = SORT_MODES[secondarySortMode](a);
    const r = SORT_MODES[secondarySortMode](b);

    if (l < r) {
      return -1 * sortDirection;
    } else if (l > r) {
      return 1 * sortDirection;
    }
    return 0;
  }
  return 0;
}

function saveImage() {
  saveCanvas('PixelGlitch', 'png');
}

function generateCanvas() {
  console.log('Generating canvas');
  const canvasStart = GENERATE_MODES[config.canvasStart];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let c = canvasStart();
      setPixelColor(x, y, c);
    }
  }
  updatePixels();
  console.log('Canvas finished generating');
}

function renderCanvas() {
  if (config.canvasStart === 'Image') {
    const canvas = createCanvas(img.width, img.height);
    canvas.parent('sketch-container');
    pixelDensity(1);
    loadPixels();
    image(img, 0, 0);
  } else {
    const canvas = createCanvas(640, 640);
    canvas.parent('sketch-container');
    pixelDensity(1);
    loadPixels();
    generateCanvas();
  }
  sketchPixelDensity = pixelDensity();
}

function offsetArray(val, arr) {
  if (val < 0) {
    for (let i = 0; i > val; i -= 1) {
      arr.unshift(arr.pop());
    }
  } else {
    for (let i = 0; i < val; i += 1) {
      arr.push(arr.shift());
    }
  }
  return arr;
}
