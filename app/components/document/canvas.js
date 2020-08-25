import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

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

    @action
    contextmenu(event) {
        event.preventDefault();
    }
}
