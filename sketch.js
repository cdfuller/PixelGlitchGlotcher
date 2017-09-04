const filename = "input/karly.jpg";

var gui;
var img;

var comparisons = 0;
var sort_mode;

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
    console.log('xxx');
    sortColumn(mouseX);
  }

  if (keyIsDown(89)) { // 'y'
    console.log('yyy');
    sortRow(mouseY);
  }
}

function keyPressed() {
  console.log(key);
  if (key == "T") {
    config.sortReverse = !config.sortReverse;
    console.log("Sort direction:", config.sortReverse);
  } else if (key == "M") {
    var idx = SORT_MODES.indexOf(config.sortMode);
    var new_mode = SORT_MODES[(idx + 1) % SORT_MODES.length];
    config.sortMode = new_mode;
    console.log("Sort mode: ", config.sortMode);
  } else if (key == 'V') {
    sortAllRows();
  } else if (key == 'C') {
    sortAllColumns();
  }
}

function setPixelColor(x, y, c) {
  var d = pixelDensity();
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
  var d = pixelDensity();
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
  var col = sortedColumn(x);
  setColumn(x, col);
  updatePixels();
}

function sortRow(y) {
  loadPixels();
  sort_mode = config.sortMode;
  var row = sortedRow(y);
  setRow(y, row);
  updatePixels();
}

function setRow(y, row) {
  for (var i = 0; i < width; i++) {
    setPixelColor(i, y, row[i]);
  }
  updatePixels();
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
  
  comparisons = 0;
}

function sortAllRows() {
  sort_mode = config.sortMode;
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


// Taken from p5js
// Original: p5.ColorConversion._rgbaToHSBA
function getHue(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);
  var chroma = val - Math.min(red, green, blue);

  var hue, sat;
  if (chroma === 0) {  // Return early if grayscale.
    hue = 0;
    sat = 0;
  }
  else {
    // sat = chroma / val;
    if (red === val) {  // Magenta to yellow.
      hue = (green - blue) / chroma;
    } else if (green === val) { // Yellow to cyan.
      hue = 2 + (blue - red) / chroma;
    } else if (blue === val) {  // Cyan to magenta.
      hue = 4 + (red - green) / chroma;
    }
    if (hue < 0) {  // Confine hue to the interval [0, 1).
      hue += 6;
    } else if (hue >= 6) {
      hue -= 6;
    }
  }

  // return [hue / 6, sat, val, rgba[3]];
  return hue / 6;
};


// Stolen from threejs
// Might be useful for getting sat and lightness
// 
// function getHue3( rgb) {
  
//       // h,s,l ranges are in 0.0 - 1.0
  
//       // var hsl = optionalTarget || { h: 0, s: 0, l: 0 };
  
//       var r = rgb[0]; 
//       var g = rgb[1];
//       var b = rgb[2];
  
//       var max = Math.max( r, g, b );
//       var min = Math.min( r, g, b );
  
//       var hue
//       // var saturation;
//       // var lightness = ( min + max ) / 2.0;
  
//       if ( min === max ) {
//         hue = 0;
//         // saturation = 0;
//       } else {
//         var delta = max - min;
//         // saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );
//         switch ( max ) {
//           case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
//           case g: hue = ( b - r ) / delta + 2; break;
//           case b: hue = ( r - g ) / delta + 4; break;
//         }
//         hue /= 6;
//       }
//       return hue;
//       // hsl.h = hue;
//       // hsl.s = saturation;
//       // hsl.l = lightness;
//       // return hsl;
//     }

function compareColors(a, b) {
  var [redA, greenA, blueA] = a;
  var [redB, greenB, blueB] = b;
  var left, right;

  // TODO
  // Convert this ugly switch statement to use an object literal
  switch (sort_mode) {
    case 'Hue':
      left = getHue(a);
      right = getHue(b);
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
      left = 0.299*redA + 0.587*greenA + 0.114*blueA;
      right = 0.299*redB + 0.587*greenB + 0.114*blueB;
      break;
    case 'Absolute':
      left = redA + greenA + blueA;
      right = redB + greenB + blueB;
      break;
    case 'Red':
      left = redA;
      right = redB;
      break;
    case 'Green':
      left = greenA;
      right = greenB;
      break;
    case 'Blue':
      left = blueA;
      right = blueB;
      break;
    case 'Cyan':
      left = greenA + blueA;
      right = greenB + blueB;
      break;
    case 'Yellow':
      left = redA + greenA;
      right = redB + greenB;
      break;
    case 'Magenta':
      left = redA + blueA;
      right = redB + blueB;
      break;
    case 'Offset':
      left = 0;
      right = 1;
      break;
    case 'Hue + Luminance':
      left = (0.299*redA + 0.587*greenA + 0.114*blueA) + getHue(a);
      right = (0.299*redB + 0.587*greenB + 0.114*blueB) + getHue(b);
      break;
    case 'Hue ÷ Saturation':
      left = getHue(a) / saturation(a);
      right = getHue(b) / saturation(b);
      break;
    case 'Hue x Saturation':
      left = getHue(a) * saturation(a);
      right = getHue(b) * saturation(b);
      break;
    case 'Hue + Sat + Bri':
      left = getHue(a) + saturation(a) + brightness(a);
      right = getHue(b) + saturation(b) + brightness(b);
      break;
    case 'Experimental':
      left = getHue(a) + (saturation(a) * brightness(a));
      right = getHue(b) + (saturation(b) * brightness(b));
      break;
    default:
      console.error(`sortMode "#{config.sortMode}" not found`);
      console.log("Sorting by hue");
      left = getHue(a);
      right = getHue(b);
  }  
  comparisons++;

  if (config.sortReverse == true) {
    sortDirection = -1;
  } else {
    sortDirection = 1;
  }

  if ( left < right ) {
    return -1 * sortDirection;
  } else if ( left > right ) {
    return 1 * sortDirection;
  } else {
    return 0;
  }

}

function saveImage() {
  saveCanvas('PixelGlitch', 'png');
}

function generateCanvas() {
  console.log('Generating canvas');
  var canvasStart = config.canvasStart
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      switch(canvasStart) {
        case 'HSB':
          var sat = 80;
          var brt = 80;
          var c = color(`hsb(${int(random(360))}, ${sat}%, ${brt}%)`);
          setPixelColor(x, y, c.levels);
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

          if (config.minA == config.maxA) {
            r = config.minA;
          } else {
            r = int(random(config.minA, config.maxA));
          }

          if (config.minB == config.maxB) {
            g = config.minB;
          } else {
            g = int(random(config.minB, config.maxB));
          }

          if (config.minC == config.maxC) {
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