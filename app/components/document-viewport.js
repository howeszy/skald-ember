import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object' 

export default class DocumentViewportComponent extends Component {
    @tracked fields = [
        {
            height: 2,
            width: 5,
            top: 0,
            left: 0,
            value: 'this is a field'
        }
    ];
    @tracked view = 'fitWidth';
    @tracked viewportHeight;
    @tracked viewportWidth;

    viewport;
    documentHeight;
    documentWidth;
    documentSrc;

    get scaledWidth() {
        const { view, viewportWidth, documentWidth } = this;

        if (view && !isNaN(view)) {
            return (view/100) * documentWidth;
        } else {
            return viewportWidth;
        }
    }

    get scaledHeight() {
        return (this.documentHeight * this.scaledWidth) / this.documentWidth;
    }

    get style() {
      return htmlSafe(`height: ${this.scaledHeight}px; width: ${this.scaledWidth}px; background-image: url(${this.documentSrc})`);
    }

    constructor(owner, args) {
        super(...arguments);

        this.documentHeight = args.height;
        this.documentWidth = args.width;
        this.documentSrc = args.src;
    }

    @action
    setView(view) {
        this.view = view;
    }

    @action 
    setViewport(viewport) {
        this.viewport = viewport;
        this.resizeViewport();
    }

    @action
    setup(element, [parent]) {
        parent.setViewport(element)
    }

    @action
    resizeViewport() {
        if (!this.viewport) {
            return;
        }

        this.viewportHeight = this.viewport.clientHeight;
        this.viewportWidth = this.viewport.clientWidth;
    }
}
