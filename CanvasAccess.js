function setPixelColor(x, y, c){
  var d = pixelDensity();
  for (var i = 0; i< d; i++){
    for (var j = 0; j < d; j++){
      idx = 4 * ((y * d + j) * width * d + (x * d + i));
      pixels[idx] = red(c);
      pixels[idx+1] = green(c);
      pixels[idx+2] = blue(c);
      pixels[idx+3] = alpha(c);
    }
  }
}

function getPixelColor(x, y){
  var d = pixelDensity();
  var off = (y * width + x) * d * 4;

  return [pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]
}

function setColumn(x, col){
  for (var i = 0; i < height; i++){
    setPixelColor(x, i, col[i]);
  }
}

function getColumn(x){
  var col = [];
  for (var i = 0; i < height; i++){
    col.push(getPixelColor(x, i));
  }
  return col;
}

function setRow(y, row){
  for (var i = 0; i < width; i++){
    setPixelColor(i, y, row[i]);
  }
}

function getRow(y){
  var row = [];
  for (var i = 0; i < width; i++){
    row.push(getPixelColor(i, y));
  }
  return row;
}

function sortedColumn(x){
  if (config.sortOffset == 0){
    return getColumn(x).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getColumn(x).sort(compareColors));
  }
}

function sortedRow(y){
  if (config.sortOffset == 0){
    return getRow(y).sort(compareColors);
  } else {
    return offsetArray(config.sortOffset, getRow(y).sort(compareColors));
  }
}

function sortAllColumns(){
  for (var x = 0; x < width; x++){
    var col = sortedColumn(x);
    setColumn(x, col);
    console.log(x);
  }
  console.log("Sorted All Columns");
}

function sortAllRows(){
  for (var y = 0; y < height; y++){
    var row = sortedRow(y);
    setRow(y, row);
    console.log(y);
  }
  console.log("Sorted All Rows");
}