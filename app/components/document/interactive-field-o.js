import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';


export default class DocumentInteractiveFieldComponent extends Component {
    @tracked cursor = 'pointer';
    @tracked x = 0;
    @tracked y = 0;
    @tracked width = 0;
    @tracked height = 0;
    @tracked ox = 0;
    @tracked oy = 0;

    element;

    get type() {
        return this.args.field.type || 'single-line';
    }

    get style() {
        return htmlSafe(`
            left: ${this.args.field.x}%;
            top: ${this.args.field.y}%;
            height: ${this.args.field.height}%;
            width: ${this.args.field.width}%
        `);
    }

    get margin() {
        if (this.args.margin) {
            return this.args.margin <= 1 ? 1 : this.args.margin;
        }
        return 5;
    }

    // The following matrixes are cached points interest
    // matrix are defined in order of priotity of event
    // priority is al follows: bottomRight, [right, bottom], body, [topRight, bottomLeft], [top, left], topLeft
    // |-----------------------------------|
    // | 6 |             5             | 4 |
    // |---+---------------------------+---|
    // |   |                           |   |
    // |   |                           |   |
    // | 5 |             3             | 2 |
    // |   |                           |   |
    // |   |                           |   |
    // |---+---------------------------+---|
    // | 4 |             2             | 1 |
    // |-----------------------------------|
    //
    //matrix values should alway run left -> right, top -> bottom

    @computed('width', 'height', 'margin')
    get bottomRightMatrix() {
        const { width, height, margin } = this;
        let xypoints = new Array(margin * 2);

        for(var iy = 0; iy < margin; iy++) {
            for(var ix = 0; ix < margin; ix++) {
                xypoints[ix + (iy * margin)] = [(width - margin  + ix), (height - margin + iy)]
            }
        }

        return xypoints;
    }

    @computed('y', 'width', 'height', 'margin')
    get rightMatrix() {
        const { y, width, height, margin } = this;

        if (height <= margin) {
            return []
        }

        //1 = start
        //n = end
        //r = range
        let y1 = height > margin * 2 ? y + margin : y
        let yn = height - margin;
        let yr = yn - y1;

        let xypoints = new Array(yr * margin);

        for(var iy = 0; iy < yr; iy++) {
            for(var ix = 0; ix < margin; ix++) {
                xypoints[ix + (iy * margin)] = [(width - margin  + ix), (y1 + iy)];
            }
        }

        return xypoints;
    }

    @computed('x', 'width', 'height', 'margin')
    get bottomMatrix() {
        const { x, width, height, margin } = this;

        if (width <= margin) {
            return []
        }

        //1 = start
        //n = end
        //r = range
        let x1 = width > margin * 2 ? x + margin : x
        let xn = width - margin;
        let xr = xn - x1;

        let xypoints = new Array(xr * margin);

        for(var iy = 0; iy < margin; iy++) {
            for(var ix = 0; ix < xr; ix++) {
                xypoints[ix + (iy * margin)] = [(x1 + ix), (height - margin + iy)];
            }
        }

        return xypoints;
    }

    @computed('x', 'y', 'width', 'height', 'margin')
    get bodyMatrix() {
        const { x, y, width, height, margin } = this;

        if (width <= margin || height <= margin) {
            return []
        }

        //1 = start
        //n = end
        //r = range
        let x1 = width > margin * 2 ? x + margin : x
        let xn = width - margin;
        let xr = xn - x1;
        let y1 = height > margin * 2 ? y + margin : y
        let yn = height - margin;
        let yr = yn - y1;

        let xypoints = new Array(xr * yr);

        for(var iy = 0; iy < yr; iy++) {
            for(var ix = 0; ix < xr; ix++) {
                xypoints[ix + (iy * xr)] = [(x1 + ix), (y1 + iy)];
            }
        }

        return xypoints;
    }

    @action
    render(element) {
        this.element = element;
        if (!this.args.ghost) {
            this.ox = element.offsetLeft;
            this.oy = element.offsetTop;
            this.x = element.offsetLeft;
            this.y = element.offsetTop;
            this.width = element.offsetWidth;
            this.height = element.offsetHeight;
        }
    }

    @action
    rerender(element) {
        this.render(element);
    }

    @action
    mousemove(event) {

    }
}
