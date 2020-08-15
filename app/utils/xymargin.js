import { assert } from '@ember/debug';

// The following matrixes are cached points interest
// matrix are defined in order of priotity of event
// priority is al follows: bottomRight, [right, bottom], body, [topRight, bottomLeft], [top, left], topLeft
// |-----------------------------------|
// | 6 |             5             | 4 |
// |---+---------------------------+---|
// |   |                           |   |
// |   |                           |   |
// | 5 |             3             | 2 |
// |   |                           |   |
// |   |                           |   |
// |---+---------------------------+---|
// | 4 |             2             | 1 |
// |-----------------------------------|
//
//matrix values should alway run left -> right, top -> bottom

export function bottomRight({ width, height, margin }) {
  if (!width || !height || !margin) {
    throw new Error('You attempted to call bottomRight, but it requires a \'width\', \'height\', and \'margin\' arguemnt');
  }

  if (width < margin || height < margin) {
    throw new Error('You attempted to find bottomRight margin on a rectable with a height or width less than the margin');
  }

  let xypoints = new Array(margin);

  for(var ix = 0; ix < margin; ix++) {
    xypoints[ix] = [(width - margin  + ix), new Array(margin)]
    for(var iy = 0; iy < margin; iy++) {
      xypoints[ix][1][iy] = (height - margin + iy)
    }
  }

  return xypoints;  
}

export function right({ width, height, margin }) {
  if (!width || !height || !margin) {
    throw new Error('You attempted to call right, but it requires a \'width\', \'height\', and \'margin\' arguemnt');
  }

  if (width < margin || height < margin) {
    throw new Error('You attempted to find right margin on a rectable with a height or width less than the margin');
  }

  if (height <= margin) {
      return []
  }

  //1 = start
  //n = end
  //r = range
  let y1 = height > margin * 2 ? margin : 0
  let yn = height - margin;
  let yr = yn - y1;

  let xypoints = new Array(margin);

  for(var ix = 0; ix < margin; ix++) {
    xypoints[ix] = [(width - margin  + ix), new Array(margin)]
    for(var iy = 0; iy < yr; iy++) {
      xypoints[ix][1][iy] = (y1 + iy);
    }
  }

  return xypoints;
}