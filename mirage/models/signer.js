import { Model, hasMany, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
    document: belongsTo('document'),
    fields: hasMany('field')
});
