import Model, { attr, belongsTo } from '@ember-data/model';
import { v4 as uuidv4 } from 'uuid';

export default class FieldModel extends Model {
    @attr name;
    @attr x;
    @attr y;
    @attr height;
    @attr width;
    @attr value;
    @attr type;

    guid;
    pending;

    get order() {
        return this.signer.get('order');
    }

    set pending(bool) {
        this.pending = bool;
    }

    constructor(args) {
        super(args)

        this.pending = false;
        this.guid = uuidv4();
    }

    @belongsTo('document') document;
    @belongsTo('signer') signer;
}
