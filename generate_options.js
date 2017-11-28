console.error("'H(R(a-A)) S(R(a-A)) B(R(a-A))' isn't using HSB values");

GENERATE_MODES = {
  'HSB: H(R) S(80) B(80)': function() {
    var sat = 80;
    var brt = 80;
    var c = color(`hsb(${int(random(360))}, ${sat}%, ${brt}%)`);
    return c.levels
  },
  'RGB: Rand(100-255)': () => [random(100, 255), random(100, 255), random(100, 255), 255],
  'RGB: Random(0-255)': () => [random(0, 255), random(0, 255), random(0, 255), 255],
  'H(R(a-A)) S(R(a-A)) B(R(a-A))': function() {
    // 
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

    return [r, g, b, 255];
  },
  'R(R(a-A)) G(R(a-A)) B(R(a-A))': function() {
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

    return [r, g, b, 255];
  },
  "Red: R(R) G(0) B(0)": () => [random(0, 255), 0, 0, 255],
  "Green: R(0) G(R) B(0)": () => [0, random(0, 255), 0, 255],
  "Blue: R(0) B(0) G(R)": () => [0, 0, random(0, 255), 255],
  // 'RedGreen: R(R) G(R) B(0)': 'RedGreen',
  'Image': 'Image',
}