import Model, { attr, hasMany } from '@ember-data/model';

export default class DocumentModel extends Model {
    @attr src;
    @attr height;
    @attr width;

    @hasMany('signer') signers;
    @hasMany('fields') fields;

    fields_cache;
    get cached_fields() {
        if (!this.fields_cache) {
            this.fields_cache = this.fields.toArray();
        }

        return this.fields_cache;
    }

    set cached_fields(array) {
        this.fields_cache = array;
    }

    commit_cached_fields() {
        if (!this.fields_cache) {
            return;
        }

        this.fields_cache.forEach((field) => {
            let record = this.store.findRecord('field', field.id)
            let properties = Object.fromEntries(
                                Object.keys(field)
                                      .filter((key) => !['id', 'guid'].includes(key))
                                      .map((key) => [key, field[key]])
                             );
            record.setProperties(properties)
        })

        this.fields.toArray().forEach((field) => {
            let in_cache = this.fields_cache.find((cache) => cache.id == field.id);

            if (!in_cache) {
                this.fields.removeObject(field);
                this.store.unloadRecord(field);
            }
        })

        this.clear_cached_fields;
    }

    clear_cached_fields() {
        this.fields_cache = null;
    }
}
