import Component from '@glimmer/component';
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
} from 'skald/utils/xymargin'

export default class DocumentInteractiveFieldComponent extends Component {
    @tracked zone = 'unknown';

    @tracked isDrawing;
    @tracked x;
    @tracked y;
    @tracked width;
    @tracked height;

    @tracked ox;
    @tracked oy;
    @tracked owidth;
    @tracked oheight;

    element;
    ostate; //state of object before manipulation

    get minWidth() {
        return this.args.minWidth || 10;
    }

    get minHeight() {
        return this.args.minHeight || 10;
    }

    get type() {
        return this.args.field.type || 'single-line';
    }

    get cursor() {
        if (this.isDrawing) {
            return 'pointer';
        }

        switch(this.zone){
            case 'body':
                return 'move';
            case 'bottomRight':
            case 'topLeft':
                return 'nwse-resize';
            case 'right':
            case 'left':
                return 'ew-resize';
            case 'top':
            case 'bottom':
                return 'ns-resize';
            case 'topRight':
            case 'bottomLeft':
                return 'nesw-resize';
            default:
                return 'pointer';
        }
    }

    get style() {
        if (this.x != null && this.y != null  && this.height != null  && this.width != null) {
            return htmlSafe(`
                left: ${this.x}px;
                top: ${this.y}px;
                height: ${this.height}px;
                width: ${this.width}px;
                cursor: ${this.cursor}
            `);
        } else {
            return htmlSafe(`
                left: ${this.args.field.x}%;
                top: ${this.args.field.y}%;
                height: ${this.args.field.height}%;
                width: ${this.args.field.width}%;
                cursor: ${this.cursor}
            `);
        }
    }

    get margin() {
        if (this.args.margin) {
            return this.args.margin <= 1 ? 1 : this.args.margin;
        }
        return 5;
    }

    @computed('owidth', 'oheight', 'margin')
    get bottomRightMatrix() {
        return bottomRight({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get rightMatrix() {
        return right({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get bottomMatrix() {
        return bottom({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get topRightMatrix() {
        return topRight({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get bottomLeftMatrix() {
        return bottomLeft({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get bodyMatrix() {
        return body({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get topMatrix() {
        return top({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get leftMatrix() {
        return left({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    @computed('owidth', 'oheight', 'margin')
    get topLeftMatrix() {
        return topLeft({ width: this.owidth, height: this.oheight, margin: this.margin });
    }

    setZone(x, y) {
        if (this._xyInMatrix(x, y, this.bodyMatrix)) {
            return this.zone = 'body';
        } else if (this._xyInMatrix(x, y, this.bottomRightMatrix)) {
            return this.zone = 'bottomRight';
        } else if (this._xyInMatrix(x, y, this.rightMatrix)){
            return this.zone = 'right'
        } else if (this._xyInMatrix(x, y, this.bottomMatrix)){
            return this.zone = 'bottom'
        } else if (this._xyInMatrix(x, y, this.topRightMatrix)){
            return this.zone = 'topRight'
        } else if (this._xyInMatrix(x, y, this.bottomLeftMatrix)){
            return this.zone = 'bottomLeft'
        } else if (this._xyInMatrix(x, y, this.leftMatrix)){
            return this.zone = 'left'
        } else if (this._xyInMatrix(x, y, this.topMatrix)){
            return this.zone = 'top'
        } else if (this._xyInMatrix(x, y, this.topLeftMatrix)){
            return this.zone = 'topLeft'
        } else {
            return this.zone = 'unknown'
        }
    }
    
    _xyInMatrix(x, y, matrix) {
        if (matrix &&
            (x >= matrix[0][0] && x <= matrix[1][0]) &&
            (y >= matrix[0][1] && y <= matrix[1][1])) {
                return true
        }
        return false
    }

    @action
    render(element) {
        if(!this.element) {
            this.element = element;
        }

        this.ox = this.element.offsetLeft;
        this.oy = this.element.offsetTop;
        this.owidth = this.element.offsetWidth;
        this.oheight = this.element.offsetHeight;
    }

    @action
    rerender(element) {
        this.render(element);
    }

    @action
    mousedown(event) {
        if (event.button == 0 && !this.isDrawing) {
            this._captureRender()
            const { zone } = this;

            if(zone == 'body') {
                this.isDrawing = 'move'
            } else {
                this.isDrawing = zone;
            }

        } else if (event.button == 0 && this.isDrawing) {
            this.isDrawing = null;
            this.args.onTransform(
                this.args.field,
                (this.x - this.ox),
                (this.y - this.oy),
                (this.width - this.owidth),
                (this.height - this.oheight)
            );
            this._releaseRender();
        } else if  (event.button == 2 && this.isDrawing) {
            this.isDrawing = null;
            this._releaseRender();
            event.preventDefault();
        }
    }

    _captureRender() {
        this.x = this.ox;
        this.y = this.oy;
        this.width = this.owidth;
        this.height = this.oheight;
    }

    _releaseRender() {
        this.x = null;
        this.y = null;
        this.width = null;
        this.height = null;
    }

    @action
    mousemove(event) {
        this.setZone(event.offsetX, event.offsetY);
        if (this.isDrawing == 'move') {
            // const x = this.x + event.movementX
            // const y = this.y + event.movementY
            // this.x = x > 0 ? x : 0;
            // this.y = y > 0 ? y : 0;
            var target = event.target
            // keep the dragged position in the data-x/data-y attributes
            var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.movementX
            var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.movementY

            // translate the element
            target.style.webkitTransform =
                target.style.transform =
                'translate(' + x + 'px, ' + y + 'px)'

            // update the posiion attributes
            target.setAttribute('data-x', x)
            target.setAttribute('data-y', y)

        } else if (this.isDrawing == 'right') {
            const width = this.width + event.movementX;
            this.width = width >= this.minWidth ? width : this.minWidth;
        }
    }

    @action
    contextmenu(event) {
        event.preventDefault();
    }
}
