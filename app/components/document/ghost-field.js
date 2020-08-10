import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import { run, bind } from '@ember/runloop';


export default class DocumentGhostFieldComponent extends Component {
    previousX = 0;
    previousY = 0;
    previousWidth = 0;
    previousHeight = 0;

    get x() {
        if (this.args.width < 0) {
            return this.args.x + this.args.width;
        }
        return this.args.x;
    }

    get y() {
        if (this.args.height < 0) {
            return this.args.y + this.args.height;
        }
        return this.args.y;
    }

    get width() {
        if (this.args.width < 0) {
            return -this.args.width;
        }
        return this.args.width;
    }

    get height() {
        if (this.args.height < 0) {
            return -this.args.height;
        }
        return this.args.height;
    }

    get style() {
        return htmlSafe(`
            left: ${this.args.field.x}%;
            top: ${this.args.field.y}%;
            height: ${this.args.field.height}%;
            width: ${this.args.field.width}%
        `);
    }

    get transformMarix() {
        const { x, y, width, height } = this;

        if (x && y && width && height) {
            this.transform();
            return true
        }
        return false
    }

    @action
    transform() {
        const { x, y, width, height } = this;
        let { previousX, previousY, previousWidth, previousHeight } = this;

        const movementX = previousX - x;
        const movementY = previousY - y;
        const movementWidth = -(previousWidth - width);
        const movementHeight = -(previousHeight - height);

        this.previousX = x;
        this.previousY = y;
        this.previousWidth = width;
        this.previousHeight = height;

        this.args.onTransform(this.args.field, 
                              movementX,
                              movementY,
                              movementWidth,
                              movementHeight);
    }
}
