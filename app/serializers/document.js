import JSONAPISerializer from '@ember-data/serializer/json-api';
import Field from 'skald/models/field';


export default class DocumentSerializer extends JSONAPISerializer {
    normalizeResponse(store, primaryModelClass, payload, id, requestType) {
        let fields = payload.included.filter((resource) => resource.type == 'fields' || resource.type == 'field');

        // Translate fields into an array object on document
        if (fields.length > 0) {
            const signers = payload.included.filter((resource) => resource.type == 'signers' || resource.type == 'signer');
    
            fields = fields.map((field) => {
                        const signer = signers.find((signer) => signer.id == field.relationships.signer.data.id)
                        if (signer) {
                            field.attributes.order = signer.attributes.order;
                        }
    
                        field.attributes.id = field.id;
                        return field;
                     });
    
            if (Array.isArray(payload.data)) {
                payload.data = payload.data.map((data) => this.injectFields(data, fields));
            } else {
                payload.data = this.injectFields(payload.data, fields);
            }
        }

        payload.included = payload.included.filter((resource) => resource.type != 'fields' && resource.type != 'field');
        return super.normalizeResponse(store, primaryModelClass, payload, id, requestType);
    }

    injectFields(data, fields) {
        const related_field_ids = data.relationships.fields.data.map((field) => field.id);
        const attribute_fields = fields.filter((field) => related_field_ids.includes(field.id))
                                       .map((field) => new Field(field.attributes))

        data.attributes.fields = attribute_fields
        return data
    }
}
