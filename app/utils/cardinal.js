export default class Cardinal {
  static body = new Cardinal('body', [0,0]);
  static topLeft = new Cardinal('topLeft', [-1,-1]);
  static top = new Cardinal('top', [0,-1]);
  static topRight = new Cardinal('topRight', [1,-1]);
  static right = new Cardinal('right', [1,0]);
  static bottomRight = new Cardinal('bottomRight', [1,1]);
  static bottom = new Cardinal('bottom', [0,1]);
  static bottomLeft = new Cardinal('bottomLeft', [-1,1]);
  static left = new Cardinal('left', [-1,0]);

  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  get x() {
    return this.value[0];
  }

  get y() {
    return this.value[1];
  }

  toString() {
    return this.name;
  }

  toArray() {
    return this.value;
  }
}