import Model, { attr, belongsTo } from '@ember-data/model';
import { tracked } from '@glimmer/tracking';
import { v4 as uuidv4 } from 'uuid';

export default class FieldModel extends Model {
    @attr name;
    @attr('number', { defaultValue: 0 }) x;
    @attr('number', { defaultValue: 0 }) y;
    @attr('number', { defaultValue: 0 }) height;
    @attr('number', { defaultValue: 0 }) width;
    @attr value;
    @attr type;

    @tracked pending;
    @tracked focused;
    guid;

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
