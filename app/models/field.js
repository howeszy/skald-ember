import { v4 as uuidv4 } from 'uuid';

export default class Field {
    id;
    guid;
    x;
    y;
    height;
    width;
    value;
    type;
    order;

    constructor(args) {
        const { id, x, y, height, width, value, type, order } = args;

        this.guid = uuidv4();
        this.id = id;
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.value = value;
        this.type = type;
        this.order = (order || 0);
    }

    get order() {
        if ( !this.signer ) {
            return null;
        }

        return this.signer.order
    }
}
