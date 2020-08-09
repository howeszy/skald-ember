import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DocumentBackgroundComponent extends Component {
    @tracked mouseActive = false;
    @tracked mouseX;
    @tracked mouseY;
    @tracked mouseHeight;
    @tracked mouseWidth;

    ghostRegex = new RegExp('ghost-mouse-move-handler');
    documentRegex = new RegExp('document-mouse-move-handler');

    get interactable() {
        return this.args.interactable || true;
    }

    get ghostX() {
        if (this.mouseWidth < 0) {
            return this.mouseX + this.mouseWidth;
        }
        return this.mouseX;
    }

    get ghostY() {
        if (this.mouseHeight < 0) {
            return this.mouseY + this.mouseHeight;
        }
        return this.mouseY;
    }

    get ghostWidth() {
        if (this.mouseWidth < 0) {
            return -this.mouseWidth;
        }
        return this.mouseWidth;
    }

    get ghostHeight() {
        if (this.mouseHeight < 0) {
            return -this.mouseHeight;
        }
        return this.mouseHeight;
    }

    @action
    mousedown(event) {
        if (this.interactable && event.button != 0 || this.mouseActive) {
            return;
        }

        this.mouseActive = true;
        this.mouseX = event.layerX;
        this.mouseY = event.layerY;
        this.mouseWidth = 0;
        this.mouseHeight = 0;
    }

    @action
    mouseup() {
        if (this.interactable && !this.mouseActive) {
             return;
        }

        this.mouseActive = false;
        this.mouseX = undefined;
        this.mouseY = undefined;
        this.mouseHeight = undefined;
        this.mouseWidth = undefined;
    }

    @action
    mousemove(event) {
        if (!this.interactable) {
            return;
        }

        if (this.mouseActive && event.buttons == 1) {
            if (this.documentRegex.test(event.target.className)) {
                this.mouseWidth = event.layerX - this.mouseX;
                this.mouseHeight = event.layerY - this.mouseY;
            } else if (this.ghostRegex.test(event.target.className)) { // TODO: Account for negative sizing down
                if (this.mouseWidth >= 0) {
                    this.mouseWidth = this.mouseWidth - (this.mouseWidth - event.layerX);
                } else {
                    this.mouseWidth = this.mouseWidth + event.layerX;
                }

                if (this.mouseHeight >= 0) {
                    this.mouseHeight = this.mouseHeight - (this.mouseHeight - event.layerY);
                } else {
                    this.mouseHeight = this.mouseHeight + event.layerY;
                }
                
            }
        } else if(this.mouseActive) {
            this.mouseup();
        }
    }
}
