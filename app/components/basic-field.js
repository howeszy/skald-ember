import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { bind } from '@ember/runloop';
import interact from 'interactjs';


export default class BasicFieldComponent extends Component {
  @tracked height = 1;
  @tracked width = 1;
  @tracked x = 0;
  @tracked y = 0;
  @tracked value = "";

  get containerWidth() {
    return this.args.containerWidth;
  }

  get containerHeight() {
    return this.args.containerHeight;
  }

  get style() {
    return htmlSafe(`left: ${this.x}%; top: ${this.y}%; height: ${this.height}%; width: ${this.width}%`);
  }

  constructor(owner, args) {
    super(...arguments);

    let { x, y, width, height, value } = args.field;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.value = value;
  }

  setup(element, [parent]) {
    interact(element)
      .resizable({
        margin: 3,
        edges: { left:true, right: true, top: true, bottom: true },
        modifiers: [
          interact.modifiers.restrictEdges({
            outer: 'parent'
          }),

          interact.modifiers.restrictSize({
            min: { width: 5, height: 5 }
          })
        ],
        listeners: {
          move: bind(parent, parent.resizeListener)
        }
      })
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoscroll: true,
        listeners: {
          move: bind(parent, parent.dragListener)
        }
      });
  }

  movePx(x,y) {
    this.x = (x / this.containerWidth) * 100;
    this.y = (y / this.containerHeight) * 100;
  }

  resizePx(width, height) {
    this.width = (width / this.containerWidth) * 100
    this.height = (height / this.containerHeight) * 100
  }

  dragListener(event) {
    const x = (this.containerWidth * (this.x/100)) + event.dx;
    const y = (this.containerHeight * (this.y/100)) + event.dy;
    this.movePx(x,y);
  }

  resizeListener(event) {
    const x = (this.containerWidth * (this.x / 100)) + event.deltaRect.left;
    const y = (this.containerHeight * (this.y / 100)) + event.deltaRect.top;
    const width = event.rect.width;
    const height = event.rect.height;

    this.movePx(x, y);
    this.resizePx(width, height);
  }
}
