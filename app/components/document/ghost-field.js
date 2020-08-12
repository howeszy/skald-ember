import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

export default class DocumentGhostFieldComponent extends Component {
    isDrawing = false;
    pinnedX = 0;
    pinnedY = 0;
    x = 0;
    y = 0;
    height = 0;
    width = 0;

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
    setup(element, [parent]) {
        parent.addEventListener('mousedown', this.mousedown)
        parent.addEventListener('mousemove', this.mousemove)
    }

    @action
    teardown(element, [parent]) {
        parent.removeEventListener('mousedown', this.mousedown)
        parent.removeEventListener('mousemove', this.mousemove)
    }

    @action
    mousedown(event) {
        if(this.isDrawing)  {
            this.isDrawing = false;
            //commit will go here
        } else if(event.target == this.args.parent) {
            this.isDrawing = true;
            this.x = event.layerX;
            this.pinnedX = event.layerX;
            this.y = event.layerY;
            this.pinnedY = event.layerY;
            this.args.onTransform(this.args.field, event.layerX, event.layerY, 0, 0);
        }
    }

    @action
    mousemove(event) {
        console.log('move')
        if(this.isDrawing) {
            const { movementX, movementY } = event;
            let { pinnedX, pinnedY, x, y, width, height } = this;

            let deltaX = 0;
            let deltaY = 0;
            let deltaWidth = movementX;
            let deltaHeight = 0;

            if (x == pinnedX) {
                if (width + deltaWidth < 0) {
                    width = Math.abs(width + deltaWidth);
                    deltaWidth = Math.abs(deltaHeight) - height;
                    x = pinnedX - width;
                } else {
                    width = width + deltaWidth;
                }
            } else {
                if (x + deltaWidth >= pinnedX) {
                    width = Math.abs(width - deltaWidth);
                    deltaWidth = Math.abs(deltaHeight) - height;
                    x = pinnedX;
                } else {
                    width = width - deltaWidth;
                    deltaX = deltaWidth;
                }
            }
            
            if (y == pinnedY) {
                if (height + movementY < 0) {
                    deltaHeight = Math.abs(height + movementY) - height;
                    height = Math.abs(height + movementY);
                    deltaY = -height;
                    y = pinnedY - height;
                } else {
                    deltaHeight = movementY;
                    height = height + movementY;
                }
            } else {
                if (height - movementY < 0) {
                    deltaHeight = Math.abs(height - movementY) - height;
                    height = Math.abs(height - movementY);
                    deltaY = pinnedY - y;
                    y = pinnedY;
                } else {
                    deltaHeight = -movementY;
                    height = height - movementY;
                    deltaY = movementY;
                    y = y + movementY;
                }
            }

            this.x = x;
            this.y = y,
            this.height = height;
            this.width = width;

            this.args.onTransform(this.args.field, deltaX, deltaY, deltaWidth, deltaHeight);
        }
    }
}
