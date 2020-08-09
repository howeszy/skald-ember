import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class SignerModel extends Model {
    @attr name;
    @attr order;

    @belongsTo('document') document;
    @hasMany('fields') field;
}
