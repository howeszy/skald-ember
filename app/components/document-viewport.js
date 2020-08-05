import Component from '@glimmer/component';
import M from 'materialize-css';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object' 

export default class DocumentViewportComponent extends Component {
    @tracked fields = [
        {
            value: 'this is a field',
            height: 2,
            width: 5,
            x: 0,
            y: 0
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

        console.log(this.view)

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

    setViewport(viewport) {
        this.viewport = viewport;
        this.resizeViewport();
    }
    
    resizeViewport() {
        if (!this.viewport) {
            return;
        }

        this.viewportHeight = this.viewport.clientHeight;
        this.viewportWidth = this.viewport.clientWidth;
    }

    select(elem) {
       M.FormSelect.init(elem);
    }

    @action
    setup(element, [parent]) {
        parent.setViewport(element)
    }

    @action
    setView(event) {
        const target = event.target;

        this.view = target.options[target.selectedIndex].value;
    }
}
