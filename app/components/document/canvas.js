import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class DocumentCanvasComponent extends Component {
    @tracked wrapper;

    get style() {
        const { zoom, document } = this.args;
        const { width, height, src } = document;

        return htmlSafe(`
            width: ${width * zoom}px;
            height: ${height * zoom}px;
            background-image: url(${src})
        `);
    }

    @action
    setWrapper(element) {
        this.wrapper = element;
    }

    @action
    unsetWrapper() {
        this.wrapper = undefined;
    }
}
