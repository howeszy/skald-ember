import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

export default class DocumentGhostFieldComponent extends Component {
    isDrawing = false;
    ox = 0;
    oy = 0;
    x = 0;
    y = 0;
    height = 0;
    width = 0;
    element;

    get isActive() {
        return this.args.isActive;
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
        this.element = element;
        this.args.parent.addEventListener('mousedown', this.mousedown)
        this.args.parent.addEventListener('mousemove', this.mousemove)
    }

    @action
    teardown() {
        this.args.parent.removeEventListener('mousedown', this.mousedown)
        this.args.parent.removeEventListener('mousemove', this.mousemove)
    }

    @action
    mousedown(event) {
        if(this.isDrawing)  {
            this.isDrawing = false;
            //commit will go here
        } else if(event.target == this.args.parent) {
            this.isDrawing = true;
            this.ox = event.layerX;
            this.oy = event.layerY;
            this.x = event.layerX;
            this.y = event.layerY;
            this.args.onTransform(this.args.field, event.layerX, event.layerY, 0, 0);
        }
    }

    @action
    mousemove(event) {
        if(this.isDrawing) {
            // previous rect
            const { x, y, height, width, ox, oy } = this
            let x2;
            let y2;
            // new rect
            if (event.target == this.args.parent) {
                x2 = event.layerX >= ox ? ox : event.layerX;
                y2 = event.layerY >= oy ? oy : event.layerY;
            } else if (event.target == this.element) {
                const layerX = event.target.offsetLeft + event.layerX;
                const layerY = event.target.offsetTop + event.layerY;
                x2 = layerX >= ox ? ox : layerX;
                y2 = layerY >= oy ? oy : layerY;
            } else {
                return
            }

            const width2 = Math.abs(ox - x2);
            const height2 = Math.abs(oy - y2);

            const dx = x - x2;
            const dy = y - y2;
            const dwidth = width2 - width;
            const dheight = height2 - height;

            this.x = x2;
            this.y = y2;
            this.width = width;
            this.height = height;

            this.args.onTransform(this.args.field, dx, dy, dwidth, dheight);
        }
    }
}
