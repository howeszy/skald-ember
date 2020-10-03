import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

export default class DocumentViewportCanvasComponent extends Component {
    @tracked wrapper;

    get style() {
        const { zoom, document } = this.args;
        const { width, height, src } = document; 

        return htmlSafe(`
            width: ${width * zoom}px;
            height: ${height * zoom}px;
            font-size: ${10 * zoom}pt;
            background-image: url(${src});
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
