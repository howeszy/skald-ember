import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class DocumentCanvasComponent extends Component {
    @tracked isDrawing = false;
    @tracked drawX;
    @tracked drawY;
    @tracked drawHeight;
    @tracked drawWidth;

    domElement;

    get isActive() {
        const { domElement } = this; 

        if(!domElement) {
            return this.args.isAdding;
        }

        if (this.args.isAdding) {
            domElement.addEventListener('mousemove', this.mousemove)
            domElement.addEventListener('mousedown', this.mousedown)
        } else {
            this.resetDrawing();
            domElement.removeEventListener('mousemove', this.mousemove)
            domElement.removeEventListener('mousedown', this.mousedown)
        }

        return this.args.isAdding;
    }

    get style() {
        const { zoom, document } = this.args;
        const { width, height, src } = document;

        return htmlSafe(`
            width: ${width * zoom}px;
            height: ${height * zoom}px;
            background-image: url(${src})
        `);
    }

    get editable() {
        return this.args.editable || false;
    }

    willDestroy() {
        console.log('destrpyed')
        this.removeEventListeners();
    }

    resetDrawing() {
        this.isDrawing = false
        this.drawX = undefined;
        this.drawY = undefined;
        this.drawHeight = undefined;
        this.drawWidth = undefined;
    }

    commit() {
        if (this.args.onCommit) {
            this.args.onCommit();
        }
    }

    addEventListeners() {
        this.domElement.addEventListener('mousemove', this.mousemove)
        this.domElement.addEventListener('mousedown', this.mousedown)
    }

    removeEventListeners() {
        this.resetDrawing();
        this.domElement.removeEventListener('mousemove', this.mousemove)
        this.domElement.removeEventListener('mousedown', this.mousedown)
    }

    @action
    setElement(element) {
        this.domElement = element;
    }

    @action
    mousedown(event) {
        if (event.button == 0) {
            if (this.isDrawing) {
                event.stopPropagation();
                this.commit();
                this.resetDrawing();
            } else if (this.domElement == event.target) {
                this.isDrawing = true;
                this.drawX = event.layerX;
                this.drawY = event.layerY;
                this.drawWidth = 0;
                this.drawHeight = 0;
            }
        }
    }

    @action
    mousemove(event) {
        if (this.isDrawing) {
            this.drawWidth = this.drawWidth + event.movementX;
            this.drawHeight = this.drawHeight + event.movementY;
        }
    }
}
