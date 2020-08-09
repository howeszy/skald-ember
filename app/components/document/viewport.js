import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DocumentViewportComponent extends Component {
    @tracked width;
    @tracked height;
    @tracked element;

    get zoom() {
        const { width } = this;
        const { view, document } = this.args;

        if (isNaN(view)) {
            return (width / document.width);
        } else {
            return (view/100);
        }
    }

    @action
    element(element) {
        this.element = element;
        this.resize();
    }

    @action
    resize() {
        this.width = this.element.clientWidth();
        this.height = this.element.clientHeight();
    }

    @action
    transform(field, x, y, width, height) {
        const { zoom } = this;
        const { document } = this.args;
        const scaledWidth =  document.width * zoom;
        const scaledHeight = document.height * zoom;
        
        x = (((field.x / 100) * scaledWidth + x) / scaledWidth) * 100;
        y = (((field.y / 100) * scaledHeight + y) / scaledHeight) * 100;
        width = (width / scaledWidth) * 100;
        height = (height / scaledHeight) * 100


        this.onTransform(field, x, y, width, height);
    }
}
