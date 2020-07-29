import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { bind } from '@ember/runloop';
import interact from 'interactjs';


export default class BasicFieldComponent extends Component {
  @tracked height = 1;
  @tracked width = 1;
  @tracked top = 0;
  @tracked left = 0;
  @tracked value = "";

  get style() {
    return htmlSafe(`left: ${this.left}%; top: ${this.top}%; height: ${this.height}%; width: ${this.width}%`);
  }

  constructor(owner, args) {
    super(...arguments);

    let { height, width, top, left, value } = args.field;

    this.height = height;
    this.width = width;
    this.top = top;
    this.left = left;
    this.value = value;
  }

  interact(element, [parent]) {
    interact(element)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
            endOnly: true
          })
        ],
        autoscroll: true,
        listeners: {
          move: bind(parent, parent.dragMoveListener)
        }
      });
  }

  dragMoveListener(event) {
    const target = event.target;
    // keep the dragged position in the data-x/data-y attributes
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }
}
