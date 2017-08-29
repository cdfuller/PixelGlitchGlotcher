SORT_MODES = [
  'Hue',
  'Saturation',
  'Brightness',
  'Lightness',
  'Luminance',
  'Absolute',
  'Red',
  'Green',
  'Blue',
  'Cyan',
  'Yellow',
  'Magenta',
  'Offset',
  'Hue + Luminance',
  'Hue ÷ Saturation',
  'Hue x Saturation',
  'Hue + Sat + Bri',
  'Experimental',
  ]

var config = {
    canvasStart: "HSB",
    sortMode: "Hue",
    sortReverse: false,
    reset: renderCanvas,
    saveImage: saveImage,
    "Sort All Columns": sortAllColumns,
    "Sort All Rows": sortAllRows,
    "minA": 0,
    "minB": 0,
    "minC": 0,
    "maxA": 255,
    "maxB": 255,
    "maxC": 255,
    "sortOffset": 0,
}

function createGUI(){
  gui = new dat.gui.GUI();
  gui.remember(config);
  gui.add(config, 'sortMode', SORT_MODES);
  gui.add(config, 'sortOffset').min(-400).max(400).step(5);
  gui.add(config, "Sort All Columns");
  gui.add(config, "Sort All Rows");
  gui.add(config, 'sortReverse').listen();

  var genFolder= gui.addFolder("Canvas Generation");
  genFolder.add(config, 'canvasStart', {
                                        "HSB: H(R) S(80) B(80)": "HSB",
                                        "RGB: Rand(100-255)": 'RGB',
                                        'H(R(a-A)) S(R(a-A)) B(R(a-A))': 'Custom HSB',
                                        'R(R(a-A)) G(R(a-A)) B(R(a-A))': 'Custom RGB',
                                        "Red: R(R) G(0) B(0)": 'Red',
                                        "Green: R(0) G(R) B(0)": 'Green',
                                        "Blue: R(0) B(0) G(R)": 'Blue',
                                        'RedGreen: R(R) G(R) B(0)': 'RedGreen',
                                        'Image': 'Image',
                                      });
  genFolder.add(config, 'minA').min(0).max(359).step(1);
  genFolder.add(config, 'maxA').min(0).max(360).step(1);
  genFolder.add(config, 'minB').min(0).max(254).step(1);
  genFolder.add(config, 'maxB').min(0).max(255).step(1);
  genFolder.add(config, 'minC').min(0).max(254).step(1);
  genFolder.add(config, 'maxC').min(0).max(255).step(1);
  genFolder.add(config, 'reset');
  gui.add(config, 'saveImage');
}