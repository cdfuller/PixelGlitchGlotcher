
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
    return saturation(c);
  },
  'Brightness': function(c) {
    return brightness(c);
  },
  'Lightness': function(c) {
    return lightness(c);
  },
  'Luminance': function(c) {
    return getLuminance(c);
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
  'Offset (Disabled)': function(c) {
    return 0;
  },
  'Hue + Luminance': function(c) {
    return getHue(c) + getLuminance(c);
  },
  'Hue ÷ Saturation': function(c) {
    return getHue(c) + saturation(c);
  },
  'Hue x Saturation': function(c) {
    return getHue(c) * saturation(c);
  },
  'Hue + Sat + Bri': function(c) {
    return getHue(c) + saturation(c) + brightness(c);
  },
  'Experimental': function(c) {
    return getHue(c) + (saturation(c) * brightness(c));
  },
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


function getLuminance(c){
  return 0.299*c[0] + 0.587*c[1] + 0.114*c[2];
}
