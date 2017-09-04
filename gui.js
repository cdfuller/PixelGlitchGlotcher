var config = {
    canvasStart: 'Image',
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
  gui.add(config, 'sortMode', Object.keys(SORT_MODES)).listen();
  gui.add(config, 'sortOffset').min(-400).max(400).step(1);
  gui.add(config, "Sort All Columns");
  gui.add(config, "Sort All Rows");
  gui.add(config, 'sortReverse').listen();

  var genFolder= gui.addFolder("Canvas Generation");
  genFolder.add(config, 'canvasStart', Object.keys(GENERATE_MODES));
  genFolder.add(config, 'minA').min(0).max(359).step(1);
  genFolder.add(config, 'maxA').min(0).max(360).step(1);
  genFolder.add(config, 'minB').min(0).max(254).step(1);
  genFolder.add(config, 'maxB').min(0).max(255).step(1);
  genFolder.add(config, 'minC').min(0).max(254).step(1);
  genFolder.add(config, 'maxC').min(0).max(255).step(1);
  genFolder.add(config, 'reset');
  gui.add(config, 'saveImage');
}