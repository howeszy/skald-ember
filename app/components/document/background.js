import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class DocumentBackgroundComponent extends Component {
    @tracked drawing = false;
    @tracked drawX;
    @tracked drawY;
    @tracked drawHeight;
    @tracked drawWidth;

    element;
    ghostRegex = new RegExp('ghost');
    documentRegex = new RegExp('document');
    fieldRegex = new RegExp('field');

    get active() {
        const { element } = this;

        if(!element) {
            return this.args.adding;
        }
        
        if (this.args.adding) {
            element.addEventListener('mousemove', this.mousemove)
            element.addEventListener('mousedown', this.mousedown)
            element.addEventListener('mouseup', this.mouseup)
        } else {
            this.resetDrawing();
            element.removeEventListener('mousemove', this.mousemove)
            element.removeEventListener('mousedown', this.mousedown)
            element.removeEventListener('mouseup', this.mouseup)
        }

        return this.args.adding;
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

    resetDrawing() {
        this.drawing = false;
        this.drawX = undefined;
        this.drawY = undefined;
        this.drawHeight = undefined;
        this.drawWidth = undefined;
    }

    @action
    commit() {
        if (this.args.onCommit) {
            this.args.onCommit();
        }
    }

    @action
    setElement(element) {
        this.element = element;
    }

    @action
    mousedown(event) {
        if (!this.editable || event.button != 0 || this.drawing) {
            return;
        }

        this.drawing = true;
        this.drawX = event.layerX;
        this.drawY = event.layerY;
        this.drawWidth = 0;
        this.drawHeight = 0;
    }

    @action
    mouseup() {
        if (!this.editable || !this.drawing) {
            return;
        }

        this.resetDrawing();
        this.commit();
    }

    @action
    mousemove(event) {
        if (!this.editable) {
            return;
        }

        if (this.drawing && event.buttons == 1) {
            if (this.documentRegex.test(event.target.className)) {
                this.drawWidth = event.layerX - this.drawX;
                this.drawHeight = event.layerY - this.drawY;
            } else if (this.ghostRegex.test(event.target.className)) { // TODO: Account for negative sizing down
                if (this.drawWidth >= 0) {
                    this.drawWidth = this.drawWidth - (this.drawWidth - event.layerX);
                } else {
                    this.drawWidth = this.drawWidth + event.layerX;
                }

                if (this.drawHeight >= 0) {
                    this.drawHeight = this.drawHeight - (this.drawHeight - event.layerY);
                } else {
                    this.drawHeight = this.drawHeight + event.layerY;
                }
                
            }
        } else if(this.drawing) {
            this.resetDrawing();
        }
    }
}
