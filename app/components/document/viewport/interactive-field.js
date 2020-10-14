import Component from '@glimmer/component';
import Cardinal from 'skald/utils/cardinal' 
import { htmlSafe } from '@ember/template';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import {
  bottomRight,
  right,
  bottom,
  topRight,
  bottomLeft,
  body,
  top,
  left,
  topLeft
} from 'skald/utils/xy-margin'


export default class DocumentViewportInteractiveFieldComponent extends Component {
  @tracked zone;

  element;

  get type() {
    return this.args.field.type || 'single-line';
  }

  get style() {
    return htmlSafe(`
      left: ${this.args.field.x}%;
      top: ${this.args.field.y}%;
      height: ${this.args.field.height}%;
      width: ${this.args.field.width}%;
      font-size: ${this.args.field.fontSize / 10}em;
      cursor: ${this.cursor};
    `);
  }

  @computed('zone')
  get cursor() {
    switch(this.zone) {
      case Cardinal.body:
        return 'pointer';
      case Cardinal.bottomRight:
      case Cardinal.topLeft:
        return 'nwse-resize';
      case Cardinal.right:
      case Cardinal.left:
        return 'ew-resize';
      case Cardinal.top:
      case Cardinal.bottom:
        return 'ns-resize';
      case Cardinal.topRight:
      case Cardinal.bottomLeft:
        return 'nesw-resize';
      default:
        return 'pointer';
    }
  }

  get margin() {
    if (this.args.margin) {
      return this.args.margin <= 1 ? 1 : this.args.margin;
    }
    return 5;
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get bottomRightMatrix() {
    return bottomRight({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get rightMatrix() {
    return right({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get bottomMatrix() {
    return bottom({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get topRightMatrix() {
    return topRight({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get bottomLeftMatrix() {
    return bottomLeft({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get bodyMatrix() {
    return body({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get topMatrix() {
    return top({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get leftMatrix() {
    return left({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  @computed('element.{offsetWidth,offsetHeight}', 'margin')
  get topLeftMatrix() {
    return topLeft({ width: this.element.offsetWidth, height: this.element.offsetHeight, margin: this.margin });
  }

  setZone(x, y) {
    const canAdjustHeight = this.args.field.type != 'single'

    if (canAdjustHeight) {
      if (this._xyInMatrix(x, y, this.bottomRightMatrix)) {
        return this.zone = Cardinal.bottomRight;
      } else if (this._xyInMatrix(x, y, this.bottomMatrix)){
        return this.zone = Cardinal.bottom;
      } else if (this._xyInMatrix(x, y, this.topRightMatrix)){
        return this.zone = Cardinal.topRight;
      } else if (this._xyInMatrix(x, y, this.bottomLeftMatrix)){
        return this.zone = Cardinal.bottomLeft;
      } else if (this._xyInMatrix(x, y, this.topMatrix)){
        return this.zone = Cardinal.top;
      }  else if (this._xyInMatrix(x, y, this.topLeftMatrix)){
        return this.zone = Cardinal.topLeft;
      } 
    } 
    
    if (this._xyInMatrix(x, y, this.rightMatrix)){
      return this.zone = Cardinal.right;
    }else if (this._xyInMatrix(x, y, this.leftMatrix)){
      return this.zone = Cardinal.left;
    } else if(this._xyInMatrix(x, y, this.bodyMatrix)) {
      return this.zone = Cardinal.body;
    }

    return this.zone;
  }

  _xyInMatrix(x, y, matrix) {
    if (matrix &&
        (x >= matrix[0][0] && x <= matrix[1][0]) &&
        (y >= matrix[0][1] && y <= matrix[1][1])) {
      return true
    }
    return false
  }

  interaction(event) {
    this.args.onInteraction(
      event,
      this.args.field,
      this.element,
      this.zone 
    )
  }

  @action
  setup(element) {
    this.element = element;
  }

  @action
  mouseevent(event) {
    if (event.type == 'mousemove') {
      this.setZone(event.offsetX, event.offsetY);
    }
    this.interaction(event);
    event.stopPropagation();
  }
}
