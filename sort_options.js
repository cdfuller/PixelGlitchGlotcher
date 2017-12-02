// All sort modes take in a color array ([r, g, b, a]) and return an int
// 
// In: [10, 22, 53, 255]
// Out: 114
// 
SORT_MODES = {
  'Hue': { 'max': 360, 'func': (c) => getHue(c) },
  'Saturation': { 'max': 100, 'func': (c) => getSaturation(c) },
  'Brightness': { 'max': 255, 'func': (c) => getBrightness(c) },
  'Lightness': { 'max': 255, 'func': (c) => getLightness(c) },
  'Luminance': { 'max': 255, 'func': (c) => getLuminance(c) },
  'Chroma': { 'max': 255, 'func': (c) => getChroma(c) },
  'Absolute': { 'max': 255*3, 'func': (c) => c[0] + c[1] + c[2] },
  'Red': { 'max': 255, 'func': (c) => c[0] },
  'Green': { 'max': 255, 'func': (c) => c[1] },
  'Blue': { 'max': 255, 'func': (c) => c[2] },
  'Cyan': { 'max': 510, 'func': (c) => c[1] + c[2] },
  'Yellow': { 'max': 510, 'func': (c) => c[0] + c[1] },
  'Magenta': { 'max': 510, 'func': (c) => c[0] + c[2] },
  'Hue + Luminance': { 'max': 360 + 255, 'func': (c) => getHue(c) + getLuminance(c) },
  'Hue ÷ Saturation': (c) => getHue(c) + getSaturation(c),
  'Hue x Saturation': (c) => getHue(c) * getSaturation(c),
  'Hue + Sat + Bri': (c) => getHue(c) + getSaturation(c) + getBrightness(c),
  'Experimental': (c) => getHue(c) + (getSaturation(c) * getBrightness(c)),
  'Red x Blue': (c) => (c[0] + 1) / (c[2] + 1),
  'Black/White(2)': { 'max': 2, 'func': (c) => int(getBrightness(c) / 128) },
  'Shades(6)': { 'max': 6, 'func': (c) => int((c[0] + c[1] + c[2]) / 128) },
  'Shades(48)': {max: 47, 'func': (c) => int((c[0] + c[1] + c[2]) / 16) },
}


//
// Helper functions to keep SORT_MODES short and readable
//

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

  return int(hue / 6 * 360);
};

function getSaturation(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);
  var chroma = val - Math.min(red, green, blue);

  var sat;
  if (chroma === 0) {  // Return early if grayscale.
    sat = 0;
  }
  else {
    sat = chroma / val;
  }

  return int(sat * 100);
};

function getBrightness(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);

  return int(val);
};

function getLightness(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);
  var min = Math.min(red, green, blue);
  var li = (val + min) / 2;

  return int(li);
}

function getLuminance(c){
  return int(0.299*c[0] + 0.587*c[1] + 0.114*c[2]);
}

function getChroma(c){
  var red = c[0];
  var blue = c[1];
  var green = c[2];

  var val = Math.max(red, green, blue);
  var chroma = val - Math.min(red, green, blue);

  return int(chroma);
}
