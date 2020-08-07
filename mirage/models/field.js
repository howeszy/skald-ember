import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
    document: belongsTo('document'),
    signer: belongsTo('signer')
});
