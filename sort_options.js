
// All sort modes take in a color array ([r, g, b, a]) and return a numeric value
// 
// In: [10, 22, 53, 255]
// Out: 114.4
// 
SORT_MODES = {
  'Hue': function(c) {
    return getHue(c);
  },
  'Saturation': function(c) {
    return getSaturation(c);
  },
  'Brightness': function(c) {
    return getBrightness(c);
  },
  'Lightness': function(c) {
    return getLightness(c);
  },
  'Luminance': function(c) {
    return getLuminance(c);
  },
  'Chroma': function(c) {
    return getChroma(c);
  },
  'Absolute': function(c) {
    // r + g + b
    return c[0] + c[1] + c[2];
  },
  'Red': function(c) {
    return c[0];
  },
  'Green': function(c) {
    return c[1];
  },
  'Blue': function(c) {
    return c[2];
  },
  'Cyan': function(c) {
    return c[1] + c[2];
  },
  'Yellow': function(c) {
    return c[0] + c[1];
  },
  'Magenta': function(c) {
    return c[0] + c[2];
  },
  'Hue + Luminance': function(c) {
    return getHue(c) + getLuminance(c);
  },
  'Hue ÷ Saturation': function(c) {
    return getHue(c) + getSaturation(c);
  },
  'Hue x Saturation': function(c) {
    return getHue(c) * getSaturation(c);
  },
  'Hue + Sat + Bri': function(c) {
    return getHue(c) + getSaturation(c) + getBrightness(c);
  },
  'Experimental': function(c) {
    return getHue(c) + (getSaturation(c) * getBrightness(c));
  },
  'Red x Blue': function(c) {
    return (c[0] + 1) / (c[2] + 1);
  },
  'Red x Green': (c) => (c[0] + 1) / (c[1] + 1),
  'Green x Blue': (c) => (c[1] + 1) / (c[2] + 1),
  'Dark/Light': function(c) {
    return int((c[0] + c[1] + c[2]) / 128);
  },
  'Grey Shades(8)': function(c) {
    return int((c[0] + c[1] + c[2]) / 16);
  },
  'Hash V1': (c) => getHashV1(c),
  'Hash V2': (c) => getHashV2(c),
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

  // return [hue / 6, sat, val, rgba[3]];
  return hue / 6;
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

  return sat;
};

function getBrightness(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);

  return val;
};

function getLightness(rgba) {
  var red = rgba[0];
  var green = rgba[1];
  var blue = rgba[2];

  var val = Math.max(red, green, blue);
  var min = Math.min(red, green, blue);
  var li = (val + min) / 2;

  return li;
}

function getLuminance(c){
  return 0.299*c[0] + 0.587*c[1] + 0.114*c[2];
}

function getChroma(c){
  var red = c[0];
  var blue = c[1];
  var green = c[2];

  var val = Math.max(red, green, blue);
  var chroma = val - Math.min(red, green, blue);

  return chroma;
}

function getHashV1(c) {
  let s = c[0].toString() + c[1].toString() + c[2].toString();
  let hash = 0;

  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    hash = ((hash<<5)-hash)+c;
    hash = hash & hash;
  }
  return hash;
}

function getHashV2(c) {
  let str = c[0].toString() + c[1].toString() + c[2].toString();
  var hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}
