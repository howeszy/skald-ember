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
            this.args.onCommit(this.args.field)
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
            
            // new rect
            let x2;
            let y2;
            if (event.target == this.args.parent) {
                x2 = event.layerX;
                y2 = event.layerY;
            } else if (event.target == this.element) {
                const layerX = event.target.offsetLeft + event.layerX;
                const layerY = event.target.offsetTop + event.layerY;
                x2 = layerX;
                y2 = layerY;
            } else {  // short circuit and return
                return
            }
            const width2 = Math.abs(ox - x2);
            const height2 = Math.abs(oy - y2);

            //compare
            let dx = 0;
            let dy = 0;
            let dwidth = width2 - width;
            let dheight = height2 - height;

            if (x <= ox && x2 < ox) {
                dx = x2 - x;
            } else if (x > ox && x2 < ox) {
                dx = ox - x2;
            } else if (x < ox && x2 >= ox) {
                dx = ox - x;
            } else {
                dx = 0;
            }

            if (y <= oy && y2 < oy) {
                dy = y2 - y;
            } else if (y > oy && y2 < oy) {
                dy = oy - y2;
            } else if (y < oy && y2 >= oy) {
                dy = oy - y;
            } else {
                dy = 0;
            }

            // apply delta
            this.x = this.x + dx;
            this.y = this.y + dy;
            this.width = this.width + dwidth;
            this.height = this.height + dheight;

            this.args.onTransform(this.args.field, dx, dy, dwidth, dheight);
        }
    }
}
