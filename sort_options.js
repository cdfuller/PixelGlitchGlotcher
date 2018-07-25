// All sort modes take in a color array ([r, g, b, a]) and return a numeric value
//
// In: [10, 22, 53, 255]
// Out: 114.4
//

const SORT_MODES = {
  'Hue': { 'max': 360, 'func': (c) => getHue(c) },
  'Saturation': { 'max': 100, 'func': (c) => getSaturation(c) },
  'Brightness': { 'max': 255, 'func': (c) => getBrightness(c) },
  'Lightness': { 'max': 255, 'func': (c) => getLightness(c) },
  'Luminance': { 'max': 255, 'func': (c) => getLuminance(c) },
  'Chroma': { 'max': 255, 'func': (c) => getChroma(c) },
  'Absolute': { 'max': 255 * 3, 'func': (c) => c[0] + c[1] + c[2] },
  'Red': { 'max': 255, 'func': (c) => c[0] },
  'Green': { 'max': 255, 'func': (c) => c[1] },
  'Blue': { 'max': 255, 'func': (c) => c[2] },
  'Cyan': { 'max': 510, 'func': (c) => c[1] + c[2] },
  'Yellow': { 'max': 510, 'func': (c) => c[0] + c[1] },
  'Magenta': { 'max': 510, 'func': (c) => c[0] + c[2] },
  'Hue + Luminance': { 'max': 360 + 255, 'func': (c) => getHue(c) + getLuminance(c) },
  'Hue ÷ Saturation': { 'max': 360 / 100, 'func': (c) => getHue(c) + getSaturation(c) },
  'Hue x Saturation': { 'max': 360 * 100, 'func': (c) => getHue(c) * getSaturation(c) },
  'Hue + Sat + Bri': { 'max': 360 + 100 + 100, 'func': (c) => getHue(c) + getSaturation(c) + getBrightness(c) },
  'Experimental': { 'max': 360 + (100 * 100), 'func': (c) => getHue(c) + (getSaturation(c) * getBrightness(c)) },
  'Red x Green': { 'max': 255 * 255, 'func': (c) => (c[0] + 1) / (c[1] + 1) },
  'Red x Blue': { 'max': 255 * 255, 'func': (c) => (c[0] + 1) / (c[2] + 1) },
  'Green x Blue': { 'max': 255 * 255, 'func': (c) => (c[1] + 1) / (c[2] + 1) },
  'Black/White(2)': { 'max': 2, 'func': (c) => int((c[0] + c[1] + c[2]) / 128) },
  'Grey Shades(8)': { 'max': 47, 'func': (c) => int((c[0] + c[1] + c[2]) / 16) },
  // Need to figure out max value before enabling.
  // 'Hash V1': { 'max': null, 'func': (c) => getHashV1(c) },
  // 'Hash V2': { 'max': null, 'func': (c) => getHashV2(c) },
}


//
// Helper functions to keep SORT_MODES short and readable
//

// Taken from p5js
// Original: p5.ColorConversion._rgbaToHSBA
function getHue(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);
  let chroma = val - Math.min(red, green, blue);

  let hue, sat;
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
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);
  let chroma = val - Math.min(red, green, blue);

   sat;
  if (chroma === 0) {  // Return early if grayscale.
    sat = 0;
  }
  else {
    sat = chroma / val;
  }

  return int(sat * 100);
};

function getBrightness(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);

  return int(val);
};

function getLightness(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let li = (val + min) / 2;

  return int(li);
}

function getLuminance(c) {
  return int(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]);
}

function getChroma(c) {
  let red = c[0];
  let blue = c[1];
  let green = c[2];

  let val = Math.max(red, green, blue);
  let chroma = val - Math.min(red, green, blue);

  return int(chroma);
}

function getHashV1(rgba) {
  let s = rgba[0].toString() + rgba[1].toString() + rgba[2].toString();
  let hash = 0;

  for (let i = 0; i < s.length; i += 1) {
    let c = s.charCodeAt(i);
    hash = ((hash<<5)-hash) + c;
    hash = hash & hash;
  }
  return hash;
}

function getHashV2(rgba) {
  let str = rgba[0].toString() + rgba[1].toString() + rgba[2].toString();
  let hash = 5381;
  let i = str.length;

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}
