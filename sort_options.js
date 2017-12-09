
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

  // return [hue / 6, sat, val, rgba[3]];
  return hue / 6;
};

function getSaturation(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);
  let chroma = val - Math.min(red, green, blue);

  let sat;
  if (chroma === 0) {  // Return early if grayscale.
    sat = 0;
  }
  else {
    sat = chroma / val;
  }

  return sat;
};

function getBrightness(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);

  return val;
};

function getLightness(rgba) {
  let red = rgba[0];
  let green = rgba[1];
  let blue = rgba[2];

  let val = Math.max(red, green, blue);
  let min = Math.min(red, green, blue);
  let li = (val + min) / 2;

  return li;
}

function getLuminance(rgba) {
  return 0.299*rgba[0] + 0.587*rgba[1] + 0.114*rgba[2];
}

function getChroma(rgba) {
  let red = rgba[0];
  let blue = rgba[1];
  let green = rgba[2];

  let val = Math.max(red, green, blue);
  let chroma = val - Math.min(red, green, blue);

  return chroma;
}

function getHashV1(rgba) {
  let s = rgba[0].toString() + rgba[1].toString() + rgba[2].toString();
  let hash = 0;

  for (let i = 0; i < s.length; i++) {
    let c = s.charCodeAt(i);
    hash = ((hash<<5)-hash)+c;
    hash = hash & hash;
  }
  return hash;
}

function getHashV2(rgba) {
  let str = rgba[0].toString() + rgba[1].toString() + rgba[2].toString();
  let hash = 5381,
      i    = str.length;

  while(i) {
    hash = (hash * 33) ^ str.charCodeAt(--i);
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0;
}
