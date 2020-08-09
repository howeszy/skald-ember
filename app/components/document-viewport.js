import Component from '@glimmer/component';
import M from 'materialize-css';
import { tracked } from '@glimmer/tracking';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DocumentViewportComponent extends Component {
    @service store;

    @tracked view = 'fitWidth';
    @tracked viewportHeight;
    @tracked viewportWidth;
    
    @tracked fields;
    @tracked signers;
    
    @tracked adding = false;

    newField;
    viewport;

    constructor(owner, args) {
        super(owner, args);

        get(this.args.document, 'fields').then((fields) => {
            this.fields = fields.toArray();
        })
        get(this.args.document, 'signers').then((signers) => {
            this.signers = signers.toArray();
        })
    }

    get document() {
        return this.args.document;
    }

    get scaledWidth() {
        const { view, viewportWidth } = this;
        const documentWidth = this.args.document.width;

        if (view && !isNaN(view)) {
            return (view/100) * documentWidth;
        } else {
            return viewportWidth;
        }
    }

    get scaledHeight() {
        return (this.args.document.height * this.scaledWidth) / this.args.document.width;
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

    setupSelect(elem) {
       M.FormSelect.init(elem);
    }

    setupViewport(element, [parent]) {
        parent.setViewport(element)
    }

    findFieldIndex(guid) {
        return this.fields.findIndex((field) => field.guid == guid);
    }

    @action
    movePx(guid, x, y) {
        const index = this.findFieldIndex(guid);
        let field = this.fields[index]

        // convert from percentage to pixels, add the change, convert back to percentage
        field.x = (((this.scaledWidth * (field.x/100)) + x) / this.scaledWidth) * 100
        field.y = (((this.scaledHeight * (field.y/100)) + y) / this.scaledHeight) * 100

        this.fields[index] = field;
    }

    @action
    resizePx(guid, width, height) {
        const index = this.findFieldIndex(guid);
        let field = this.fields[index]

        field.width = (width / this.scaledWidth) * 100
        field.height = (height / this.scaledHeight) * 100

        this.fields[index] = field;
    }

    @action
    transform(x, y, width, height) {
        this.newField = { x, y, width, height }
    }

    @action
    commit() {
        let record = this.store.createRecord('field', {
            ...this.newField,
            document: this.args.document0
        })
    }

    @action
    setView(event) {
        const target = event.target;

        this.view = target.options[target.selectedIndex].value;
    }

    @action
    toggleAdding() {
        this.adding = !this.adding;
        this.newField = undefined;
    }
}
