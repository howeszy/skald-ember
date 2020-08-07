import Model, { attr, belongsTo } from '@ember-data/model';

export default class SignerModel extends Model {
    @attr name;
    @attr order;

    @belongsTo('document') document;
}
