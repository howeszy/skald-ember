// The following matrixes are cached points interest
// matrix are defined in order of priotity of event
// priority is al follows: bottomRight, [right, bottom], body, [topRight, bottomLeft], [top, left], topLeft
// |-----------------------------------|
// | 5 |             5             | 4 |
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

function validArguments({ width, height, margin }) {
  if (!width || !height || !margin) {
    throw new Error('You attempted to call bottomRight, but it requires a \'width\', \'height\', and \'margin\' arguemnt');
  }

  if (width < margin || height < margin) {
    throw new Error('You attempted to find bottomRight margin on a rectable with a height or width less than the margin');
  }
}

export function bottomRight({ width, height, margin }) {
  validArguments(...arguments);

  return [
    [(width - margin), (height - margin)],
    [(width - 1), (height - 1)]
  ];
}

export function right({ width, height, margin }) {
  validArguments(...arguments);

  if (height <= margin) { // no right margin
    return null;
  } else if (height < margin * 2) {  // no top right margin
    return [
      [(width - margin), 0],
      [(width - 1), (height - margin -1)]
    ];
  } else { // full right margin
    return [
      [(width - margin), (margin)],
      [(width - 1), (height - margin -1)]
    ];
  }
}

export function bottom({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin) { // no right margin
    return null;
  } else if (width < margin * 2) {  // no top right margin
    return [
      [0, (height - margin)],
      [(width - margin -1), (height - 1)]
    ];
  } else { // full right margin
    return [
      [(margin), (height - margin)],
      [(width - margin -1), (height - 1)]
    ];
  }
}

export function body({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin || height <= margin) {
    return null;
  } else if (width <= margin * 2 || height <= margin * 2) {
    return [
      [0,0],
      [(width - margin -1), (height - margin -1)]
    ]
  } else {
    return [
      [margin, margin],
      [(width - margin - 1), (height - margin - 1)]
    ]
  }
}

export function topRight({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin || height <= margin * 2) {
    return null;
  } else {
    return [
      [(width - margin), 0],
      [(width - 1), (margin - 1)]
    ]
  }
}

export function bottomLeft({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin * 2 || height <= margin ) {
    return null;
  } else {
    return [
      [0, (height - margin)],
      [(margin -1), (height - 1)]
    ]
  }
}

export function top({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin * 2 || height <= margin * 2 ) {
    return null;
  } else {
    return [
      [(margin),0],
      [(width - margin - 1), (margin - 1)]
    ]
  }
}

export function left({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin * 2 || height <= margin * 2 ) {
    return null;
  } else {
    return [
      [0, (margin)],
      [(margin - 1), (height - margin - 1)]
    ]
  }
}

export function topLeft({ width, height, margin }) {
  validArguments(...arguments);

  if (width <= margin * 2 || height <= margin * 2 ) {
    return null;
  } else {
    return [
      [0, 0],
      [(margin -1), (margin -1)]
    ]
  }
}