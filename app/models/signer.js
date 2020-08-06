import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class SignerModel extends Model {
    @attr name;
    @attr order;

    @hasMany('field') fields;
    @belongsTo('document') document;
}
