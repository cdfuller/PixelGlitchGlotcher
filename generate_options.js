GENERATE_MODES = {
  'HSB: H(R) S(80) B(80)': () => HSBtoRGB(int(random(360)), 80, 80),
  'HSB: H(R) S(100) B(100)': () => HSBtoRGB(int(random(360)), 100, 100),
  'RGB: Rand(100-255)': () => [random(100, 255), random(100, 255), random(100, 255), 255],
  'RGB: Random(0-255)': () => [random(0, 255), random(0, 255), random(0, 255), 255],
  'H(R(a-A)) S(R(a-A)) B(R(a-A))': function generateHueRange() {
    let h;
    let s;
    let b;

    if (config.minA >= config.maxA) {
      h = config.minA;
    } else {
      h = int(random(config.minA, config.maxA));
    }

    if (config.minB >= config.maxB) {
      s = config.minB;
    } else {
      s = int(random(config.minB, config.maxB));
    }

    if (config.minC >= config.maxC) {
      b = config.minC;
    } else {
      b = int(random(config.minC, config.maxC));
    }

    return HSBtoRGB(h, s, b);
  },
  'R(R(a-A)) G(R(a-A)) B(R(a-A))': function generateRGBRange() {
    let r;
    let g;
    let b;

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
  'Red: R(R) G(0) B(0)': () => [random(0, 255), 0, 0, 255],
  'Green: R(0) G(R) B(0)': () => [0, random(0, 255), 0, 255],
  'Blue: R(0) B(0) G(R)': () => [0, 0, random(0, 255), 255],
  'RedGreen: R(R) G(R) B(0)': () => [random(0, 255), random(0, 255), 0, 255],
  'RedBlue: R(R) G(0) B(R)': () => [random(0, 255), 0, random(0, 255), 255],
  'BlueGreen: R(0) G(R) B(R)': () => [0, random(0, 255), random(0, 255), 255],
  Image: 'Image',
};

// http://kickjava.com/src/org/eclipse/swt/graphics/RGB.java.htm
function HSBtoRGB(_hue, _saturation, _brightness) {
  let r;
  let g;
  let b;
  let hue = _hue;
  const saturation = _saturation / 100;
  const brightness = _brightness / 100;

  if (saturation == 0) {
    r = g = b = brightness;
  } else {
    if (hue == 360) {
      hue = 0;
    }
    hue /= 60;
    const i = int(hue);
    const f = hue - i;
    const p = brightness * (1 - saturation);
    const q = brightness * (1 - saturation * f);
    const t = brightness * (1 - saturation * (1 - f));

    switch (i) {
      case 0:
        r = brightness;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = brightness;
        b = p;
        break;
      case 2:
        r = p;
        g = brightness;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = brightness;
        break;
      case 4:
        r = t;
        g = p;
        b = brightness;
        break;
      case 5:
      default:
        r = brightness;
        g = p;
        b = q;
        break;
    }
  }
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return [r, g, b, 255];
}
