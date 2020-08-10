import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

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
        if (this.x && this.y && this.height && this.width) {
            this.transform();
            return htmlSafe(`
                left: ${this.x}px;
                top: ${this.y}px;
                height: ${this.height}px;
                width: ${this.width}px
            `);
        }

        return htmlSafe('');
    }

    @action
    transform() {
        const { x, y, width, height } = this;
        let { previousX, previousY, previousWidth, previousHeight } = this;

        const movementX = previousX - x;
        const movementY = previousY - y;
        const movementwidth = previousWidth - width;
        const movementHeight = previousHeight - height;

        this.previousX = x;
        this.previousY = y;
        this.previousWidth = width;
        this.previousHeight = height;

        this.args.onTransform(this.args.field, 
                              movementX,
                              movementY,
                              movementwidth,
                              movementHeight);
    }
}
