import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import interact from 'interactjs';


export default class DocumentInteractiveFieldBaseComponent extends Component {
    @tracked cursor = 'pointer';

    get type() {
        return this.args.field.type || 'single-line';
    }

    get style() {
        return htmlSafe(`
            left: ${this.args.field.x}%;
            top: ${this.args.field.y}%;
            height: ${this.args.field.height}%;
            width: ${this.args.field.width}%
        `);
    }

    @action
    setup(element) {
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
                    move: this.resizeListener
                }
            })
            .draggable({
                autoscroll: true,
                modifiers: [
                    interact.modifiers.restrictRect({
                        restriction: 'parent',
                        endOnly: true
                    })
                ],
                listeners: {
                    move: this.moveListener
                }
            });
    }

    onmouseenter

    @action
    onFocus(event) {
        if (this.args.isActive) {
            this.args.onFocus(this.args.field);
        }
    }

    @action
    teardown(element) {
        interact(element).unset();
    }

    @action
    moveListener(event) {
        this.args.onTransform(this.args.field, event.dx, event.dy, 0, 0);
    }

    @action
    resizeListener(event) {
        const { left, top, width, height } = event.deltaRect;
        this.args.onTransform(this.args.field, left, top, width, height);
    }
}
