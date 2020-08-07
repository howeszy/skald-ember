import { Model, hasMany } from 'ember-cli-mirage';

export default Model.extend({
    signers: hasMany('signer'),
    fields: hasMany('field')
});
