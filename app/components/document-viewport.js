import Component from '@glimmer/component';
import M from 'materialize-css';
import { tracked } from '@glimmer/tracking';
import { action, set } from '@ember/object';
import { run, bind } from '@ember/runloop';
import interact from 'interactjs';
import { inject as service } from '@ember/service';

export default class DocumentViewportComponent extends Component {
    @service store;

    @tracked view = 'fitWidth';
    @tracked viewportHeight;
    @tracked viewportWidth;

    viewport;

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

    setupField(id, element) {
        interact(element).resizable({ //make sure the field is real
            margin: 3,
            edges: { left:true, right: true, top: true, bottom: true },
            modifiers: [
                interact.modifiers.restrictEdges({
                    outer: 'parent'
                }),

                interact.modifiers.restrictSize({
                    min: { width: 5, height: 5 }
                })
            ],
            listeners: {
                move: bind(this, this.resizeListener, id)
            }
        })
        .draggable({
            autoscroll: true,
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            listeners: {
                move: bind(this, this.moveListener, id)
            }
        });
    }

    movePx(field, x, y) {
        // convert from percentage to pixels, add the change, convert back to percentage
        set(field, 'x', (((this.scaledWidth * (field.x/100)) + x) / this.scaledWidth) * 100);
        set(field, 'y', (((this.scaledHeight * (field.y/100)) + y) / this.scaledHeight) * 100);
    }

    resizePx(field, width, height) {
        set(field, 'width', (width / this.scaledWidth) * 100);
        set(field, 'height', (height / this.scaledHeight) * 100);
    }

    moveListener(id, event) {
        debugger
        this.store.findRecord('field', id)
            .then((field) => {
                this.movePx(field, event.dx, event.dy);
            });
    }

    resizeListener(id, event) {
        this.fields.find((field) => {
            field.id === id;
        }).then((field) => {
            this.movePx(field, event.deltaRect.left, event.deltaRect.top);
            this.resizePx(field, event.rect.width, event.rect.height);
        });
    }

    @action
    setView(event) {
        const target = event.target;

        this.view = target.options[target.selectedIndex].value;
    }
}
