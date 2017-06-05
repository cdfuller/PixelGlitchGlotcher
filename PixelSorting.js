function compareColors(a, b){
  var left, right;

  if (config.sortReverse == true){
    sortDirection = -1;
  } else {
    sortDirection = 1;
  }

  switch (config.sortMode) {
    case 'Hue':
      left = hue(a);
      right = hue(b);
      break;
    case 'Saturation':
      left = saturation(a);
      right = saturation(b);
      break;
    case 'Brightness':
      left = brightness(a);
      right = brightness(b);
      break;
    case 'Lightness':
      left = lightness(a);
      right = lightness(b);
      break;
    case 'Luminance':
      left = (0.299*red(a) + 0.587*green(a) + 0.114*blue(a))
      right = (0.299*red(b) + 0.587*green(b) + 0.114*blue(b))
      break;
    case 'Absolute':
      left = red(a) + green(a) + blue(a);
      right = red(b) + green(b) + blue(b);
      break;
    case 'Red':
      left = red(a);
      right = red(b);
      break;
    case 'Green':
      left = green(a);
      right = green(b);
      break;
    case 'Blue':
      left = blue(a);
      right = blue(b);
      break;
    case 'Cyan':
      left = green(a) + blue(a);
      right = green(b) + blue(b);
      break;
    case 'Yellow':
      left = red(a) + green(a);
      right = red(b) + green(b);
      break;
    case 'Magenta':
      left = red(a) + blue(a);
      right = red(b) + blue(b);
      break;
    case 'Offset':
      left = 0;
      right = 1;
      break;
    case 'Hue + Luminance':
      left = (0.299*red(a) + 0.587*green(a) + 0.114*blue(a)) + hue(a);
      right = (0.299*red(b) + 0.587*green(b) + 0.114*blue(b)) + hue(b);
      break;
    case 'Hue ÷ Saturation':
      left = hue(a) / saturation(a);
      right = hue(b) / saturation(b);
      break;
    case 'Hue x Saturation':
      left = hue(a) * saturation(a);
      right = hue(b) * saturation(b);
      break;
    case 'Hue + Sat + Bri':
      left = hue(a) + saturation(a) + brightness(a);
      right = hue(b) + saturation(b) + brightness(b);
      break;
    case 'Experimental':
      left = hue(a) + (saturation(a) * brightness(a));
      right = hue(b) + (saturation(b) * brightness(b));
      break;
    default:
      console.error(`sortMode "#{config.sortMode}" not found`);
      console.log("Sorting by hue");
      left = hue(a);
      right = hue(b);
  }  

  if ( left < right ){
    return -1 * sortDirection;
  }

  if (left > right ){
    return 1 * sortDirection;
  }

  return 0;
}

function offsetArray(val, arr){
  if (val < 0){
    for (var i = 0; i > val; i--){
      arr.unshift(arr.pop());
    }
  } else {
    for (var i = 0; i < val; i++){
      arr.push(arr.shift());
    }
  }
  return arr;
}