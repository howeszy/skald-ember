import Component from '@glimmer/component';
import interact from 'interactjs';
import { bind } from '@ember/runloop';
import { htmlSafe } from '@ember/template';


export default class DocumentInteractiveFieldBaseComponent extends Component {
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

    setup(element, [component]) {
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
                    move: bind(component, component.resizeListener)
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
                    move: bind(component, component.moveListener)
                }
            });
    }

    moveListener(event) {
        this.args.onMove(this.args.field.guid, event.dx, event.dy);
    }

    resizeListener(event) {
        debugger
        this.args.onMove(this.args.field.guid, event.dx, event.dy);
        this.args.onResize(this.args.field.guid, event.rect.width, event.rect.height);
    }
}
