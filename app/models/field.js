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

    get order() {
        return this.signer.get('order');
    }

    constructor(args) {
        super(args)

        this.guid = uuidv4();
    }

    @belongsTo('document') document;
    @belongsTo('signer') signer;
}
