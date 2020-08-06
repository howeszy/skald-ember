import Model, { attr, hasMany } from '@ember-data/model';

export default class DocumentModel extends Model {
    @attr src;
    @attr height;
    @attr width;
    @attr fields;

    @hasMany('signer') signers;
}
